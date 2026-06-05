/**
 * @nedora/db/crm
 * Server-side helpers for microCRM operations.
 * Sensitive fields use per-subject keys in nedora_encryption_store (@nedora/db/encryption).
 */

import {
  encryptContactFields,
  encryptForSubject,
  encryptOptionalForSubject,
  encryptRequestFields,
  hashEmailForSubject,
  provisionContactSubject,
} from './encryption'
import { createServiceClient } from './server'
import type { CrmInquiryType, Database, LeadStatus } from './types'

type ContactInsert = Database['public']['Tables']['crm_contacts']['Insert']
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

// ── Contacts ─────────────────────────────────────────────────────────────────

/** Upsert a contact by subject (auth user). Returns the contact id. */
export async function upsertContact(data: ContactPiiInput) {
  const db = createServiceClient()
  const { subjectId } = await provisionContactSubject({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  })
  const encrypted = await encryptContactFields(subjectId, data)
  const row: ContactInsert = {
    ...encrypted,
    source: data.source ?? null,
  }

  const { data: contact, error } = await db
    .from('crm_contacts')
    .upsert(row, { onConflict: 'subject_id', ignoreDuplicates: false })
    .select('id')
    .single()

  if (error) throw error
  return { ...contact, subjectId }
}

// ── Project requests (from landing page form) ─────────────────────────────────

export async function createProjectRequest(payload: {
  inquiryType: CrmInquiryType
  firstName: string
  lastName: string
  email: string
  company?: string
  projectType?: string
  engagementModel?: string
  timeline: string
  message?: string
  locale?: string
  ipAddress?: string | null
  addressLine1?: string
  addressLine2?: string
  city?: string
  postalCode?: string
  country?: string
  /** Submission channel. Defaults to 'landing_contact_form'. Use 'nedai_website' for NedAI demo requests. */
  source?: 'landing_contact_form' | 'nedai_website' | 'referral' | 'other'
}) {
  const db = createServiceClient()
  const isProjectRequest = payload.inquiryType === 'project_request'
  // Demo requests also carry company info; contact-only messages do not.
  const includesCompany = isProjectRequest || payload.inquiryType === 'demo_request'

  const contact = await upsertContact({
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    company: includesCompany ? payload.company : undefined,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2,
    city: payload.city,
    postalCode: payload.postalCode,
    country: payload.country,
    source: 'website_form',
  })

  const encryptedRequest = await encryptRequestFields(contact.subjectId, {
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    company: includesCompany ? payload.company : undefined,
    message: payload.message,
    addressLine1: payload.addressLine1,
    addressLine2: payload.addressLine2,
    city: payload.city,
    postalCode: payload.postalCode,
    country: payload.country,
  })

  const { data: request, error: reqErr } = await db
    .from('crm_project_requests')
    .insert({
      contact_id: contact.id,
      lead_id: null,
      ...encryptedRequest,
      inquiry_type: payload.inquiryType,
      project_type: isProjectRequest
        ? (payload.projectType as RequestInsert['project_type'])
        : null,
      engagement_model: isProjectRequest
        ? (payload.engagementModel as RequestInsert['engagement_model'])
        : null,
      timeline: payload.timeline as RequestInsert['timeline'],
      locale: payload.locale ?? 'en',
      ip_address: payload.ipAddress ?? null,
      source: payload.source ?? 'landing_contact_form',
    })
    .select('id')
    .single()

  if (reqErr) throw reqErr

  return {
    contactId: contact.id,
    subjectId: contact.subjectId,
    requestId: request.id,
  }
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
  const { subjectId } = await provisionContactSubject({
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
  })

  const [emailHash, emailCiphertext, firstName, lastName] = await Promise.all([
    hashEmailForSubject(subjectId, data.email),
    encryptForSubject(subjectId, data.email.trim()),
    encryptOptionalForSubject(subjectId, data.firstName),
    encryptOptionalForSubject(subjectId, data.lastName),
  ])

  const { error } = await db.from('crm_newsletter_subscribers').upsert(
    {
      subject_id: subjectId,
      email_hash: emailHash,
      email_ciphertext: emailCiphertext,
      first_name_ciphertext: firstName,
      last_name_ciphertext: lastName,
      locale: data.locale ?? 'en',
      source: data.source ?? 'website_form',
      status: 'active',
      consent_given_at: new Date().toISOString(),
    },
    { onConflict: 'subject_id', ignoreDuplicates: false },
  )

  if (error) throw error
}

/** Unsubscribe by email: looks up the subject via email hash, sets status='unsubscribed'. */
export async function unsubscribeFromNewsletter(email: string): Promise<{ found: boolean }> {
  const db = createServiceClient()

  // Find the subject via the auth profile (fast email lookup)
  const { data: profile } = await db
    .from('profiles')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()

  if (!profile) return { found: false }

  const { data: subscriber } = await db
    .from('crm_newsletter_subscribers')
    .select('id')
    .eq('subject_id', profile.id)
    .maybeSingle()

  if (!subscriber) return { found: false }

  const { error } = await db
    .from('crm_newsletter_subscribers')
    .update({ status: 'unsubscribed' })
    .eq('subject_id', profile.id)

  if (error) throw error
  return { found: true }
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
