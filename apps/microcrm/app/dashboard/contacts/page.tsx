import { createServerClient } from '@nedora/db/client'
import { decryptContact } from '@nedora/db/encryption'
import Topbar from '../../_components/Topbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers } from '@fortawesome/free-solid-svg-icons'

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
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Contacts" subtitle="All people — leads, clients, and partners" />

      <div className="p-7">
        <div className="bg-panel rounded-2xl shadow-card border b-bdr overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-panel2 border-b b-bdr">
                {['Name', 'Email', 'Company', 'Source', 'Added'].map((h) => (
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
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-[0.82rem] c3">
                    <FontAwesomeIcon icon={faUsers} className="w-8 h-8 c3 mb-3 block mx-auto opacity-30" />
                    No contacts yet. Contacts are created automatically from project requests.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="border-b row-bdr border row-hover transition-colors duration-100 cursor-pointer">
                    <td className="px-6 py-4 text-[0.85rem] font-medium c1">
                      {c.first_name} {c.last_name}
                    </td>
                    <td className="px-6 py-4 text-[0.82rem] c2">{c.email}</td>
                    <td className="px-6 py-4 text-[0.82rem] c2">{c.company ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className="text-[0.65rem] font-semibold border b-bdr2 c3 px-2.5 py-0.5 rounded-full">
                        {c.source ?? 'form'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[0.78rem] c3">
                      {new Date(c.created_at).toLocaleDateString()}
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
