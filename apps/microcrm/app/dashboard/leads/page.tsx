import { createServerClient } from '@nedora/db/client'
import { decryptContactFromJoin } from '@nedora/db/encryption'
import type { Database, LeadStatus } from '@nedora/db/types'
import LeadStatusBadge from '../../_components/LeadStatusBadge'
import Link from 'next/link'

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
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Pipeline</p>
          <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Leads</h1>
        </div>
      </div>

      <div className="flex gap-1 mb-6 flex-wrap">
        <Link
          href="/dashboard/leads"
          className={`text-[0.65rem] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border transition-colors ${!status ? 'border-nd-accent-mid text-nd-accent-bright' : 'border-white/[0.1] text-nd-grey-600 hover:text-nd-white'}`}
        >
          All
        </Link>
        {STAGES.map((s) => (
          <Link
            key={s}
            href={`/dashboard/leads?status=${s}`}
            className={`text-[0.65rem] tracking-[0.12em] uppercase font-bold px-3 py-1.5 border transition-colors ${status === s ? 'border-nd-accent-mid text-nd-accent-bright' : 'border-white/[0.1] text-nd-grey-600 hover:text-nd-white'}`}
          >
            {s}
          </Link>
        ))}
      </div>

      <div className="border border-white/[0.08]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Contact', 'Company', 'Status', 'Updated'].map((h) => (
                <th key={h} className="px-5 py-3 text-[0.6rem] tracking-[0.18em] uppercase font-bold text-nd-grey-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-[0.82rem] text-nd-grey-600">
                  No leads{status ? ` in "${status}"` : ''}. Project requests automatically create leads.
                </td>
              </tr>
            ) : leads.map(({ lead, contact }) => (
                <tr key={lead.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="text-[0.85rem] text-nd-white">{contact?.first_name} {contact?.last_name}</div>
                    <div className="text-[0.72rem] text-nd-grey-600">{contact?.email}</div>
                  </td>
                  <td className="px-5 py-3.5 text-[0.82rem] text-nd-grey-400">{contact?.company ?? '—'}</td>
                  <td className="px-5 py-3.5">
                    <LeadStatusBadge status={lead.status as typeof STAGES[number]} />
                  </td>
                  <td className="px-5 py-3.5 text-[0.78rem] text-nd-grey-600">
                    {new Date(lead.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
