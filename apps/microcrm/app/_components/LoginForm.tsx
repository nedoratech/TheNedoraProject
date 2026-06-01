'use client'

import { useState } from 'react'
import { createBrowserClient } from '@nedora/db/client'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const supabase = createBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  const inputClass = 'w-full border border-nd-grey-600 bg-transparent px-4 py-3 text-[0.9rem] text-nd-white placeholder:text-nd-grey-400 focus:outline-none focus:border-nd-accent-mid transition-colors duration-200'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="border border-red-800 bg-red-950 px-4 py-3 text-[0.82rem] text-red-400">{error}</div>}
      <div>
        <label className="block text-[0.65rem] tracking-[0.16em] uppercase font-bold text-nd-grey-400 mb-2">Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@nedora.co" required className={inputClass} />
      </div>
      <div>
        <label className="block text-[0.65rem] tracking-[0.16em] uppercase font-bold text-nd-grey-400 mb-2">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className={inputClass} />
      </div>
      <button type="submit" disabled={loading} className="mt-2 text-[0.78rem] tracking-[0.14em] uppercase font-bold py-3 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors duration-200 disabled:opacity-50">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
