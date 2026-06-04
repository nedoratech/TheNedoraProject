import { createServerClient } from '@nedora/db/client'
import { decryptContact } from '@nedora/db/encryption'

async function getContacts() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('crm_contacts')
    .select('*')
    .order('created_at', { ascending: false })
  return Promise.all((data ?? []).map(decryptContact))
}

export default async function ContactsPage() {
  const contacts = await getContacts()

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">People</p>
          <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Contacts</h1>
        </div>
      </div>

      <div className="border border-white/[0.08]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Name', 'Email', 'Company', 'Source', 'Added'].map((h) => (
                <th key={h} className="px-5 py-3 text-[0.6rem] tracking-[0.18em] uppercase font-bold text-nd-grey-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-[0.82rem] text-nd-grey-600">
                  No contacts yet. Contacts are created automatically from project requests.
                </td>
              </tr>
            ) : contacts.map((c) => (
              <tr key={c.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-[0.85rem] text-nd-white font-medium">
                  {c.first_name} {c.last_name}
                </td>
                <td className="px-5 py-3.5 text-[0.82rem] text-nd-grey-400">{c.email}</td>
                <td className="px-5 py-3.5 text-[0.82rem] text-nd-grey-400">{c.company ?? '—'}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[0.6rem] tracking-[0.1em] uppercase border border-white/10 text-nd-grey-600 px-2 py-0.5">{c.source ?? 'form'}</span>
                </td>
                <td className="px-5 py-3.5 text-[0.78rem] text-nd-grey-600">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
