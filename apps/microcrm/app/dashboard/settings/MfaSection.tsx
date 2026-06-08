'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@nedora/db/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faMobile, faKey } from '@fortawesome/free-solid-svg-icons'

type Factor = { id: string; friendly_name?: string; factor_type: string; status: string }
type EnrollStep = 'idle' | 'qr' | 'verify'

export default function MfaSection() {
  const [factors, setFactors] = useState<Factor[]>([])
  const [enrollStep, setEnrollStep] = useState<EnrollStep>('idle')
  const [pendingFactorId, setPendingFactorId] = useState('')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingFactors, setLoadingFactors] = useState(true)

  const loadFactors = useCallback(async () => {
    setLoadingFactors(true)
    const supabase = createBrowserClient()
    const { data } = await supabase.auth.mfa.listFactors()
    setFactors(data?.totp ?? [])
    setLoadingFactors(false)
  }, [])

  useEffect(() => { loadFactors() }, [loadFactors])

  async function startEnroll() {
    setLoading(true)
    setError('')
    const supabase = createBrowserClient()
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'Nedora CRM',
    })
    if (enrollError || !data) {
      setError(enrollError?.message ?? 'Enrollment failed.')
      setLoading(false)
      return
    }
    setPendingFactorId(data.id)
    setQrCode(data.totp.qr_code)
    setSecret(data.totp.secret)
    setEnrollStep('qr')
    setLoading(false)
  }

  async function verifyEnroll(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createBrowserClient()
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
      factorId: pendingFactorId,
    })
    if (challengeError || !challenge) {
      setError(challengeError?.message ?? 'Challenge failed.')
      setLoading(false)
      return
    }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: pendingFactorId,
      challengeId: challenge.id,
      code: totpCode.replace(/\s/g, ''),
    })
    if (verifyError) {
      setError(verifyError.message)
      setTotpCode('')
      setLoading(false)
      return
    }
    setEnrollStep('idle')
    setTotpCode('')
    setPendingFactorId('')
    setQrCode('')
    setSecret('')
    await loadFactors()
    setLoading(false)
  }

  async function cancelEnroll() {
    if (pendingFactorId) {
      const supabase = createBrowserClient()
      await supabase.auth.mfa.unenroll({ factorId: pendingFactorId })
    }
    setEnrollStep('idle')
    setTotpCode('')
    setPendingFactorId('')
    setQrCode('')
    setSecret('')
    setError('')
  }

  async function unenroll(factorId: string) {
    setLoading(true)
    const supabase = createBrowserClient()
    await supabase.auth.mfa.unenroll({ factorId })
    await loadFactors()
    setLoading(false)
  }

  const inputClass =
    'in-bg in-bdr border rounded-xl px-4 py-3 text-sm c1 placeholder:c3 focus:outline-none focus:ring-2 focus:ring-[#3b5bdb]/20 focus:border-[#3b5bdb] transition-all duration-150 w-full'

  const verifiedFactors = factors.filter((f) => f.status === 'verified')
  const hasMfa = verifiedFactors.length > 0

  return (
    <div>
      {/* Status row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[0.6rem] tracking-[0.16em] uppercase font-bold c3 mb-1.5">Status</p>
          {loadingFactors ? (
            <p className="text-[0.82rem] c3">Loading…</p>
          ) : hasMfa ? (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleCheck} className="w-4 h-4 text-[#22c55e]" />
              <span className="text-[0.85rem] c1">MFA enabled</span>
              <span
                style={{ background: '#dcfce7', color: '#166534', borderColor: '#86efac' }}
                className="text-[0.6rem] tracking-[0.1em] uppercase font-bold border px-2.5 py-0.5 rounded-full"
              >
                TOTP active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCircleXmark} className="w-4 h-4 text-[#a1a1aa]" />
              <span className="text-[0.85rem] c2">MFA not configured</span>
            </div>
          )}
        </div>
      </div>

      {/* Active factors */}
      {verifiedFactors.length > 0 && enrollStep === 'idle' && (
        <div className="mb-6 flex flex-col gap-2">
          {verifiedFactors.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between bg-panel2 rounded-xl border b-bdr px-5 py-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center flex-shrink-0">
                  <FontAwesomeIcon icon={faMobile} className="w-4 h-4 text-[#2563eb]" />
                </div>
                <div>
                  <p className="text-[0.85rem] c1">{f.friendly_name ?? 'Authenticator app'}</p>
                  <p className="text-[0.72rem] c3 mt-0.5">
                    TOTP · Compatible with Microsoft Authenticator, Google Authenticator, and others
                  </p>
                </div>
              </div>
              <button
                onClick={() => unenroll(f.id)}
                disabled={loading}
                className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors duration-150"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Enroll: idle, no MFA yet */}
      {enrollStep === 'idle' && !hasMfa && (
        <div className="bg-panel2 rounded-xl border b-bdr px-6 py-6 mb-6">
          <p className="text-[0.82rem] c2 mb-1">
            Protect your account with a time-based one-time password (TOTP). Works with Microsoft Authenticator, Google Authenticator, and any RFC 6238–compatible app.
          </p>
          <button
            onClick={startEnroll}
            disabled={loading}
            className="mt-4 text-sm font-semibold px-5 py-2.5 rounded-xl bg-accent-m text-white hover:bg-accent-b transition-all duration-150 disabled:opacity-50"
          >
            {loading ? 'Setting up…' : 'Set up authenticator app'}
          </button>
        </div>
      )}

      {/* Enroll: add another after one exists */}
      {enrollStep === 'idle' && hasMfa && (
        <button
          onClick={startEnroll}
          disabled={loading}
          className="text-sm font-semibold px-5 py-2.5 rounded-xl border b-bdr2 c2 hover:bg-panel2 hover:c1 transition-all duration-150 disabled:opacity-50"
        >
          {loading ? 'Setting up…' : 'Add another authenticator'}
        </button>
      )}

      {/* Enroll: QR code step */}
      {enrollStep === 'qr' && (
        <div className="bg-panel2 rounded-xl border b-bdr p-6">
          <div className="w-9 h-9 rounded-xl bg-[#eff6ff] flex items-center justify-center mb-4">
            <FontAwesomeIcon icon={faKey} className="w-4 h-4 text-[#2563eb]" />
          </div>
          <p className="text-[0.65rem] tracking-[0.18em] uppercase font-bold c3 mb-4">
            Step 1 — Scan QR code
          </p>
          <p className="text-[0.82rem] c2 mb-5">
            Open Microsoft Authenticator (or any TOTP app), tap{' '}
            <strong className="c1 font-medium">Add account → Other account</strong>, and scan the QR code below.
          </p>

          <div className="bg-white p-4 rounded-xl inline-block mb-5 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCode} alt="TOTP QR code" width={160} height={160} />
          </div>

          <div className="mb-6">
            <p className="text-[0.65rem] tracking-[0.16em] uppercase font-bold c3 mb-2">
              Or enter this key manually
            </p>
            <code className="font-mono text-sm c2 bg-panel2 border b-bdr rounded-xl px-4 py-3 break-all block">
              {secret}
            </code>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setEnrollStep('verify')}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-accent-m text-white hover:bg-accent-b transition-all duration-150"
            >
              I&apos;ve scanned it →
            </button>
            <button
              onClick={cancelEnroll}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl border b-bdr2 c2 hover:bg-panel2 hover:c1 transition-all duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Enroll: verify code step */}
      {enrollStep === 'verify' && (
        <div className="bg-panel2 rounded-xl border b-bdr p-6">
          <p className="text-[0.65rem] tracking-[0.18em] uppercase font-bold c3 mb-4">
            Step 2 — Confirm setup
          </p>
          <p className="text-[0.82rem] c2 mb-5">
            Enter the 6-digit code shown in your authenticator app to confirm the setup.
          </p>
          <form onSubmit={verifyEnroll} className="flex flex-col gap-4 max-w-xs">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div>
              <label className="block text-[0.65rem] tracking-[0.16em] uppercase font-bold c3 mb-2">
                Verification code
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
                className={`${inputClass} text-center text-[1.2rem] font-bold tracking-[0.25em]`}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || totpCode.replace(/\s/g, '').length < 6}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-accent-m text-white hover:bg-accent-b transition-all duration-150 disabled:opacity-50"
              >
                {loading ? 'Verifying…' : 'Confirm'}
              </button>
              <button
                type="button"
                onClick={() => setEnrollStep('qr')}
                className="text-sm font-semibold px-5 py-2.5 rounded-xl border b-bdr2 c2 hover:bg-panel2 hover:c1 transition-all duration-150"
              >
                ← Back
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
