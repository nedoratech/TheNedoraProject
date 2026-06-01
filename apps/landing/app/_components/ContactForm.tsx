'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { submitProjectRequest, type SubmitProjectRequestState } from '../_actions/submitProjectRequest'

const initialState: SubmitProjectRequestState = { status: 'idle' }

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full text-[0.82rem] tracking-[0.14em] uppercase font-bold py-4 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright hover:shadow-[0_0_32px_rgba(99,115,243,0.5)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Sending…' : 'Send request →'}
    </button>
  )
}

const labelClass = 'block text-[0.65rem] tracking-[0.16em] uppercase font-bold text-nd-grey-600 mb-2'
const inputClass = 'w-full border border-nd-grey-200 bg-nd-white px-4 py-3 text-[0.9rem] font-[var(--font-futura)] text-nd-black placeholder:text-nd-grey-400 focus:outline-none focus:border-nd-accent-mid transition-colors duration-200'
const radioLabelClass = 'flex items-center gap-2 text-[0.8rem] text-nd-grey-600 cursor-pointer hover:text-nd-black transition-colors duration-200'

export default function ContactForm() {
  const [state, formAction] = useActionState(submitProjectRequest, initialState)

  if (state.status === 'success') {
    return (
      <div className="border border-nd-accent-mid bg-nd-accent-light px-8 py-12 text-center">
        <div className="text-nd-accent-bright text-[1.5rem] mb-4">✓</div>
        <p className="text-[1rem] font-bold text-nd-accent tracking-[-0.01em]">Request received.</p>
        <p className="text-[0.88rem] text-nd-grey-600 mt-2">We&apos;ll be in touch within two business days.</p>
      </div>
    )
  }

  const fe = state.status === 'error' ? state.fieldErrors ?? {} : {}

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.status === 'error' && state.message && (
        <div className="border border-red-300 bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">
          {state.message}
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>First name</label>
          <input name="firstName" type="text" placeholder="Maria" className={inputClass} />
          {fe.firstName && <p className="text-[0.72rem] text-red-600 mt-1">{fe.firstName[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Last name</label>
          <input name="lastName" type="text" placeholder="Ionescu" className={inputClass} />
          {fe.lastName && <p className="text-[0.72rem] text-red-600 mt-1">{fe.lastName[0]}</p>}
        </div>
      </div>

      {/* Email + Company */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Work email</label>
          <input name="email" type="email" placeholder="maria@company.com" className={inputClass} />
          {fe.email && <p className="text-[0.72rem] text-red-600 mt-1">{fe.email[0]}</p>}
        </div>
        <div>
          <label className={labelClass}>Company</label>
          <input name="company" type="text" placeholder="Acme Corp" className={inputClass} />
          {fe.company && <p className="text-[0.72rem] text-red-600 mt-1">{fe.company[0]}</p>}
        </div>
      </div>

      {/* Project type */}
      <div>
        <label className={labelClass}>Project type</label>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-1">
          {[
            { value: 'new_application', label: 'New application' },
            { value: 'integration_modernisation', label: 'Integration / modernisation' },
            { value: 'support_evolution', label: 'Support & evolution' },
            { value: 'not_sure', label: 'Not sure yet' },
          ].map((opt) => (
            <label key={opt.value} className={radioLabelClass}>
              <input type="radio" name="projectType" value={opt.value} defaultChecked={opt.value === 'new_application'} className="accent-nd-accent-mid" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Engagement + Timeline */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Engagement model</label>
          <div className="flex flex-col gap-2 mt-1">
            {[
              { value: 'fixed_scope', label: 'Fixed-scope' },
              { value: 'time_based', label: 'Time-based' },
              { value: 'not_sure', label: 'Not sure' },
            ].map((opt) => (
              <label key={opt.value} className={radioLabelClass}>
                <input type="radio" name="engagementModel" value={opt.value} defaultChecked={opt.value === 'fixed_scope'} className="accent-nd-accent-mid" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Timeline</label>
          <div className="flex flex-col gap-2 mt-1">
            {[
              { value: 'ready_now', label: 'Ready now' },
              { value: '1_3_months', label: '1–3 months' },
              { value: '3_6_months', label: '3–6 months' },
              { value: 'exploring', label: 'Exploring' },
            ].map((opt) => (
              <label key={opt.value} className={radioLabelClass}>
                <input type="radio" name="timeline" value={opt.value} defaultChecked={opt.value === 'ready_now'} className="accent-nd-accent-mid" />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className={labelClass}>Tell us about your project</label>
        <textarea
          name="message"
          rows={5}
          placeholder="Describe what you're building, your current stack, and any key constraints…"
          className={`${inputClass} resize-none`}
        />
        {fe.message && <p className="text-[0.72rem] text-red-600 mt-1">{fe.message[0]}</p>}
      </div>

      <p className="text-[0.72rem] text-nd-grey-400 leading-[1.6]">
        By submitting this form you agree that Nedora may process your data to respond to your enquiry.{' '}
        <a href="/privacy" className="underline hover:text-nd-grey-600 transition-colors">Privacy Policy.</a>
      </p>

      <SubmitButton />
    </form>
  )
}
