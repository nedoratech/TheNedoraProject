'use server'

import {
  buildContactFormSchema,
  flattenContactFormErrors,
  getContactFormValidationMessages,
  getContactFormValuesFromFormData,
  type ContactFormValues,
} from '@/lib/contactFormSchema'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { createProjectRequest } from '@nedora/db/crm'

export type SubmitProjectRequestState =
  | { status: 'idle' }
  | { status: 'success' }
  | {
      status: 'error'
      message: string
      fieldErrors?: Partial<Record<keyof ContactFormValues, string>>
      values?: ContactFormValues
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

  try {
    await createProjectRequest({
      inquiryType: parsed.data.formMode,
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      company: parsed.data.formMode === 'project_request' ? parsed.data.company : undefined,
      projectType:
        parsed.data.formMode === 'project_request' ? parsed.data.projectType : undefined,
      engagementModel:
        parsed.data.formMode === 'project_request' ? parsed.data.engagementModel : undefined,
      timeline: parsed.data.timeline,
      message: parsed.data.message,
      locale,
    })
    return { status: 'success' }
  } catch (err) {
    console.error('[submitProjectRequest] Failed to persist request', err)
    return {
      status: 'error',
      message: t('error_generic'),
      values,
    }
  }
}
