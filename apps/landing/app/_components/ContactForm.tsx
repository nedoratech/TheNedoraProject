'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { useLocale, useTranslations } from 'next-intl'
import { submitProjectRequest, type SubmitProjectRequestState } from '../_actions/submitProjectRequest'

const initialState: SubmitProjectRequestState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  const t = useTranslations('contact')
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-[0.82rem] tracking-[0.14em] uppercase font-bold py-4 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_32px_rgba(99,115,243,0.5)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? t('submitting') : t('submit')}
    </button>
  )
}

const labelClass = 'block text-[0.65rem] tracking-[0.16em] uppercase font-bold text-nd-grey-600 mb-2'
const inputClass = 'w-full border border-nd-grey-200 bg-nd-white px-4 py-3 text-[0.9rem] font-[var(--font-futura)] text-nd-black placeholder:text-nd-grey-400 focus:outline-none focus:border-nd-accent-mid transition-colors duration-200'
const radioLabelClass = 'flex items-center gap-2 text-[0.8rem] text-nd-grey-600 cursor-pointer hover:text-nd-black transition-colors duration-200'

export default function ContactForm() {
  const locale = useLocale()
  const t = useTranslations('contact')
  const [state, formAction] = useActionState(submitProjectRequest, initialState)

  if (state.status === 'success') {
    return (
      <div className="border border-nd-accent-mid bg-nd-accent-light px-8 py-12 text-center">
        <div className="text-nd-accent-bright text-[1.5rem] mb-4">✓</div>
        <p className="text-[1rem] font-bold text-nd-accent tracking-[-0.01em]">{t('success_title')}</p>
        <p className="text-[0.88rem] text-nd-grey-600 mt-2">{t('success_body')}</p>
      </div>
    )
  }

  const fe = state.status === 'error' ? state.fieldErrors ?? {} : {}

  const projectTypes = ['new_application', 'integration_modernisation', 'support_evolution', 'not_sure'] as const
  const engagementModels = ['fixed_scope', 'time_based', 'not_sure'] as const
  const timelines = ['ready_now', '1_3_months', '3_6_months', 'exploring'] as const

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <input type="hidden" name="locale" value={locale} />

      {state.status === 'error' && state.message && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">{state.message}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('fields.firstName')}</label>
          <input name="firstName" type="text" placeholder={t('placeholders.firstName')} className={inputClass} />
          {fe.firstName && <p className="text-[0.72rem] text-red-600 mt-1">{fe.firstName[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('fields.lastName')}</label>
          <input name="lastName" type="text" placeholder={t('placeholders.lastName')} className={inputClass} />
          {fe.lastName && <p className="text-[0.72rem] text-red-600 mt-1">{fe.lastName[0]}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('fields.email')}</label>
          <input name="email" type="email" placeholder={t('placeholders.email')} className={inputClass} />
          {fe.email && <p className="text-[0.72rem] text-red-600 mt-1">{fe.email[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>{t('fields.company')}</label>
          <input name="company" type="text" placeholder={t('placeholders.company')} className={inputClass} />
          {fe.company && <p className="text-[0.72rem] text-red-600 mt-1">{fe.company[0]}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('fields.projectType')}</label>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
          {projectTypes.map((value) => (
            <label key={value} className={radioLabelClass}>
              <input type="radio" name="projectType" value={value} defaultChecked={value === 'new_application'} className="accent-nd-accent-mid" />
              {t(`projectTypes.${value}`)}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>{t('fields.engagementModel')}</label>
          <div className="flex flex-col gap-2 mt-1">
            {engagementModels.map((value) => (
              <label key={value} className={radioLabelClass}>
                <input type="radio" name="engagementModel" value={value} defaultChecked={value === 'fixed_scope'} className="accent-nd-accent-mid" />
                {t(`engagementModels.${value}`)}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>{t('fields.timeline')}</label>
          <div className="flex flex-col gap-2 mt-1">
            {timelines.map((value) => (
              <label key={value} className={radioLabelClass}>
                <input type="radio" name="timeline" value={value} defaultChecked={value === 'ready_now'} className="accent-nd-accent-mid" />
                {t(`timelines.${value}`)}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>{t('fields.message')}</label>
        <textarea name="message" rows={5} placeholder={t('placeholders.message')} className={`${inputClass} resize-none`} />
        {fe.message && <p className="text-[0.72rem] text-red-600 mt-1">{fe.message[0]}</p>}
      </div>

      <p className="text-[0.72rem] text-nd-grey-400 leading-[1.6]">
        {t('privacy_prefix')}{' '}
        <a href="/privacy" className="underline hover:text-nd-grey-600 transition-colors">{t('privacy_link')}</a>
      </p>

      <SubmitButton />
    </form>
  )
}
