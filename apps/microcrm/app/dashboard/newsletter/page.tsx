import { createServerClient } from '@nedora/db/client'

async function getSubscribers() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('crm_newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })
  return data ?? []
}

export default async function NewsletterPage() {
  const subscribers = await getSubscribers()
  const active = subscribers.filter((s) => s.status === 'active')
  const unsubscribed = subscribers.filter((s) => s.status === 'unsubscribed')

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Communication</p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Newsletter</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mt-1">Subscribers who have given explicit GDPR consent.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Active subscribers', value: active.length, color: 'text-green-400' },
          { label: 'Unsubscribed', value: unsubscribed.length, color: 'text-nd-grey-400' },
          { label: 'Total ever', value: subscribers.length, color: 'text-nd-white' },
        ].map((stat) => (
          <div key={stat.label} className="border border-white/[0.08] bg-white/[0.02] px-5 py-4">
            <div className={`text-[2rem] font-bold tracking-[-0.04em] ${stat.color}`}>{stat.value}</div>
            <div className="text-[0.72rem] text-nd-grey-600 mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Subscribers table */}
      <div className="border border-white/[0.08]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Email', 'Name', 'Status', 'Consent', 'Subscribed'].map((h) => (
                <th key={h} className="px-5 py-3 text-[0.6rem] tracking-[0.18em] uppercase font-bold text-nd-grey-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[0.82rem] text-nd-grey-600">
                  No subscribers yet.
                </td>
              </tr>
            ) : subscribers.map((sub) => (
              <tr key={sub.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-[0.85rem] text-nd-white">{sub.email}</td>
                <td className="px-5 py-3.5 text-[0.82rem] text-nd-grey-400">
                  {[sub.first_name, sub.last_name].filter(Boolean).join(' ') || '—'}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[0.6rem] tracking-[0.12em] uppercase font-bold border px-2 py-0.5 ${
                    sub.status === 'active' ? 'border-green-700/40 text-green-400' : 'border-nd-grey-600/30 text-nd-grey-600'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[0.72rem] text-nd-grey-600">
                  {sub.consent_given_at ? new Date(sub.consent_given_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-5 py-3.5 text-[0.78rem] text-nd-grey-600">
                  {new Date(sub.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
