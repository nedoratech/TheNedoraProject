import { z } from 'zod'

export const PROJECT_TYPES = [
  'new_application',
  'integration_modernisation',
  'support_evolution',
  'not_sure',
] as const

export const ENGAGEMENT_MODELS = ['fixed_scope', 'time_based', 'not_sure'] as const

export const TIMELINES = ['ready_now', '1_3_months', '3_6_months', 'exploring'] as const

export type ProjectType = (typeof PROJECT_TYPES)[number]
export type EngagementModel = (typeof ENGAGEMENT_MODELS)[number]
export type Timeline = (typeof TIMELINES)[number]

export type ContactFormValues = {
  firstName: string
  lastName: string
  email: string
  company: string
  projectType: ProjectType
  engagementModel: EngagementModel
  timeline: Timeline
  message: string
  privacyAccepted: boolean
}

export const defaultContactFormValues: ContactFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  projectType: 'new_application',
  engagementModel: 'fixed_scope',
  timeline: 'ready_now',
  message: '',
  privacyAccepted: false,
}

export type ContactFormValidationMessages = {
  firstNameRequired: string
  lastNameRequired: string
  emailRequired: string
  emailInvalid: string
  companyRequired: string
  messageRequired: string
  messageMin: string
  privacyRequired: string
}

const validationMessageKeys = {
  firstNameRequired: 'validation.first_name_required',
  lastNameRequired: 'validation.last_name_required',
  emailRequired: 'validation.email_required',
  emailInvalid: 'validation.email_invalid',
  companyRequired: 'validation.company_required',
  messageRequired: 'validation.message_required',
  messageMin: 'validation.message_min',
  privacyRequired: 'validation.privacy_required',
} as const satisfies Record<keyof ContactFormValidationMessages, string>

/** Build translated validation copy from next-intl `contact` namespace. */
export function getContactFormValidationMessages(
  t: (key: (typeof validationMessageKeys)[keyof ContactFormValidationMessages]) => string,
): ContactFormValidationMessages {
  return {
    firstNameRequired: t(validationMessageKeys.firstNameRequired),
    lastNameRequired: t(validationMessageKeys.lastNameRequired),
    emailRequired: t(validationMessageKeys.emailRequired),
    emailInvalid: t(validationMessageKeys.emailInvalid),
    companyRequired: t(validationMessageKeys.companyRequired),
    messageRequired: t(validationMessageKeys.messageRequired),
    messageMin: t(validationMessageKeys.messageMin),
    privacyRequired: t(validationMessageKeys.privacyRequired),
  }
}

export function buildContactFormSchema(messages: ContactFormValidationMessages) {
  return z.object({
    firstName: z.string().min(1, messages.firstNameRequired),
    lastName: z.string().min(1, messages.lastNameRequired),
    email: z
      .string()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    company: z.string().min(1, messages.companyRequired),
    projectType: z.enum(PROJECT_TYPES),
    engagementModel: z.enum(ENGAGEMENT_MODELS),
    timeline: z.enum(TIMELINES),
    message: z
      .string()
      .min(1, messages.messageRequired)
      .min(10, messages.messageMin),
    privacyAccepted: z.literal(true, { errorMap: () => ({ message: messages.privacyRequired }) }),
  })
}

export type ContactFormField = keyof ContactFormValues

export function getContactFormValuesFromFormData(formData: FormData): ContactFormValues {
  return {
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    email: String(formData.get('email') ?? ''),
    company: String(formData.get('company') ?? ''),
    projectType: (formData.get('projectType') as ProjectType) ?? defaultContactFormValues.projectType,
    engagementModel: (formData.get('engagementModel') as EngagementModel) ?? defaultContactFormValues.engagementModel,
    timeline: (formData.get('timeline') as Timeline) ?? defaultContactFormValues.timeline,
    message: String(formData.get('message') ?? ''),
    privacyAccepted: formData.get('privacyAccepted') === 'true',
  }
}

export function flattenContactFormErrors(
  error: z.ZodError<ContactFormValues>,
): Partial<Record<ContactFormField, string>> {
  const flat = error.flatten().fieldErrors
  const out: Partial<Record<ContactFormField, string>> = {}
  for (const key of Object.keys(flat) as ContactFormField[]) {
    const msg = flat[key]?.[0]
    if (msg) out[key] = msg
  }
  return out
}
