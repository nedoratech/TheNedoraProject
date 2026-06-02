'use server'

import { getTranslations } from 'next-intl/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { routing } from '@/i18n/routing'

const resend = new Resend(process.env.RESEND_API_KEY)
const NOTIFY_TO   = process.env.RESEND_NOTIFY_EMAIL ?? 'hello@nedora.co'
const NOTIFY_FROM = process.env.RESEND_FROM_EMAIL   ?? 'noreply@nedora.co'

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

  // In development without a Resend key, log and succeed so the form is testable.
  if (!process.env.RESEND_API_KEY) {
    console.info('[submitProjectRequest] No RESEND_API_KEY — logging submission:', parsed.data)
    return { status: 'success' }
  }

  try {
    await resend.emails.send({
      from:    NOTIFY_FROM,
      to:      NOTIFY_TO,
      replyTo: email,
      subject: `New project request — ${firstName} ${lastName} (${company})`,
      html: `
        <h2 style="margin-bottom:16px">New Project Request</h2>
        <table style="border-collapse:collapse;width:100%;font-size:14px">
          <tr><td style="padding:6px 12px 6px 0;color:#555;width:160px">Name</td><td>${firstName} ${lastName}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#555">Email</td><td><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#555">Company</td><td>${company}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#555">Project type</td><td>${projectType.replace(/_/g, ' ')}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#555">Engagement</td><td>${engagementModel.replace(/_/g, ' ')}</td></tr>
          <tr><td style="padding:6px 12px 6px 0;color:#555">Timeline</td><td>${timeline.replace(/_/g, ' ')}</td></tr>
        </table>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee" />
        <p style="font-size:14px;line-height:1.6;white-space:pre-wrap">${message}</p>
      `,
    })
    return { status: 'success' }
  } catch (err) {
    console.error('submitProjectRequest error:', err)
    return { status: 'error', message: t('error_generic') }
  }
}
