'use client'

import { useState, useTransition, useActionState, type FormEvent } from 'react'
import { unsubscribeNewsletter, type UnsubscribeState } from '../_actions/unsubscribeNewsletter'
import Nav from '../_components/Nav'
import Footer from '../_components/Footer'

const initialState: UnsubscribeState = { status: 'idle' }

export default function UnsubscribePage() {
  const [state, formAction, isActionPending] = useActionState(unsubscribeNewsletter, initialState)
  const [isTransitionPending, startTransition] = useTransition()
  const isPending = isActionPending || isTransitionPending
  const [email, setEmail] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData()
    fd.set('email', email)
    startTransition(() => formAction(fd))
  }

  return (
    <>
      <Nav />
      <main className="min-h-[80svh] pt-[var(--na-nav-h)] bg-[#f7f5ff]">
        <div className="max-w-[560px] mx-auto px-5 sm:px-8 py-14 sm:py-20 lg:py-28">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase font-bold text-[#9493b0] hover:text-[#7c3aed] transition-colors duration-200 mb-10"
          >
            <span aria-hidden>←</span>
            Back to NedAI
          </a>

          <div className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-[#7c3aed] mb-5 flex items-center gap-2 before:content-[''] before:w-6 before:h-0.5 before:bg-[#7c3aed]">
            Newsletter
          </div>

          <h1 className="text-[2rem] sm:text-[2.4rem] font-bold tracking-[-0.035em] leading-[1.05] text-[#0d0d2b] mb-4">
            Unsubscribe
          </h1>
          <p className="text-[0.9rem] text-[#5a5780] leading-[1.6] mb-10">
            Enter the email address you used to subscribe and we'll remove you from the NedAI newsletter immediately.
          </p>

          {state.status === 'success' ? (
            <div className="border border-[rgba(124,58,237,0.2)] bg-white px-7 py-10 text-center">
              <div className="mx-auto mb-4 w-9 h-9 flex items-center justify-center border border-[#7c3aed] text-[#7c3aed]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="butt" strokeLinejoin="miter" />
                </svg>
              </div>
              {state.found ? (
                <>
                  <p className="text-[0.95rem] font-bold text-[#0d0d2b] mb-1">Done — you're unsubscribed</p>
                  <p className="text-[0.82rem] text-[#5a5780]">
                    You won't receive any further emails from NedAI. Your data will be purged within 6 months per our retention policy.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[0.95rem] font-bold text-[#0d0d2b] mb-1">Email not found</p>
                  <p className="text-[0.82rem] text-[#5a5780]">
                    We couldn't find a subscription for that address. You may already be unsubscribed, or the email may differ from what you used to sign up.
                  </p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {state.status === 'error' && (
                <div className="border border-red-300 bg-red-50 px-4 py-3 text-[0.82rem] text-red-700">
                  {state.message}
                </div>
              )}

              <div>
                <label className="block text-[0.62rem] tracking-[0.16em] uppercase font-bold text-[#9493b0] mb-2" htmlFor="email">
                  Email address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  disabled={isPending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border border-[rgba(124,58,237,0.2)] bg-white px-4 py-3.5 text-[0.9rem] text-[#0d0d2b] placeholder:text-[#c0bdd8] focus:outline-none focus:border-[#7c3aed] transition-all duration-200"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="text-[0.75rem] tracking-[0.14em] uppercase font-bold py-4 bg-[#7c3aed] text-white hover:bg-[#9b5cf6] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? 'Processing...' : 'Unsubscribe me'}
              </button>
            </form>
          )}

          <p className="mt-8 text-[0.72rem] text-[#c0bdd8] leading-[1.6]">
            For other data requests (access, deletion, portability), email{' '}
            <a href="mailto:privacy@nedora.co" className="underline hover:text-[#7c3aed] transition-colors">
              privacy@nedora.co
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
