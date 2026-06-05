import { z } from 'zod'

export const FORM_MODES = ['contact', 'project_request'] as const

export const PROJECT_TYPES = [
  'new_application',
  'integration_modernisation',
  'support_evolution',
  'not_sure',
] as const

export const ENGAGEMENT_MODELS = ['fixed_scope', 'time_based', 'not_sure'] as const

export const TIMELINES = ['ready_now', '1_3_months', '3_6_months', 'exploring'] as const

export type FormMode = (typeof FORM_MODES)[number]
export type ProjectType = (typeof PROJECT_TYPES)[number]
export type EngagementModel = (typeof ENGAGEMENT_MODELS)[number]
export type Timeline = (typeof TIMELINES)[number]

export type ContactFormValues = {
  formMode: FormMode
  firstName: string
  lastName: string
  email: string
  company?: string
  projectType?: ProjectType
  engagementModel?: EngagementModel
  timeline: Timeline
  message: string
  privacyAccepted: boolean
}

export const defaultContactFormValues: ContactFormValues = {
  formMode: 'project_request',
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
  contactMessageRequired: string
  projectMessageRequired: string
  messageMin: string
  privacyRequired: string
}

const validationMessageKeys = {
  firstNameRequired: 'validation.first_name_required',
  lastNameRequired: 'validation.last_name_required',
  emailRequired: 'validation.email_required',
  emailInvalid: 'validation.email_invalid',
  companyRequired: 'validation.company_required',
  messageMin: 'validation.message_min',
  privacyRequired: 'validation.privacy_required',
} as const satisfies Partial<Record<keyof ContactFormValidationMessages, string>>

/** Build translated validation copy from next-intl `contact` namespace. */
export function getContactFormValidationMessages(
  t: (key: string) => string,
): ContactFormValidationMessages {
  return {
    firstNameRequired: t(validationMessageKeys.firstNameRequired),
    lastNameRequired: t(validationMessageKeys.lastNameRequired),
    emailRequired: t(validationMessageKeys.emailRequired),
    emailInvalid: t(validationMessageKeys.emailInvalid),
    companyRequired: t(validationMessageKeys.companyRequired),
    contactMessageRequired: t('modes.contact.validation.message_required'),
    projectMessageRequired: t('modes.project_request.validation.message_required'),
    messageMin: t(validationMessageKeys.messageMin),
    privacyRequired: t(validationMessageKeys.privacyRequired),
  }
}

const sharedFields = (messages: ContactFormValidationMessages) => ({
  firstName: z.string().min(1, messages.firstNameRequired),
  lastName: z.string().min(1, messages.lastNameRequired),
  email: z
    .string()
    .min(1, messages.emailRequired)
    .email(messages.emailInvalid),
  timeline: z.enum(TIMELINES),
  privacyAccepted: z.literal(true, { errorMap: () => ({ message: messages.privacyRequired }) }),
})

export function buildContactFormSchema(messages: ContactFormValidationMessages) {
  return z.discriminatedUnion('formMode', [
    z.object({
      formMode: z.literal('contact'),
      ...sharedFields(messages),
      company: z.string().optional(),
      projectType: z.enum(PROJECT_TYPES).optional(),
      engagementModel: z.enum(ENGAGEMENT_MODELS).optional(),
      message: z
        .string()
        .min(1, messages.contactMessageRequired)
        .min(10, messages.messageMin),
    }),
    z.object({
      formMode: z.literal('project_request'),
      ...sharedFields(messages),
      company: z.string().min(1, messages.companyRequired),
      projectType: z.enum(PROJECT_TYPES),
      engagementModel: z.enum(ENGAGEMENT_MODELS),
      message: z
        .string()
        .min(1, messages.projectMessageRequired)
        .min(10, messages.messageMin),
    }),
  ])
}

export type ContactFormField = keyof ContactFormValues

export function getContactFormValuesFromFormData(formData: FormData): ContactFormValues {
  const formModeRaw = formData.get('formMode')
  const formMode: FormMode =
    formModeRaw === 'contact' || formModeRaw === 'project_request'
      ? formModeRaw
      : defaultContactFormValues.formMode

  return {
    formMode,
    firstName: String(formData.get('firstName') ?? ''),
    lastName: String(formData.get('lastName') ?? ''),
    email: String(formData.get('email') ?? ''),
    company: String(formData.get('company') ?? ''),
    projectType:
      (formData.get('projectType') as ProjectType) ?? defaultContactFormValues.projectType,
    engagementModel: (formData.get('engagementModel') as EngagementModel) ??
      defaultContactFormValues.engagementModel,
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

export function formModeFromHash(hash: string): FormMode {
  if (hash === '#contact' || hash === 'contact') return 'contact'
  if (hash === '#contact-offer' || hash === 'contact-offer') return 'project_request'
  return 'project_request'
}

export function hashForFormMode(mode: FormMode): string {
  return mode === 'contact' ? '#contact' : '#contact-offer'
}
