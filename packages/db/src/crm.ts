/**
 * @nedora/db/crm
 * Server-side helpers for microCRM operations.
 * PII is encrypted with @nedora/crypto before write; decrypt in UI via @nedora/db/pii.
 */

import {
  encryptPii,
  encryptPiiOptional,
  hashPiiLookup,
} from '@nedora/crypto/pii'
import { createServiceClient } from './server'
import type { Database, LeadStatus } from './types'

type ContactInsert = Database['public']['Tables']['crm_contacts']['Insert']
type LeadInsert = Database['public']['Tables']['crm_leads']['Insert']
type RequestInsert = Database['public']['Tables']['crm_project_requests']['Insert']

export type ContactPiiInput = {
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
  source?: string | null
}

function toContactRow(data: ContactPiiInput): ContactInsert {
  return {
    email_hash: hashPiiLookup(data.email),
    email_ciphertext: encryptPii(data.email.trim()),
    first_name_ciphertext: encryptPiiOptional(data.firstName),
    last_name_ciphertext: encryptPiiOptional(data.lastName),
    company_ciphertext: encryptPiiOptional(data.company),
    phone_ciphertext: encryptPiiOptional(data.phone),
    address_line1_ciphertext: encryptPiiOptional(data.addressLine1),
    address_line2_ciphertext: encryptPiiOptional(data.addressLine2),
    city_ciphertext: encryptPiiOptional(data.city),
    postal_code_ciphertext: encryptPiiOptional(data.postalCode),
    country_ciphertext: encryptPiiOptional(data.country),
    notes_ciphertext: encryptPiiOptional(data.notes),
    source: data.source ?? null,
  }
}

function toRequestPiiRow(payload: {
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
}): Pick<
  RequestInsert,
  | 'email_hash'
  | 'email_ciphertext'
  | 'first_name_ciphertext'
  | 'last_name_ciphertext'
  | 'company_ciphertext'
  | 'message_ciphertext'
  | 'address_line1_ciphertext'
  | 'address_line2_ciphertext'
  | 'city_ciphertext'
  | 'postal_code_ciphertext'
  | 'country_ciphertext'
> {
  return {
    email_hash: hashPiiLookup(payload.email),
    email_ciphertext: encryptPii(payload.email.trim()),
    first_name_ciphertext: encryptPii(payload.firstName.trim()),
    last_name_ciphertext: encryptPii(payload.lastName.trim()),
    company_ciphertext: encryptPiiOptional(payload.company),
    message_ciphertext: encryptPiiOptional(payload.message),
    address_line1_ciphertext: encryptPiiOptional(payload.addressLine1),
    address_line2_ciphertext: encryptPiiOptional(payload.addressLine2),
    city_ciphertext: encryptPiiOptional(payload.city),
    postal_code_ciphertext: encryptPiiOptional(payload.postalCode),
    country_ciphertext: encryptPiiOptional(payload.country),
  }
}

// ── Contacts ─────────────────────────────────────────────────────────────────

/** Upsert a contact by email hash. Returns the contact id. */
export async function upsertContact(data: ContactPiiInput) {
  const db = createServiceClient()
  const row = toContactRow(data)

  const { data: contact, error } = await db
    .from('crm_contacts')
    .upsert(row, { onConflict: 'email_hash', ignoreDuplicates: false })
    .select('id')
    .single()

  if (error) throw error
  return contact
}

// ── Project requests (from landing page form) ─────────────────────────────────

export async function createProjectRequest(payload: {
  firstName: string
  lastName: string
  email: string
  company?: string
  projectType: string
  engagementModel: string
  timeline: string
  message?: string
  locale?: string
  addressLine1?: string
  addressLine2?: string
  city?: string
  postalCode?: string
  country?: string
}) {
  const db = createServiceClient()

  const contact = await upsertContact({
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    company: payload.company,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2,
    city: payload.city,
    postalCode: payload.postalCode,
    country: payload.country,
    source: 'website_form',
  })

  const pii = toRequestPiiRow(payload)

  const { data: request, error: reqErr } = await db
    .from('crm_project_requests')
    .insert({
      contact_id: contact.id,
      ...pii,
      project_type: payload.projectType as RequestInsert['project_type'],
      engagement_model: payload.engagementModel as RequestInsert['engagement_model'],
      timeline: payload.timeline as RequestInsert['timeline'],
      locale: payload.locale ?? 'en',
    })
    .select('id')
    .single()

  if (reqErr) throw reqErr

  const { error: leadErr } = await db.from('crm_leads').insert({
    contact_id: contact.id,
    status: 'new',
    project_type: payload.projectType as LeadInsert['project_type'],
    engagement_model: payload.engagementModel as LeadInsert['engagement_model'],
    timeline: payload.timeline as LeadInsert['timeline'],
  })

  if (leadErr) throw leadErr

  return { contactId: contact.id, requestId: request.id }
}

// ── Newsletter ────────────────────────────────────────────────────────────────

export async function subscribeToNewsletter(data: {
  email: string
  firstName?: string
  lastName?: string
  locale?: string
  source?: string
}) {
  const db = createServiceClient()

  const { error } = await db.from('crm_newsletter_subscribers').upsert(
    {
      email_hash: hashPiiLookup(data.email),
      email_ciphertext: encryptPii(data.email.trim()),
      first_name_ciphertext: encryptPiiOptional(data.firstName),
      last_name_ciphertext: encryptPiiOptional(data.lastName),
      locale: data.locale ?? 'en',
      source: data.source ?? 'website_form',
      status: 'active',
      consent_given_at: new Date().toISOString(),
    },
    { onConflict: 'email_hash', ignoreDuplicates: false },
  )

  if (error) throw error
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export async function getLeads(options?: { status?: string; limit?: number }) {
  const db = createServiceClient()

  let query = db
    .from('crm_leads')
    .select(
      `
      *,
      crm_contacts ( * )
    `,
    )
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status as LeadStatus)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateLeadStatus(leadId: string, status: LeadStatus) {
  const db = createServiceClient()

  const { error } = await db
    .from('crm_leads')
    .update({ status })
    .eq('id', leadId)

  if (error) throw error
}
