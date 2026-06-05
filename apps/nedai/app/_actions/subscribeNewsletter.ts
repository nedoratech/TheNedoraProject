'use server'

import { z } from 'zod'
import { subscribeToNewsletter } from '@nedora/db/crm'

const schema = z.object({
  email: z.string().email('A valid email address is required'),
  privacyAccepted: z.string().refine((v) => v === 'true', {
    message: 'You must accept the Privacy Policy to subscribe',
  }),
})

export type NewsletterState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message?: string }

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.errors[0]?.message ?? 'Please check your inputs.',
    }
  }

  try {
    await subscribeToNewsletter({
      email: parsed.data.email,
      locale: 'en',
      source: 'nedai_website',
    })
    return { status: 'success' }
  } catch (err) {
    console.error('[NedAI] subscribeNewsletter error:', err)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email us at hello@nedai.co.',
    }
  }
}
