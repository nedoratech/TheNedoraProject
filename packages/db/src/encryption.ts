/**
 * Per-subject encryption via nedora_encryption_store.
 * Use from landing (form submit), microCRM, microCMS, and other server-only code.
 */

import {
  decryptWithKeyOptional,
  encryptWithKey,
  encryptWithKeyOptional,
  generateDek,
  hashLookupWithKey,
} from '@nedora/crypto/cipher'
import { createServiceClient } from './server'
import type { Database } from './types'
import type { SupabaseClient } from '@supabase/supabase-js'

const STORE_TABLE = 'nedora_encryption_store' as const

type ContactRow = Database['public']['Tables']['crm_contacts']['Row']
type RequestRow = Database['public']['Tables']['crm_project_requests']['Row']
type SubscriberRow = Database['public']['Tables']['crm_newsletter_subscribers']['Row']

export type DecryptedContact = {
  id: string
  subject_id: string | null
  email: string
  first_name: string | null
  last_name: string | null
  company: string | null
  phone: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  postal_code: string | null
  country: string | null
  source: string | null
  tags: string[]
  notes: string | null
  created_at: string
  updated_at: string
}

export type DecryptedNewsletterSubscriber = {
  id: string
  subject_id: string | null
  email: string
  first_name: string | null
  last_name: string | null
  locale: string
  status: string
  consent_given_at: string | null
  source: string | null
  created_at: string
}

/** Resolve an existing landing contact from profiles (fast, indexed email). */
async function findSubjectIdByProfileEmail(
  db: SupabaseClient<Database>,
  email: string,
): Promise<string | null> {
  const { data, error } = await db
    .from('profiles')
    .select('id')
    .ilike('email', email)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data?.id ?? null
}

/** Backfill profiles when auth exists but the row was removed or the trigger did not run. */
async function ensureContactProfile(
  db: SupabaseClient<Database>,
  subjectId: string,
  email: string,
  fullName?: string,
): Promise<void> {
  const { data: authData, error: authErr } = await db.auth.admin.getUserById(subjectId)
  if (authErr) throw authErr

  const displayName = fullName ?? email
  const metadataRole =
    typeof authData.user.user_metadata?.role === 'string' ? authData.user.user_metadata.role : null

  const { data: profile, error: profErr } = await db
    .from('profiles')
    .select('id, role')
    .eq('id', subjectId)
    .maybeSingle()

  if (profErr) throw profErr

  if (!profile) {
    const { error: insertErr } = await db.from('profiles').insert({
      id: subjectId,
      email,
      full_name: displayName,
      role: metadataRole ?? 'contact',
    })
    if (insertErr) throw insertErr
    return
  }

  const { error: updateErr } = await db
    .from('profiles')
    .update({ email, full_name: displayName })
    .eq('id', subjectId)
  if (updateErr) throw updateErr
}

async function findAuthUserIdByEmail(
  db: SupabaseClient<Database>,
  email: string,
): Promise<string | null> {
  let page = 1
  const perPage = 1000

  while (true) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage })
    if (error) throw error

    const match = data.users.find((u) => u.email?.toLowerCase() === email)
    if (match) return match.id

    if (data.users.length < perPage) break
    page++
  }

  return null
}

async function findExistingSubjectIdByEmail(
  db: SupabaseClient<Database>,
  email: string,
): Promise<string | null> {
  return (
    (await findSubjectIdByProfileEmail(db, email)) ??
    (await findAuthUserIdByEmail(db, email))
  )
}

function dekFromRow(dekB64: string): Buffer {
  const dek = Buffer.from(dekB64, 'base64')
  if (dek.length !== 32) {
    throw new Error('Invalid DEK in encryption store')
  }
  return dek
}

export async function getSubjectDek(subjectId: string): Promise<Buffer> {
  const db = createServiceClient()
  const { data, error } = await db
    .from(STORE_TABLE)
    .select('dek_b64')
    .eq('subject_id', subjectId)
    .maybeSingle()

  if (error) throw error
  if (!data?.dek_b64) {
    throw new Error(`No encryption key for subject ${subjectId}`)
  }
  return dekFromRow(data.dek_b64)
}

export async function ensureSubjectDek(subjectId: string): Promise<Buffer> {
  const db = createServiceClient()
  const { data, error } = await db
    .from(STORE_TABLE)
    .select('dek_b64')
    .eq('subject_id', subjectId)
    .maybeSingle()

  if (error) throw error
  if (data?.dek_b64) {
    return dekFromRow(data.dek_b64)
  }

  const dek = generateDek()
  const { error: insertErr } = await db.from(STORE_TABLE).insert({
    subject_id: subjectId,
    dek_b64: dek.toString('base64'),
  })

  if (insertErr) throw insertErr
  return dek
}

export async function encryptForSubject(subjectId: string, plaintext: string): Promise<string> {
  const dek = await getSubjectDek(subjectId)
  return encryptWithKey(dek, plaintext)
}

export async function encryptOptionalForSubject(
  subjectId: string,
  value: string | null | undefined,
): Promise<string | null> {
  const dek = await getSubjectDek(subjectId)
  return encryptWithKeyOptional(dek, value)
}

export async function decryptForSubject(
  subjectId: string,
  ciphertext: string | null | undefined,
): Promise<string | null> {
  const dek = await getSubjectDek(subjectId)
  return decryptWithKeyOptional(dek, ciphertext)
}

export async function hashEmailForSubject(subjectId: string, email: string): Promise<string> {
  const dek = await getSubjectDek(subjectId)
  return hashLookupWithKey(dek, email, 'email')
}

async function decryptField(
  subjectId: string | null | undefined,
  ciphertext: string | null | undefined,
): Promise<string | null> {
  if (!ciphertext) return null
  if (!subjectId) {
    if (ciphertext.startsWith('v1:')) return null
    return ciphertext
  }
  const dek = await getSubjectDek(subjectId)
  return decryptWithKeyOptional(dek, ciphertext)
}

export async function decryptContact(row: ContactRow): Promise<DecryptedContact> {
  const subjectId = row.subject_id
  return {
    id: row.id,
    subject_id: subjectId,
    email: (await decryptField(subjectId, row.email_ciphertext)) ?? '',
    first_name: await decryptField(subjectId, row.first_name_ciphertext),
    last_name: await decryptField(subjectId, row.last_name_ciphertext),
    company: await decryptField(subjectId, row.company_ciphertext),
    phone: await decryptField(subjectId, row.phone_ciphertext),
    address_line1: await decryptField(subjectId, row.address_line1_ciphertext),
    address_line2: await decryptField(subjectId, row.address_line2_ciphertext),
    city: await decryptField(subjectId, row.city_ciphertext),
    postal_code: await decryptField(subjectId, row.postal_code_ciphertext),
    country: await decryptField(subjectId, row.country_ciphertext),
    source: row.source,
    tags: row.tags,
    notes: await decryptField(subjectId, row.notes_ciphertext),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function decryptNewsletterSubscriber(
  row: SubscriberRow,
): Promise<DecryptedNewsletterSubscriber> {
  const subjectId = row.subject_id
  return {
    id: row.id,
    subject_id: subjectId,
    email: (await decryptField(subjectId, row.email_ciphertext)) ?? '',
    first_name: await decryptField(subjectId, row.first_name_ciphertext),
    last_name: await decryptField(subjectId, row.last_name_ciphertext),
    locale: row.locale,
    status: row.status,
    consent_given_at: row.consent_given_at,
    source: row.source,
    created_at: row.created_at,
  }
}

export async function decryptContactFromJoin(
  contact: ContactRow | ContactRow[] | null | undefined,
): Promise<DecryptedContact | null> {
  if (!contact) return null
  const row = Array.isArray(contact) ? contact[0] : contact
  if (!row) return null
  return decryptContact(row)
}

export async function decryptRequestFields(
  row: Pick<
    RequestRow,
    | 'subject_id'
    | 'first_name_ciphertext'
    | 'last_name_ciphertext'
    | 'email_ciphertext'
    | 'company_ciphertext'
    | 'message_ciphertext'
  >,
  fallbackSubjectId?: string | null,
) {
  const subjectId = row.subject_id ?? fallbackSubjectId ?? null
  return {
    firstName: await decryptField(subjectId, row.first_name_ciphertext),
    lastName: await decryptField(subjectId, row.last_name_ciphertext),
    email: await decryptField(subjectId, row.email_ciphertext),
    company: await decryptField(subjectId, row.company_ciphertext),
    message: await decryptField(subjectId, row.message_ciphertext),
  }
}

export type ProvisionContactSubjectInput = {
  email: string
  firstName?: string | null
  lastName?: string | null
}

export async function provisionContactSubject(
  input: ProvisionContactSubjectInput,
): Promise<{ subjectId: string }> {
  const db = createServiceClient()
  const email = input.email.trim().toLowerCase()
  const fullName =
    [input.firstName, input.lastName].filter(Boolean).join(' ').trim() || undefined

  let subjectId = await findExistingSubjectIdByEmail(db, email)

  if (!subjectId) {
    const { data: created, error: createErr } = await db.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: {
        role: 'contact',
        full_name: fullName ?? email,
      },
    })

    if (createErr) {
      const existingId = await findExistingSubjectIdByEmail(db, email)
      if (!existingId) throw createErr
      subjectId = existingId
    } else {
      subjectId = created.user.id
    }
  }

  await ensureContactProfile(db, subjectId, email, fullName)
  await ensureSubjectDek(subjectId)
  return { subjectId }
}

export type ContactFieldsPlain = {
  email: string
  firstName?: string | null
  lastName?: string | null
  company?: string | null
  phone?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  postalCode?: string | null
  country?: string | null
  notes?: string | null
}

export async function encryptContactFields(subjectId: string, data: ContactFieldsPlain) {
  const [emailHash, emailCiphertext, firstName, lastName, company, phone, addressLine1, addressLine2, city, postalCode, country, notes] =
    await Promise.all([
      hashEmailForSubject(subjectId, data.email),
      encryptForSubject(subjectId, data.email.trim()),
      encryptOptionalForSubject(subjectId, data.firstName),
      encryptOptionalForSubject(subjectId, data.lastName),
      encryptOptionalForSubject(subjectId, data.company),
      encryptOptionalForSubject(subjectId, data.phone),
      encryptOptionalForSubject(subjectId, data.addressLine1),
      encryptOptionalForSubject(subjectId, data.addressLine2),
      encryptOptionalForSubject(subjectId, data.city),
      encryptOptionalForSubject(subjectId, data.postalCode),
      encryptOptionalForSubject(subjectId, data.country),
      encryptOptionalForSubject(subjectId, data.notes),
    ])

  return {
    subject_id: subjectId,
    email_hash: emailHash,
    email_ciphertext: emailCiphertext,
    first_name_ciphertext: firstName,
    last_name_ciphertext: lastName,
    company_ciphertext: company,
    phone_ciphertext: phone,
    address_line1_ciphertext: addressLine1,
    address_line2_ciphertext: addressLine2,
    city_ciphertext: city,
    postal_code_ciphertext: postalCode,
    country_ciphertext: country,
    notes_ciphertext: notes,
  }
}

export type RequestFieldsPlain = {
  email: string
  firstName: string
  lastName: string
  company?: string | null
  message?: string | null
  addressLine1?: string | null
  addressLine2?: string | null
  city?: string | null
  postalCode?: string | null
  country?: string | null
}

export async function encryptRequestFields(subjectId: string, data: RequestFieldsPlain) {
  const [emailHash, emailCiphertext, firstName, lastName, company, message, addressLine1, addressLine2, city, postalCode, country] =
    await Promise.all([
      hashEmailForSubject(subjectId, data.email),
      encryptForSubject(subjectId, data.email.trim()),
      encryptForSubject(subjectId, data.firstName.trim()),
      encryptForSubject(subjectId, data.lastName.trim()),
      encryptOptionalForSubject(subjectId, data.company),
      encryptOptionalForSubject(subjectId, data.message),
      encryptOptionalForSubject(subjectId, data.addressLine1),
      encryptOptionalForSubject(subjectId, data.addressLine2),
      encryptOptionalForSubject(subjectId, data.city),
      encryptOptionalForSubject(subjectId, data.postalCode),
      encryptOptionalForSubject(subjectId, data.country),
    ])

  return {
    subject_id: subjectId,
    email_hash: emailHash,
    email_ciphertext: emailCiphertext,
    first_name_ciphertext: firstName,
    last_name_ciphertext: lastName,
    company_ciphertext: company,
    message_ciphertext: message,
    address_line1_ciphertext: addressLine1,
    address_line2_ciphertext: addressLine2,
    city_ciphertext: city,
    postal_code_ciphertext: postalCode,
    country_ciphertext: country,
  }
}
