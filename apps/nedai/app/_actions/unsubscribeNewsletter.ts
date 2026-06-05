'use server'

import { z } from 'zod'
import { unsubscribeFromNewsletter } from '@nedora/db/crm'

const schema = z.object({
  email: z.string().email('A valid email address is required'),
})

export type UnsubscribeState =
  | { status: 'idle' }
  | { status: 'success'; found: boolean }
  | { status: 'error'; message?: string }

export async function unsubscribeNewsletter(
  _prev: UnsubscribeState,
  formData: FormData,
): Promise<UnsubscribeState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    return {
      status: 'error',
      message: parsed.error.errors[0]?.message ?? 'Please enter a valid email address.',
    }
  }

  try {
    const result = await unsubscribeFromNewsletter(parsed.data.email)
    return { status: 'success', found: result.found }
  } catch (err) {
    console.error('[NedAI] unsubscribeNewsletter error:', err)
    return {
      status: 'error',
      message: 'Something went wrong. Please try again or email privacy@nedora.co.',
    }
  }
}
