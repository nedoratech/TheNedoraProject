import { createServerClient } from '@nedora/db/client'
import { decryptContactFromJoin } from '@nedora/db/encryption'
import type { Database, LeadStatus } from '@nedora/db/types'
import LeadStatusBadge from '../../_components/LeadStatusBadge'
import Topbar from '../../_components/Topbar'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar } from '@fortawesome/free-solid-svg-icons'

const STAGES = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const

type LeadRow = Database['public']['Tables']['crm_leads']['Row']
type ContactRow = Database['public']['Tables']['crm_contacts']['Row']
type LeadWithContact = LeadRow & {
  crm_contacts: ContactRow | ContactRow[] | null
}

async function getLeads(status?: string) {
  const supabase = await createServerClient()
  let query = supabase
    .from('crm_leads')
    .select(`
      id, status, created_at, updated_at,
      crm_contacts ( * )
    `)
    .order('updated_at', { ascending: false })

  if (status && STAGES.includes(status as typeof STAGES[number])) {
    query = query.eq('status', status as LeadStatus)
  }
  const { data } = await query
  return (data ?? []) as unknown as LeadWithContact[]
}

interface Props {
  searchParams: Promise<{ status?: string }>
}

export default async function LeadsPage({ searchParams }: Props) {
  const { status } = await searchParams
  const leadsRaw = await getLeads(status)
  const leads = await Promise.all(
    leadsRaw.map(async (lead) => ({
      lead,
      contact: await decryptContactFromJoin(lead.crm_contacts),
    })),
  )

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Leads" subtitle="Pipeline — all active and closed leads" />

      <div className="p-7">
        {/* Filter chips */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          <Link
            href="/dashboard/leads"
            className={
              !status
                ? 'text-xs font-medium px-4 py-1.5 rounded-full bg-accent-m text-white shadow-sm transition-all duration-150'
                : 'text-xs font-medium px-4 py-1.5 rounded-full border b-bdr c2 hover:bg-panel2 transition-all duration-150 bg-panel'
            }
          >
            All
          </Link>
          {STAGES.map((s) => (
            <Link
              key={s}
              href={`/dashboard/leads?status=${s}`}
              className={
                status === s
                  ? 'text-xs font-medium px-4 py-1.5 rounded-full bg-accent-m text-white shadow-sm transition-all duration-150'
                  : 'text-xs font-medium px-4 py-1.5 rounded-full border b-bdr c2 hover:bg-panel2 transition-all duration-150 bg-panel'
              }
            >
              {s}
            </Link>
          ))}
        </div>

        {/* Table */}
        <div className="bg-panel rounded-2xl shadow-card border b-bdr overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-panel2 border-b b-bdr">
                {['Contact', 'Company', 'Status', 'Updated'].map((h) => (
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
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-[0.82rem] c3">
                    <FontAwesomeIcon icon={faChartBar} className="w-8 h-8 c3 mb-3 block mx-auto opacity-30" />
                    No leads{status ? ` in "${status}"` : ''}. Leads are created manually from project requests.
                  </td>
                </tr>
              ) : (
                leads.map(({ lead, contact }) => (
                  <tr key={lead.id} className="border-b row-bdr border row-hover transition-colors duration-100 cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="text-[0.85rem] font-medium c1">
                        {contact?.first_name} {contact?.last_name}
                      </div>
                      <div className="text-[0.72rem] c3 mt-0.5">{contact?.email}</div>
                    </td>
                    <td className="px-6 py-4 text-[0.82rem] c2">{contact?.company ?? '—'}</td>
                    <td className="px-6 py-4">
                      <LeadStatusBadge status={lead.status as typeof STAGES[number]} />
                    </td>
                    <td className="px-6 py-4 text-[0.78rem] c3">
                      {new Date(lead.updated_at).toLocaleDateString()}
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
