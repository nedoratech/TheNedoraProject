'use client'

import { useState, useTransition, useActionState, type FormEvent } from 'react'
import { subscribeNewsletter, type NewsletterState } from '../_actions/subscribeNewsletter'

const initialState: NewsletterState = { status: 'idle' }

export default function NewsletterSection() {
  const [state, formAction, isActionPending] = useActionState(subscribeNewsletter, initialState)
  const [isTransitionPending, startTransition] = useTransition()
  const isPending = isActionPending || isTransitionPending

  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData()
    fd.set('email', email)
    fd.set('privacyAccepted', accepted ? 'true' : 'false')
    startTransition(() => formAction(fd))
  }

  return (
    <section className="py-14 sm:py-18 lg:py-24 bg-white border-t border-[rgba(124,58,237,0.1)]" id="newsletter">
      <div className="max-w-[1160px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div>
            <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-4 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
              Stay in the loop
            </div>
            <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold tracking-[-0.03em] leading-[1.1] text-[#0d0d2b] mb-4">
              Get product updates and AI insights — no spam.
            </h2>
            <p className="text-[0.9rem] leading-[1.6] text-[#5a5780]">
              We send case studies, product announcements, and practical AI content — roughly twice a month.
              You can unsubscribe at any time from the link in each email.
            </p>
          </div>

          <div>
            {state.status === 'success' ? (
              <div className="border border-[rgba(124,58,237,0.2)] bg-[#f7f5ff] px-7 py-10 text-center">
                <div className="mx-auto mb-4 w-9 h-9 flex items-center justify-center border border-[#7c3aed] text-[#7c3aed]">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="miter" />
                  </svg>
                </div>
                <p className="text-[0.95rem] font-bold text-[#0d0d2b] mb-1">You're subscribed</p>
                <p className="text-[0.82rem] text-[#5a5780]">
                  Check your inbox for a confirmation email. Unsubscribe anytime.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {state.status === 'error' && (
                  <div className="border border-red-300 bg-red-50 px-4 py-3 text-[0.8rem] text-red-700">
                    {state.message ?? 'Something went wrong. Please try again.'}
                  </div>
                )}

                <div className="flex gap-0">
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isPending}
                    className="flex-1 border border-[rgba(124,58,237,0.2)] bg-white px-4 py-3.5 text-[0.9rem] text-[#0d0d2b] placeholder:text-[#c0bdd8] focus:outline-none focus:border-[#7c3aed] transition-all duration-200 min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={isPending || !accepted}
                    className="shrink-0 text-[0.68rem] tracking-[0.14em] uppercase font-bold px-5 py-3.5 bg-[#7c3aed] text-white hover:bg-[#9b5cf6] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? '...' : 'Subscribe'}
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="nl-privacy"
                    type="checkbox"
                    name="privacyAccepted"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[#7c3aed]"
                  />
                  <label htmlFor="nl-privacy" className="text-[0.7rem] text-[#9493b0] leading-[1.6] cursor-pointer">
                    I agree to the{' '}
                    <a href="/privacy" className="underline hover:text-[#7c3aed] transition-colors">
                      Privacy Policy
                    </a>
                    . I can unsubscribe at any time.
                  </label>
                </div>
              </form>
            )}

            <p className="mt-4 text-[0.68rem] text-[#c0bdd8] leading-[1.5]">
              Already subscribed and want to opt out?{' '}
              <a href="/unsubscribe" className="underline hover:text-[#7c3aed] transition-colors">
                Unsubscribe here
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
