/**
 * Decrypt CRM PII rows for server components (microCRM).
 */

import { decryptPiiOptional } from '@nedora/crypto/pii'
import type { Database } from './types'

type ContactRow = Database['public']['Tables']['crm_contacts']['Row']
type RequestRow = Database['public']['Tables']['crm_project_requests']['Row']
type SubscriberRow = Database['public']['Tables']['crm_newsletter_subscribers']['Row']

export type DecryptedContact = {
  id: string
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
  email: string
  first_name: string | null
  last_name: string | null
  locale: string
  status: string
  consent_given_at: string | null
  source: string | null
  created_at: string
}

export function decryptContact(row: ContactRow): DecryptedContact {
  return {
    id: row.id,
    email: decryptPiiOptional(row.email_ciphertext) ?? '',
    first_name: decryptPiiOptional(row.first_name_ciphertext),
    last_name: decryptPiiOptional(row.last_name_ciphertext),
    company: decryptPiiOptional(row.company_ciphertext),
    phone: decryptPiiOptional(row.phone_ciphertext),
    address_line1: decryptPiiOptional(row.address_line1_ciphertext),
    address_line2: decryptPiiOptional(row.address_line2_ciphertext),
    city: decryptPiiOptional(row.city_ciphertext),
    postal_code: decryptPiiOptional(row.postal_code_ciphertext),
    country: decryptPiiOptional(row.country_ciphertext),
    source: row.source,
    tags: row.tags,
    notes: decryptPiiOptional(row.notes_ciphertext),
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export function decryptNewsletterSubscriber(row: SubscriberRow): DecryptedNewsletterSubscriber {
  return {
    id: row.id,
    email: decryptPiiOptional(row.email_ciphertext) ?? '',
    first_name: decryptPiiOptional(row.first_name_ciphertext),
    last_name: decryptPiiOptional(row.last_name_ciphertext),
    locale: row.locale,
    status: row.status,
    consent_given_at: row.consent_given_at,
    source: row.source,
    created_at: row.created_at,
  }
}

/** Nested contact from a Supabase join (encrypted columns). */
export function decryptContactFromJoin(
  contact: ContactRow | ContactRow[] | null | undefined,
): DecryptedContact | null {
  if (!contact) return null
  const row = Array.isArray(contact) ? contact[0] : contact
  if (!row) return null
  return decryptContact(row)
}

export {
  decryptPiiOptional,
  encryptPiiOptional,
  hashPiiLookup,
} from '@nedora/crypto/pii'
