'use server'

import { z } from 'zod'
import { createProjectRequest } from '@nedora/db/crm'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('A valid work email is required'),
  phone: z.string().max(40).optional(),
  company: z.string().min(1, 'Company name is required').max(200),
  industry: z.string().min(1, 'Please select an industry').max(100),
  size: z.string().min(1, 'Please select company size').max(100),
  message: z.string().max(2000).optional(),
  privacyAccepted: z.string().refine((v) => v === 'true', {
    message: 'You must accept the Privacy Policy to continue',
  }),
})

export type DemoRequestState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message?: string }

export async function submitDemoRequest(
  _prev: DemoRequestState,
  formData: FormData,
): Promise<DemoRequestState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    const firstError = parsed.error.errors[0]?.message ?? 'Please check your inputs and try again.'
    return { status: 'error', message: firstError }
  }

  const d = parsed.data

  try {
    await createProjectRequest({
      inquiryType: 'demo_request',
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email,
      company: d.company,
      message: d.message
        ? `[Industry: ${d.industry}] [Size: ${d.size}] [Phone: ${d.phone ?? 'not provided'}]\n\n${d.message}`
        : `[Industry: ${d.industry}] [Size: ${d.size}] [Phone: ${d.phone ?? 'not provided'}]`,
      locale: 'en',
      timeline: 'ready_now',
      source: 'nedai_website',
    })

    return { status: 'success' }
  } catch (err) {
    console.error('[NedAI] submitDemoRequest error:', err)
    return { status: 'error', message: 'Something went wrong on our end. Please try again or email us directly at hello@nedai.co.' }
  }
}
