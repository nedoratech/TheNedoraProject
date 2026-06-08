import { createServerClient } from '@nedora/db/client'
import type { Database } from '@nedora/db/types'
import Link from 'next/link'
import Topbar from '../_components/Topbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faInbox, faUsers, faEnvelope, type IconDefinition } from '@fortawesome/free-solid-svg-icons'

type LeadStatusRow = Pick<Database['public']['Tables']['crm_leads']['Row'], 'id' | 'status'>

const PIPELINE_STAGES = ['new', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const
type Stage = typeof PIPELINE_STAGES[number]

const stageColors: Record<Stage, { bg: string; text: string; border: string; dot: string }> = {
  new:         { bg: '#f4f4f5', text: '#52525b', border: '#d4d4d8', dot: '#a1a1aa' },
  qualified:   { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', dot: '#3b82f6' },
  proposal:    { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
  negotiation: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc', dot: '#6366f1' },
  won:         { bg: '#dcfce7', text: '#166534', border: '#86efac', dot: '#22c55e' },
  lost:        { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
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

  const statCards: { label: string; value: number; href: string; color: string; icon: IconDefinition }[] = [
    { label: 'Active Leads',      value: stats.totalLeads,       href: '/dashboard/leads',      color: '#3b5bdb', icon: faChartBar },
    { label: 'Project Requests',  value: stats.totalRequests,    href: '/dashboard/requests',   color: '#22c55e', icon: faInbox },
    { label: 'Contacts',          value: stats.totalContacts,    href: '/dashboard/contacts',   color: '#6366f1', icon: faUsers },
    { label: 'Newsletter',        value: stats.totalSubscribers, href: '/dashboard/newsletter', color: '#f59e0b', icon: faEnvelope },
  ]

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Dashboard" subtitle="Overview of your pipeline and activity" />

      <div className="p-7">
        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-panel rounded-2xl shadow-card border b-bdr p-6 hover:shadow-card-md transition-all duration-200 group block"
            >
              <div className="flex items-start justify-between mb-4">
                <p className="text-sm font-medium c2">{card.label}</p>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: card.color + '20', color: card.color }}
                >
                  <FontAwesomeIcon icon={card.icon} className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-bold c1 tracking-tight">{card.value}</div>
            </Link>
          ))}
        </div>

        {/* Pipeline */}
        <div className="bg-panel rounded-2xl shadow-card border b-bdr overflow-hidden">
          <div className="px-6 py-4 border-b b-bdr">
            <h2 className="text-sm font-semibold c1">Pipeline</h2>
            <p className="text-xs c3 mt-0.5">Leads by stage</p>
          </div>
          <div className="grid grid-cols-6 divide-x divide-[var(--border)]">
            {PIPELINE_STAGES.map((stage) => {
              const c = stageColors[stage]
              return (
                <Link
                  key={stage}
                  href={`/dashboard/leads?status=${stage}`}
                  className="flex flex-col items-center py-6 gap-2.5 hover:bg-panel2 transition-colors duration-150"
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.dot }} />
                  <span className="text-2xl font-bold c1">{stats.leadsByStage[stage]}</span>
                  <span className="text-[0.65rem] font-medium c3 capitalize">{stage}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
