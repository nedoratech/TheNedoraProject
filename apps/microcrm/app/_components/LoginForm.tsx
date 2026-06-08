'use client'

import { useState } from 'react'
import { createBrowserClient } from '@nedora/db/browser'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons'

type Step = 'credentials' | 'mfa'

const inputClass =
  'in-bg in-bdr border rounded-xl px-4 py-3 text-sm c1 placeholder:c3 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb] transition-all duration-150 w-full'

export default function LoginForm() {
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [factorId, setFactorId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // ── Step 1: email + password ──────────────────────────────────────────────
  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Check whether the session requires a second factor (TOTP)
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

    if (aal?.nextLevel === 'aal2' && aal.currentLevel !== 'aal2') {
      const { data: factorsData } = await supabase.auth.mfa.listFactors()
      const totp = factorsData?.totp?.[0]
      if (totp) {
        setFactorId(totp.id)
        setStep('mfa')
        setLoading(false)
        return
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  // ── Step 2: TOTP code ─────────────────────────────────────────────────────
  async function handleMfa(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createBrowserClient()
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })

    if (challengeError || !challenge) {
      setError(challengeError?.message ?? 'Failed to initiate MFA challenge.')
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code: totpCode.replace(/\s/g, ''),
    })

    if (verifyError) {
      setError(verifyError.message)
      setTotpCode('')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  // ── Credentials form ──────────────────────────────────────────────────────
  if (step === 'credentials') {
    return (
      <form onSubmit={handleCredentials} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[0.65rem] tracking-[0.16em] uppercase font-bold c3 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@nedora.co"
            required
            autoComplete="email"
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[0.65rem] tracking-[0.16em] uppercase font-bold c3 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-1 text-sm font-semibold py-3 rounded-xl bg-[#3b5bdb] text-white hover:bg-[#6473f3] active:scale-[0.99] transition-all duration-150 disabled:opacity-50 w-full"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    )
  }

  // ── MFA form ──────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleMfa} className="flex flex-col gap-4">
      <div className="rounded-xl border border-[#3b5bdb]/20 bg-[#eff6ff] px-4 py-3 text-sm text-[#3b5bdb] flex items-center gap-3">
        <FontAwesomeIcon icon={faShieldHalved} className="w-4 h-4 flex-shrink-0" />
        <span>Open your authenticator app and enter the 6-digit code for Nedora CRM.</span>
      </div>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div>
        <label className="block text-[0.65rem] tracking-[0.16em] uppercase font-bold c3 mb-2">
          Authenticator code
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9 ]{6,7}"
          maxLength={7}
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
          placeholder="000 000"
          required
          autoFocus
          autoComplete="one-time-code"
          className={`${inputClass} text-center text-[1.4rem] font-bold tracking-[0.3em]`}
        />
      </div>
      <button
        type="submit"
        disabled={loading || totpCode.replace(/\s/g, '').length < 6}
        className="mt-1 text-sm font-semibold py-3 rounded-xl bg-[#3b5bdb] text-white hover:bg-[#6473f3] active:scale-[0.99] transition-all duration-150 disabled:opacity-50 w-full"
      >
        {loading ? 'Verifying…' : 'Verify'}
      </button>
      <button
        type="button"
        onClick={() => { setStep('credentials'); setError(''); setTotpCode('') }}
        className="text-xs c3 hover:c2 transition-colors text-center mt-1"
      >
        ← Back to sign in
      </button>
    </form>
  )
}
