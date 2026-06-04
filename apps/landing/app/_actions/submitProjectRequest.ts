'use server'

import { createProjectRequest } from '@nedora/db/crm'
import { getTranslations } from 'next-intl/server'
import { z } from 'zod'
import { routing } from '@/i18n/routing'

export type SubmitProjectRequestState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; message: string; fieldErrors?: Record<string, string[]> }

function buildSchema(messages: {
  required: string
  email: string
  messageMin: string
}) {
  return z.object({
    firstName:       z.string().min(1, messages.required),
    lastName:        z.string().min(1, messages.required),
    email:           z.string().email(messages.email),
    company:         z.string().min(1, messages.required),
    projectType:     z.enum(['new_application', 'integration_modernisation', 'support_evolution', 'not_sure']),
    engagementModel: z.enum(['fixed_scope', 'time_based', 'not_sure']),
    timeline:        z.enum(['ready_now', '1_3_months', '3_6_months', 'exploring']),
    message:         z.string().min(10, messages.messageMin),
  })
}

function isCrmConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  )
}

export async function submitProjectRequest(
  _prev: SubmitProjectRequestState,
  formData: FormData,
): Promise<SubmitProjectRequestState> {
  const localeRaw = formData.get('locale')
  const locale = typeof localeRaw === 'string' && routing.locales.includes(localeRaw as 'en' | 'ro')
    ? localeRaw
    : routing.defaultLocale

  const t = await getTranslations({ locale, namespace: 'contact' })
  const schema = buildSchema({
    required: t('validation.required'),
    email: t('validation.email'),
    messageMin: t('validation.message_min'),
  })

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
      message: t('error_validation'),
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }

  const { firstName, lastName, email, company, projectType, engagementModel, timeline, message } = parsed.data

  if (!isCrmConfigured()) {
    console.info('[submitProjectRequest] CRM not configured — logging submission:', parsed.data)
    return { status: 'success' }
  }

  try {
    await createProjectRequest({
      firstName,
      lastName,
      email,
      company,
      projectType,
      engagementModel,
      timeline,
      message,
      locale,
    })
    return { status: 'success' }
  } catch (err) {
    console.error('submitProjectRequest error:', err)
    return { status: 'error', message: t('error_generic') }
  }
}
