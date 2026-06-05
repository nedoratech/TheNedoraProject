'use client'

import {
  useState,
  useTransition,
  useActionState,
  type FormEvent,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faChartBar, faLock } from '@fortawesome/free-solid-svg-icons'
import { submitDemoRequest, type DemoRequestState } from '../_actions/submitDemoRequest'

const INDUSTRIES = [
  'Healthcare / Medical',
  'Automotive Dealerships',
  'Professional Services',
  'Hospitality',
  'Financial Services',
  'Retail / E-commerce',
  'Other',
]

const SIZES = [
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '200+ employees',
]

const initialState: DemoRequestState = { status: 'idle' }

const labelClass = 'block text-[0.62rem] tracking-[0.16em] uppercase font-bold text-[#9493b0] mb-2'
const inputClass = 'w-full border border-[rgba(124,58,237,0.2)] bg-white px-4 py-3 text-[0.9rem] text-[#0d0d2b] placeholder:text-[#c0bdd8] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[rgba(124,58,237,0.2)] transition-all duration-200'
const selectClass = `${inputClass} appearance-none cursor-pointer`

function FormSpinner() {
  return (
    <span className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  )
}

export default function DemoSection() {
  const [state, formAction, isActionPending] = useActionState(submitDemoRequest, initialState)
  const [isTransitionPending, startTransition] = useTransition()
  const isPending = isActionPending || isTransitionPending

  const [values, setValues] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    company: '', industry: '', size: '', message: '',
    privacyAccepted: false,
  })

  const set = (field: keyof typeof values, value: string | boolean) =>
    setValues((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(values).forEach(([k, v]) => fd.set(k, String(v)))
    startTransition(() => formAction(fd))
  }

  if (state.status === 'success') {
    return (
      <section className="py-14 sm:py-18 lg:py-24 bg-[#f7f5ff] border-t border-[rgba(124,58,237,0.1)]" id="demo">
        <div className="max-w-[700px] mx-auto px-5 sm:px-8 text-center">
          <div className="border border-[rgba(124,58,237,0.2)] bg-white px-8 py-14">
            <div className="mx-auto mb-5 w-10 h-10 flex items-center justify-center border border-[#7c3aed] text-[#7c3aed]">
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="miter" />
              </svg>
            </div>
            <p className="text-[1.05rem] font-bold text-[#0d0d2b] mb-2">Demo request received</p>
            <p className="text-[0.88rem] text-[#5a5780] leading-[1.6]">
              We'll be in touch within one business day to confirm your session and prepare a scenario tailored to your business.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-[#f7f5ff] border-t border-[rgba(124,58,237,0.1)]" id="demo">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20">
          {/* Left column */}
          <div className="lg:pt-2">
            <div className="text-[0.65rem] lg:text-[0.75rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
              Book a demo
            </div>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b] mb-5">
              See NedAI handle a call from your industry.
            </h2>
            <p className="text-[0.9rem] leading-[1.6] text-[#5a5780] mb-8">
              In a 30-minute live session, we'll run NedAI through scenarios specific to your business — your industry, your call types, your booking system — and show you exactly what gets automated.
            </p>

            <div className="flex flex-col gap-5">
              {[
                { icon: faBullseye, title: 'Custom to your operation', body: 'We prep scenarios using your industry and call volume profile before the session.' },
                { icon: faChartBar, title: 'Your ROI, not ours', body: 'We calculate the business case using your actual headcount and estimated call volume.' },
                { icon: faLock, title: 'No commitment', body: 'A demo is a demo. No sales pressure, no contract, no lock-in.' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-[rgba(124,58,237,0.25)] text-[#7c3aed] bg-[rgba(124,58,237,0.04)]">
                    <FontAwesomeIcon icon={item.icon} className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[0.88rem] font-bold text-[#0d0d2b] mb-0.5">{item.title}</div>
                    <p className="text-[0.82rem] text-[#5a5780] leading-[1.5]">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-[rgba(124,58,237,0.12)] p-7 sm:p-10">
            {state.status === 'error' && (
              <div className="mb-5 border border-red-300 bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">
                {state.message ?? 'Something went wrong. Please try again.'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="firstName">First name *</label>
                  <input id="firstName" name="firstName" type="text" required disabled={isPending}
                    value={values.firstName} onChange={(e) => set('firstName', e.target.value)}
                    placeholder="Ana" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="lastName">Last name *</label>
                  <input id="lastName" name="lastName" type="text" required disabled={isPending}
                    value={values.lastName} onChange={(e) => set('lastName', e.target.value)}
                    placeholder="Ionescu" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass} htmlFor="email">Work email *</label>
                  <input id="email" name="email" type="email" required disabled={isPending}
                    value={values.email} onChange={(e) => set('email', e.target.value)}
                    placeholder="ana@company.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="phone">Phone number</label>
                  <input id="phone" name="phone" type="tel" disabled={isPending}
                    value={values.phone} onChange={(e) => set('phone', e.target.value)}
                    placeholder="+40 700 000 000" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="company">Company name *</label>
                <input id="company" name="company" type="text" required disabled={isPending}
                  value={values.company} onChange={(e) => set('company', e.target.value)}
                  placeholder="Acme S.A." className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <label className={labelClass} htmlFor="industry">Industry *</label>
                  <select id="industry" name="industry" required disabled={isPending}
                    value={values.industry} onChange={(e) => set('industry', e.target.value)}
                    className={selectClass}>
                    <option value="" disabled>Select industry</option>
                    {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 bottom-3 text-[#9493b0]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter"/></svg>
                  </span>
                </div>
                <div className="relative">
                  <label className={labelClass} htmlFor="size">Company size *</label>
                  <select id="size" name="size" required disabled={isPending}
                    value={values.size} onChange={(e) => set('size', e.target.value)}
                    className={selectClass}>
                    <option value="" disabled>Select size</option>
                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 bottom-3 text-[#9493b0]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter"/></svg>
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass} htmlFor="message">What's your main challenge? (optional)</label>
                <textarea id="message" name="message" rows={4} disabled={isPending}
                  value={values.message} onChange={(e) => set('message', e.target.value)}
                  placeholder="e.g. We get 500+ calls/day and our team can't keep up during peak hours..."
                  className={`${inputClass} resize-none`} />
              </div>

              <div className={`flex items-start gap-3 ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
                <input id="privacyAccepted" name="privacyAccepted" type="checkbox"
                  checked={values.privacyAccepted} required
                  onChange={(e) => set('privacyAccepted', e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#7c3aed]" />
                <label htmlFor="privacyAccepted" className="text-[0.72rem] text-[#9493b0] leading-[1.6] cursor-pointer">
                  I agree to the{' '}
                  <a href="/privacy" className="underline text-[#5a5780] hover:text-[#7c3aed] transition-colors">
                    Privacy Policy
                  </a>
                  . NedAI will use my data to prepare and conduct the demo session.
                </label>
              </div>

              <button
                type="submit"
                disabled={isPending || !values.privacyAccepted}
                className="flex items-center justify-center gap-2.5 text-[0.78rem] tracking-[0.14em] uppercase font-bold py-4 bg-[#e91e8c] text-white hover:bg-[#c2177a] hover:shadow-[0_4px_24px_rgba(233,30,140,0.35)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {isPending && <FormSpinner />}
                {isPending ? 'Sending request...' : 'Book my demo session'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
