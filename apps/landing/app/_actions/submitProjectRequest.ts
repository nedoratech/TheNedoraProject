'use server'

import { createProjectRequest } from '@nedora/db/crm'
import { getSupabaseConfigHint, getSupabaseConnectionHint } from '@nedora/db/supabaseErrors'
import {
  buildContactFormSchema,
  flattenContactFormErrors,
  getContactFormValidationMessages,
  getContactFormValuesFromFormData,
  type ContactFormValues,
} from '@/lib/contactFormSchema'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'

export type SubmitProjectRequestState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error'
      message: string
      fieldErrors?: Partial<Record<keyof ContactFormValues, string>>
      values?: ContactFormValues
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
  const schema = buildContactFormSchema(getContactFormValidationMessages(t))

  const values = getContactFormValuesFromFormData(formData)
  const parsed = schema.safeParse(values)
  if (!parsed.success) {
    return {
      status: 'error',
      message: t('error_validation'),
      fieldErrors: flattenContactFormErrors(parsed.error),
      values,
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
    const configHint = getSupabaseConfigHint(err)
    const connectionHint = getSupabaseConnectionHint(err)
    const hint = configHint ?? connectionHint
    if (hint) {
      console.error(`[submitProjectRequest] ${hint}`)
    }
    console.error('submitProjectRequest error:', err)
    return { status: 'error', message: t('error_generic'), values }
  }
}
