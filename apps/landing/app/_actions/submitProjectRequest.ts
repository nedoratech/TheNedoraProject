'use server'

import { z } from 'zod'
import { createProjectRequest } from '@nedora/db/crm'

const schema = z.object({
  firstName:       z.string().min(1, 'Required'),
  lastName:        z.string().min(1, 'Required'),
  email:           z.string().email('Invalid email'),
  company:         z.string().min(1, 'Required'),
  projectType:     z.enum(['new_application', 'integration_modernisation', 'support_evolution', 'not_sure']),
  engagementModel: z.enum(['fixed_scope', 'time_based', 'not_sure']),
  timeline:        z.enum(['ready_now', '1_3_months', '3_6_months', 'exploring']),
  message:         z.string().min(10, 'Please describe your project (min 10 characters)'),
})

export type SubmitProjectRequestState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> }

export async function submitProjectRequest(
  _prev: SubmitProjectRequestState,
  formData: FormData,
): Promise<SubmitProjectRequestState> {
  const raw = {
    firstName:       formData.get('firstName'),
    lastName:        formData.get('lastName'),
    email:           formData.get('email'),
    company:         formData.get('company'),
    projectType:     formData.get('projectType'),
    engagementModel: formData.get('engagementModel'),
    timeline:        formData.get('timeline'),
    message:         formData.get('message'),
  }

  const parsed = schema.safeParse(raw)
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Please fix the errors below.',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  try {
    await createProjectRequest({
      firstName:       parsed.data.firstName,
      lastName:        parsed.data.lastName,
      email:           parsed.data.email,
      company:         parsed.data.company,
      projectType:     parsed.data.projectType,
      engagementModel: parsed.data.engagementModel,
      timeline:        parsed.data.timeline,
      message:         parsed.data.message,
    })
    return { status: 'success' }
  } catch (err) {
    console.error('submitProjectRequest error:', err)
    return { status: 'error', message: 'Something went wrong. Please try again.' }
  }
}
