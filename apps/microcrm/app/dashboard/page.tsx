import { createServerClient } from '@nedora/db/client'
import type { Database } from '@nedora/db/types'
import Link from 'next/link'

type LeadStatusRow = Pick<Database['public']['Tables']['crm_leads']['Row'], 'id' | 'status'>

const PIPELINE_STAGES = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const
type Stage = typeof PIPELINE_STAGES[number]

const stageStyle: Record<Stage, string> = {
  new:         'border-nd-grey-600 text-nd-grey-400',
  qualified:   'border-nd-accent-mid text-nd-accent-bright',
  proposal:    'border-amber-600 text-amber-400',
  negotiation: 'border-indigo-400 text-indigo-300',
  won:         'border-green-600 text-green-400',
  lost:        'border-red-800 text-red-400',
}

async function getStats() {
  try {
    const supabase = await createServerClient()
    const [leads, requests, contacts, subscribers] = await Promise.all([
      supabase.from('crm_leads').select('id, status'),
      supabase.from('crm_project_requests').select('id', { count: 'exact', head: true }),
      supabase.from('crm_contacts').select('id', { count: 'exact', head: true }),
      supabase.from('crm_newsletter_subscribers').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    ])
    const leadRows = (leads.data ?? []) as LeadStatusRow[]
    const leadsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
      acc[stage] = leadRows.filter((l) => l.status === stage).length
      return acc
    }, {} as Record<Stage, number>)

    return {
      totalLeads: leadRows.length,
      leadsByStage,
      totalRequests: requests.count ?? 0,
      totalContacts: contacts.count ?? 0,
      totalSubscribers: subscribers.count ?? 0,
    }
  } catch {
    return {
      totalLeads: 0,
      leadsByStage: Object.fromEntries(PIPELINE_STAGES.map((s) => [s, 0])) as Record<Stage, number>,
      totalRequests: 0,
      totalContacts: 0,
      totalSubscribers: 0,
    }
  }
}

export default async function CrmDashboardPage() {
  const stats = await getStats()

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Overview</p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">microCRM</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mt-1">Lead pipeline, project requests, contacts, and newsletter.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active leads', value: stats.totalLeads, href: '/dashboard/leads' },
          { label: 'Project requests', value: stats.totalRequests, href: '/dashboard/requests' },
          { label: 'Contacts', value: stats.totalContacts, href: '/dashboard/contacts' },
          { label: 'Newsletter', value: stats.totalSubscribers, href: '/dashboard/newsletter' },
        ].map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="block border border-white/[0.08] bg-white/[0.02] p-5 hover:border-nd-accent-mid hover:bg-nd-accent/5 transition-all duration-200"
          >
            <div className="text-[2rem] font-bold tracking-[-0.04em] text-nd-white mb-1">{card.value}</div>
            <div className="text-[0.75rem] text-nd-grey-400">{card.label}</div>
          </Link>
        ))}
      </div>

      {/* Pipeline stages */}
      <div>
        <h2 className="text-[0.72rem] tracking-[0.16em] uppercase font-bold text-nd-grey-400 mb-4">Pipeline</h2>
        <div className="grid grid-cols-6 gap-2">
          {PIPELINE_STAGES.map((stage) => (
            <Link
              key={stage}
              href={`/dashboard/leads?status=${stage}`}
              className={`border p-4 text-center hover:bg-white/[0.04] transition-colors duration-150 ${stageStyle[stage]}`}
            >
              <div className="text-[1.5rem] font-bold tracking-[-0.04em]">{stats.leadsByStage[stage]}</div>
              <div className="text-[0.6rem] tracking-[0.14em] uppercase font-bold mt-1 capitalize">{stage}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
