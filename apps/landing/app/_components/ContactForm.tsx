'use client'

import {
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type FormEvent,
  type ReactNode,
} from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  buildContactFormSchema,
  defaultContactFormValues,
  flattenContactFormErrors,
  FORM_MODES,
  getContactFormValidationMessages,
  ENGAGEMENT_MODELS,
  PROJECT_TYPES,
  TIMELINES,
  type ContactFormField,
  type ContactFormValues,
  type FormMode,
} from '@/lib/contactFormSchema'
import { submitProjectRequest, type SubmitProjectRequestState } from '../_actions/submitProjectRequest'

const initialState: SubmitProjectRequestState = { status: 'idle' }

type FieldStatus = 'default' | 'invalid' | 'valid'

interface ContactFormProps {
  formMode: FormMode
  onFormModeChange: (mode: FormMode) => void
}

function FormSpinner({ label }: { label: string }) {
  return (
    <span
      className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-nd-white/30 border-t-nd-white"
      role="status"
      aria-label={label}
    />
  )
}

function SubmitButton({ pending, formMode }: { pending: boolean; formMode: FormMode }) {
  const t = useTranslations('contact')
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="w-full flex items-center justify-center gap-2.5 text-[0.82rem] tracking-[0.14em] uppercase font-bold py-4 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_32px_rgba(99,115,243,0.5)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:shadow-none"
    >
      {pending && <FormSpinner label={t('submitting')} />}
      {pending ? t('submitting') : t(`modes.${formMode}.submit`)}
    </button>
  )
}

function StatusIcon({
  status,
  className = 'top-1/2 -translate-y-1/2',
}: {
  status: 'invalid' | 'valid'
  className?: string
}) {
  const circle =
    status === 'invalid'
      ? 'bg-red-500/15 text-red-600'
      : 'bg-lime-500/15 text-lime-600'

  return (
    <span
      className={`pointer-events-none absolute right-3 flex h-5 w-5 items-center justify-center rounded-full ${circle} ${className}`}
      aria-hidden
    >
      {status === 'invalid' ? (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <path d="M5 2.25v3.25" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" />
          <circle cx="5" cy="7.35" r="0.65" fill="currentColor" />
        </svg>
      ) : (
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" className="shrink-0">
          <path
            d="M2 5.5L4.5 8l4.5-5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  )
}

function fieldStatusClass(status: FieldStatus, multiline = false): string {
  const base =
    'w-full border px-4 text-[0.9rem] font-[var(--font-futura)] text-nd-black placeholder:text-nd-grey-400 transition-colors duration-200 focus:outline-none'
  const pad = multiline ? 'py-3 pr-11 resize-none' : 'py-3 pr-11'

  if (status === 'invalid') {
    return `${base} ${pad} border-red-500 bg-red-500/10 focus:border-red-500`
  }
  if (status === 'valid') {
    return `${base} ${pad} border-lime-500 bg-lime-500/10 focus:border-lime-500`
  }
  return `${base} ${pad} border-nd-grey-200 bg-nd-white focus:border-nd-accent-mid`
}

const labelClass = 'block text-[0.65rem] tracking-[0.16em] uppercase font-bold text-nd-grey-600 mb-2'

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor?: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className={labelClass} htmlFor={htmlFor}>
      {children}
      {required && (
        <span className="text-red-500 ml-0.5" aria-hidden>
          *
        </span>
      )}
    </label>
  )
}

const radioLabelClass =
  'flex items-center gap-2 text-[0.8rem] text-nd-grey-600 cursor-pointer hover:text-nd-black transition-colors duration-200'

function getFieldStatus(
  field: ContactFormField,
  errors: Partial<Record<ContactFormField, string>>,
  touched: Partial<Record<ContactFormField, boolean>>,
  submitAttempted: boolean,
): FieldStatus {
  const show = submitAttempted || touched[field]
  if (!show) return 'default'
  if (errors[field]) return 'invalid'
  return 'valid'
}

export default function ContactForm({ formMode, onFormModeChange }: ContactFormProps) {
  const locale = useLocale()
  const t = useTranslations('contact')
  const [state, formAction, isActionPending] = useActionState(submitProjectRequest, initialState)
  const [isTransitionPending, startTransition] = useTransition()
  const isPending = isActionPending || isTransitionPending

  const [values, setValues] = useState<ContactFormValues>(defaultContactFormValues)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ContactFormField, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<ContactFormField, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [bannerMessage, setBannerMessage] = useState<string | null>(null)

  const schema = useMemo(
    () => buildContactFormSchema(getContactFormValidationMessages(t)),
    [t, locale],
  )

  useEffect(() => {
    setValues((prev) => ({ ...prev, formMode }))
    setFieldErrors((prev) => {
      const copy = { ...prev }
      if (formMode === 'contact') {
        delete copy.company
        delete copy.projectType
        delete copy.engagementModel
      }
      return copy
    })
  }, [formMode])

  const validateAll = useCallback(
    (next: ContactFormValues) => {
      const parsed = schema.safeParse(next)
      if (!parsed.success) {
        return { ok: false as const, errors: flattenContactFormErrors(parsed.error) }
      }
      return { ok: true as const, data: parsed.data }
    },
    [schema],
  )

  const validateField = useCallback(
    (field: ContactFormField, next: ContactFormValues) => {
      const parsed = schema.safeParse(next)
      setFieldErrors((prev) => {
        const copy = { ...prev }
        if (parsed.success) {
          delete copy[field]
          return copy
        }
        const errors = flattenContactFormErrors(parsed.error)
        if (errors[field]) copy[field] = errors[field]
        else delete copy[field]
        return copy
      })
    },
    [schema],
  )

  useEffect(() => {
    if (state.status === 'error') {
      if (state.values) {
        setValues(state.values)
        onFormModeChange(state.values.formMode)
      }
      if (state.fieldErrors) {
        setFieldErrors(state.fieldErrors)
        setSubmitAttempted(true)
      }
      if (state.message) setBannerMessage(state.message)
    }
    if (state.status === 'success' || state.status === 'idle') {
      setBannerMessage(null)
    }
  }, [state, onFormModeChange])

  const setValue = <K extends ContactFormField>(field: K, value: ContactFormValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value }
      if (submitAttempted || touched[field]) {
        validateField(field, next)
      }
      return next
    })
  }

  const markTouched = (field: ContactFormField) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    setValues((current) => {
      validateField(field, current)
      return current
    })
  }

  const handleModeChange = (mode: FormMode) => {
    onFormModeChange(mode)
    setValues((prev) => {
      const next = { ...prev, formMode: mode }
      if (submitAttempted) validateAll(next)
      return next
    })
  }

  const buildFormData = (data: ContactFormValues) => {
    const fd = new FormData()
    fd.set('locale', locale)
    fd.set('formMode', data.formMode)
    fd.set('firstName', data.firstName)
    fd.set('lastName', data.lastName)
    fd.set('email', data.email)
    fd.set('company', data.company ?? '')
    fd.set('projectType', data.projectType ?? 'new_application')
    fd.set('engagementModel', data.engagementModel ?? 'fixed_scope')
    fd.set('timeline', data.timeline)
    fd.set('message', data.message)
    fd.set('privacyAccepted', data.privacyAccepted ? 'true' : 'false')
    return fd
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitAttempted(true)
    setBannerMessage(null)

    const payload = { ...values, formMode }
    const result = validateAll(payload)
    if (!result.ok) {
      setFieldErrors(result.errors)
      setBannerMessage(t('error_validation'))
      return
    }

    setFieldErrors({})
    startTransition(() => {
      formAction(buildFormData(result.data))
    })
  }

  const activeMode = values.formMode
  const isProjectRequest = activeMode === 'project_request'

  if (state.status === 'success') {
    return (
      <div className="border border-lime-500 bg-lime-500/10 px-8 py-12 text-center">
        <div
          className="mx-auto mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-lime-500 bg-lime-500/10 text-lime-600"
          aria-hidden
        >
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" className="shrink-0">
            <path
              d="M4 10.5L8 14.5L16 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="butt"
              strokeLinejoin="miter"
            />
          </svg>
        </div>
        <p className="text-[1rem] font-bold text-lime-600 tracking-[-0.01em]">
          {t(`modes.${activeMode}.success_title`)}
        </p>
        <p className="text-[0.88rem] text-nd-grey-600 mt-2">
          {t(`modes.${activeMode}.success_body`)}
        </p>
      </div>
    )
  }

  const inputDisabledClass =
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none'

  const renderInput = (
    field: Extract<ContactFormField, 'firstName' | 'lastName' | 'email' | 'company'>,
    type: 'text' | 'email',
    placeholder: string,
    required = true,
  ) => {
    const status = getFieldStatus(field, fieldErrors, touched, submitAttempted)
    const showIcon = status === 'invalid' || status === 'valid'

    return (
      <div>
        <FieldLabel htmlFor={field} required={required}>
          {t(`fields.${field}`)}
        </FieldLabel>
        <div className="relative">
          <input
            id={field}
            name={field}
            type={type}
            value={(values[field] ?? '') as string}
            placeholder={placeholder}
            disabled={isPending}
            className={`${fieldStatusClass(status)} ${inputDisabledClass}`}
            onChange={(e) => setValue(field, e.target.value)}
            onBlur={() => markTouched(field)}
            aria-invalid={status === 'invalid'}
            aria-required={required}
            required={required}
          />
          {showIcon && <StatusIcon status={status} />}
        </div>
        {fieldErrors[field] && (
          <p className="text-[0.72rem] text-red-600 mt-1">{fieldErrors[field]}</p>
        )}
      </div>
    )
  }

  const messageStatus = getFieldStatus('message', fieldErrors, touched, submitAttempted)
  const privacyStatus = getFieldStatus('privacyAccepted', fieldErrors, touched, submitAttempted)

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-6"
      noValidate
      aria-busy={isPending}
    >
      {isPending && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-nd-white/75 backdrop-blur-[1px]"
          aria-hidden
        >
          <span className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-nd-grey-200 border-t-nd-accent-mid" />
        </div>
      )}

      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="formMode" value={activeMode} />

      {bannerMessage && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">
          {bannerMessage}
        </div>
      )}

      <div>
        <FieldLabel htmlFor="formMode">{t('formMode.label')}</FieldLabel>
        <select
          id="formMode"
          name="formMode"
          value={activeMode}
          disabled={isPending}
          className={`${fieldStatusClass('default')} ${inputDisabledClass} appearance-none cursor-pointer`}
          onChange={(e) => handleModeChange(e.target.value as FormMode)}
        >
          {FORM_MODES.map((mode) => (
            <option key={mode} value={mode}>
              {t(`formMode.${mode}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderInput('firstName', 'text', t('placeholders.firstName'))}
        {renderInput('lastName', 'text', t('placeholders.lastName'))}
      </div>

      <div className={`grid grid-cols-1 gap-4 ${isProjectRequest ? 'sm:grid-cols-2' : ''}`}>
        {renderInput('email', 'email', t('placeholders.email'))}
        {isProjectRequest && renderInput('company', 'text', t('placeholders.company'))}
      </div>

      {isProjectRequest && (
        <>
          <div>
            <label className={labelClass}>{t('fields.projectType')}</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
              {PROJECT_TYPES.map((value) => (
                <label key={value} className={radioLabelClass}>
                  <input
                    type="radio"
                    name="projectType"
                    value={value}
                    checked={values.projectType === value}
                    disabled={isPending}
                    className="accent-nd-accent-mid disabled:cursor-not-allowed"
                    onChange={() => setValue('projectType', value)}
                  />
                  {t(`projectTypes.${value}`)}
                </label>
              ))}
            </div>
            {fieldErrors.projectType && (
              <p className="text-[0.72rem] text-red-600 mt-1">{fieldErrors.projectType}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>{t('fields.engagementModel')}</label>
              <div className="flex flex-col gap-2 mt-1">
                {ENGAGEMENT_MODELS.map((value) => (
                  <label key={value} className={radioLabelClass}>
                    <input
                      type="radio"
                      name="engagementModel"
                      value={value}
                      checked={values.engagementModel === value}
                      disabled={isPending}
                      className="accent-nd-accent-mid disabled:cursor-not-allowed"
                      onChange={() => setValue('engagementModel', value)}
                    />
                    {t(`engagementModels.${value}`)}
                  </label>
                ))}
              </div>
              {fieldErrors.engagementModel && (
                <p className="text-[0.72rem] text-red-600 mt-1">{fieldErrors.engagementModel}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>{t('fields.timeline')}</label>
              <div className="flex flex-col gap-2 mt-1">
                {TIMELINES.map((value) => (
                  <label key={value} className={radioLabelClass}>
                    <input
                      type="radio"
                      name="timeline"
                      value={value}
                      checked={values.timeline === value}
                      disabled={isPending}
                      className="accent-nd-accent-mid disabled:cursor-not-allowed"
                      onChange={() => setValue('timeline', value)}
                    />
                    {t(`timelines.${value}`)}
                  </label>
                ))}
              </div>
              {fieldErrors.timeline && (
                <p className="text-[0.72rem] text-red-600 mt-1">{fieldErrors.timeline}</p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Timeline is intentionally hidden in Contact mode. We still submit a safe default value. */}

      <div>
        <FieldLabel htmlFor="message" required>
          {t(`modes.${activeMode}.fields.message`)}
        </FieldLabel>
        <div className="relative">
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            placeholder={t(`modes.${activeMode}.placeholders.message`)}
            disabled={isPending}
            className={`${fieldStatusClass(messageStatus, true)} ${inputDisabledClass}`}
            onChange={(e) => setValue('message', e.target.value)}
            onBlur={() => markTouched('message')}
            aria-invalid={messageStatus === 'invalid'}
            aria-required
            required
          />
          {(messageStatus === 'invalid' || messageStatus === 'valid') && (
            <StatusIcon status={messageStatus} className="top-3 translate-y-0" />
          )}
        </div>
        {fieldErrors.message && (
          <p className="text-[0.72rem] text-red-600 mt-1">{fieldErrors.message}</p>
        )}
      </div>

      <div>
        <div
          className={`flex items-start gap-3 ${isPending ? 'opacity-60 pointer-events-none' : ''} ${privacyStatus === 'invalid' ? 'rounded-sm ring-1 ring-red-500/40 p-2 -m-2' : ''}`}
        >
          <input
            id="privacyAccepted"
            name="privacyAccepted"
            type="checkbox"
            checked={values.privacyAccepted}
            disabled={isPending}
            onChange={(e) => {
              setValue('privacyAccepted', e.target.checked)
              setTouched((prev) => ({ ...prev, privacyAccepted: true }))
            }}
            onBlur={() => markTouched('privacyAccepted')}
            aria-invalid={privacyStatus === 'invalid'}
            aria-required
            className="mt-0.5 h-4 w-4 shrink-0 accent-nd-accent-mid disabled:cursor-not-allowed"
          />
          <div className="text-[0.72rem] text-nd-grey-600 leading-[1.6]">
            <label htmlFor="privacyAccepted" className="cursor-pointer">
              {t('privacy_accept_before')}{' '}
            </label>
            <Link
              href="/privacy"
              className="underline font-medium text-nd-grey-600 hover:text-nd-black transition-colors duration-200"
            >
              {t('privacy_link')}
            </Link>
            <label htmlFor="privacyAccepted" className="cursor-pointer">
              {' '}
              {t('privacy_accept_after')}
            </label>
          </div>
        </div>
        {fieldErrors.privacyAccepted && (
          <p className="text-[0.72rem] text-red-600 mt-2">{fieldErrors.privacyAccepted}</p>
        )}
      </div>

      <SubmitButton pending={isPending} formMode={activeMode} />
    </form>
  )
}
