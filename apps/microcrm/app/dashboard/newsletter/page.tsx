import { createServerClient } from '@nedora/db/client'
import { decryptNewsletterSubscriber } from '@nedora/db/encryption'
import Topbar from '../../_components/Topbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUsers, faUserXmark, type IconDefinition } from '@fortawesome/free-solid-svg-icons'

async function getSubscribers() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('crm_newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false })
  return Promise.all((data ?? []).map(decryptNewsletterSubscriber))
}

export default async function NewsletterPage() {
  const subscribers = await getSubscribers()
  const active = subscribers.filter((s) => s.status === 'active')
  const unsubscribed = subscribers.filter((s) => s.status === 'unsubscribed')

  const statsList: { label: string; value: number; borderColor: string; icon: IconDefinition }[] = [
    { label: 'Active subscribers', value: active.length,       borderColor: '#22c55e', icon: faEnvelope },
    { label: 'Unsubscribed',        value: unsubscribed.length, borderColor: '#a1a1aa', icon: faUserXmark },
    { label: 'Total ever',          value: subscribers.length,  borderColor: '#6473f3', icon: faUsers },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Newsletter" subtitle="Subscribers who have given explicit GDPR consent" />

      <div className="p-7">
        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {statsList.map((stat) => (
            <div
              key={stat.label}
              className="bg-panel rounded-2xl shadow-card border b-bdr p-6"
              style={{ borderTopWidth: '3px', borderTopColor: stat.borderColor }}
            >
              <FontAwesomeIcon icon={stat.icon} className="w-5 h-5 mb-3 opacity-60" style={{ color: stat.borderColor }} />
              <p className="text-sm font-medium c3 mb-3">{stat.label}</p>
              <div className="text-3xl font-bold c1">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Subscriber table */}
        <div className="bg-panel rounded-2xl shadow-card border b-bdr overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-panel2 border-b b-bdr">
                {['Email', 'Name', 'Status', 'Consent', 'Subscribed'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-[0.65rem] font-semibold c3 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[0.82rem] c3">
                    <FontAwesomeIcon icon={faEnvelope} className="w-8 h-8 c3 mb-3 block mx-auto opacity-30" />
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b row-bdr border row-hover transition-colors duration-100 cursor-pointer">
                    <td className="px-6 py-4 text-[0.85rem] c1">{sub.email}</td>
                    <td className="px-6 py-4 text-[0.82rem] c2">
                      {[sub.first_name, sub.last_name].filter(Boolean).join(' ') || '—'}
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === 'active' ? (
                        <span
                          style={{ background: '#dcfce7', color: '#166534', borderColor: '#86efac' }}
                          className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold border px-2.5 py-1 rounded-full"
                        >
                          <span className="w-[5px] h-[5px] rounded-full bg-[#22c55e] flex-shrink-0" />
                          active
                        </span>
                      ) : (
                        <span className="text-[0.65rem] font-semibold border b-bdr2 c3 px-2.5 py-1 rounded-full">
                          {sub.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[0.72rem] c3">
                      {sub.consent_given_at
                        ? new Date(sub.consent_given_at).toLocaleDateString()
                        : '—'}
                    </td>
                    <td className="px-6 py-4 text-[0.78rem] c3">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
