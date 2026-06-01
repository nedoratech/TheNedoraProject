/**
 * @nedora/db/crm
 * Server-side helpers for microCRM operations.
 * All writes use the service_role client — only call from Server Actions or Route Handlers.
 */

import { createServiceClient } from './client'
import type { Database } from './types'

type ContactInsert = Database['public']['Tables']['crm_contacts']['Insert']
type LeadInsert    = Database['public']['Tables']['crm_leads']['Insert']
type RequestInsert = Database['public']['Tables']['crm_project_requests']['Insert']

// ── Contacts ─────────────────────────────────────────────────────────────────

/** Upsert a contact by email. Returns the contact id. */
export async function upsertContact(
  data: Pick<ContactInsert, 'email' | 'first_name' | 'last_name' | 'company' | 'source'>
) {
  const db = createServiceClient()

  const { data: contact, error } = await db
    .from('crm_contacts')
    .upsert(
      { ...data, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    )
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
}) {
  const db = createServiceClient()

  // 1. Upsert contact
  const contact = await upsertContact({
    email: payload.email,
    first_name: payload.firstName,
    last_name: payload.lastName,
    company: payload.company,
    source: 'website_form',
  })

  // 2. Create project request
  const { data: request, error: reqErr } = await db
    .from('crm_project_requests')
    .insert({
      contact_id:       contact.id,
      first_name:       payload.firstName,
      last_name:        payload.lastName,
      email:            payload.email,
      company:          payload.company,
      project_type:     payload.projectType as RequestInsert['project_type'],
      engagement_model: payload.engagementModel as RequestInsert['engagement_model'],
      timeline:         payload.timeline as RequestInsert['timeline'],
      message:          payload.message,
      locale:           payload.locale ?? 'en',
    })
    .select('id')
    .single()

  if (reqErr) throw reqErr

  // 3. Create lead (status = new)
  const { error: leadErr } = await db
    .from('crm_leads')
    .insert({
      contact_id:       contact.id,
      status:           'new',
      project_type:     payload.projectType as LeadInsert['project_type'],
      engagement_model: payload.engagementModel as LeadInsert['engagement_model'],
      timeline:         payload.timeline as LeadInsert['timeline'],
    })

  if (leadErr) throw leadErr

  return { contactId: contact.id, requestId: request.id }
}

// ── Newsletter ────────────────────────────────────────────────────────────────

export async function subscribeToNewsletter(data: {
  email: string
  firstName?: string
  locale?: string
  source?: string
}) {
  const db = createServiceClient()

  const { error } = await db
    .from('crm_newsletter_subscribers')
    .upsert(
      {
        email:            data.email,
        first_name:       data.firstName,
        locale:           data.locale ?? 'en',
        source:           data.source ?? 'website_form',
        status:           'active',
        consent_given_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: false }
    )

  if (error) throw error
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export async function getLeads(options?: {
  status?: string
  limit?: number
}) {
  const db = createServiceClient()

  let query = db
    .from('crm_leads')
    .select(`
      *,
      crm_contacts ( id, email, first_name, last_name, company )
    `)
    .order('created_at', { ascending: false })

  if (options?.status) {
    query = query.eq('status', options.status as LeadInsert['status'])
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function updateLeadStatus(
  leadId: string,
  status: Database['public']['Enums']['lead_status']
) {
  const db = createServiceClient()

  const { error } = await db
    .from('crm_leads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) throw error
}
