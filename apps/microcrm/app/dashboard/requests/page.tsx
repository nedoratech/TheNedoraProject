import { createServerClient } from '@nedora/db/client'
import { decryptContactFromJoin, decryptRequestFields } from '@nedora/db/encryption'
import type { Database } from '@nedora/db/types'
import Link from 'next/link'
import Topbar from '../../_components/Topbar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInbox } from '@fortawesome/free-solid-svg-icons'

type RequestRow = Database['public']['Tables']['crm_project_requests']['Row']
type ContactRow = Database['public']['Tables']['crm_contacts']['Row']
type RequestWithContact = RequestRow & {
  crm_contacts: ContactRow | ContactRow[] | null
}

type InquiryType = 'contact' | 'project_request' | 'demo_request'

const TABS: { key: InquiryType | 'all'; label: string; description: string }[] = [
  { key: 'all',             label: 'All',        description: 'All inbound submissions' },
  { key: 'contact',         label: 'Contact',    description: 'General contact messages from the landing page' },
  { key: 'project_request', label: 'Project',    description: 'Project quote requests from the landing page' },
  { key: 'demo_request',    label: 'NedAI Demo', description: 'Demo requests submitted via the NedAI landing page' },
]

async function getRequests(type?: InquiryType | 'all') {
  const supabase = await createServerClient()
  let query = supabase
    .from('crm_project_requests')
    .select(`
      id, subject_id, inquiry_type, source, project_type, engagement_model, timeline,
      first_name_ciphertext, last_name_ciphertext, email_ciphertext, company_ciphertext, message_ciphertext,
      ip_address, created_at,
      crm_contacts ( * )
    `)
    .order('created_at', { ascending: false })

  if (type && type !== 'all') {
    query = query.eq('inquiry_type', type)
  }

  const { data } = await query
  return (data ?? []) as unknown as RequestWithContact[]
}

const projectTypeLabels: Record<string, string> = {
  new_application:           'New app',
  integration_modernisation: 'Integration',
  support_evolution:         'Support',
  not_sure:                  'Not sure',
}
const modelLabels: Record<string, string> = {
  fixed_scope: 'Fixed-scope',
  time_based:  'Time-based',
  not_sure:    'Not sure',
}
const timelineLabels: Record<string, string> = {
  ready_now:    'Ready now',
  '1_3_months': '1–3 months',
  '3_6_months': '3–6 months',
  exploring:    'Exploring',
}
const inquiryLabels: Record<string, string> = {
  contact:         'Contact',
  project_request: 'Project request',
  demo_request:    'NedAI Demo',
}

const inquiryPillStyle: Record<string, { bg: string; text: string; border: string }> = {
  contact:         { bg: '#f4f4f5', text: '#52525b', border: '#d4d4d8' },
  project_request: { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd' },
  demo_request:    { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
}

interface Props {
  searchParams: Promise<{ type?: string }>
}

export default async function RequestsPage({ searchParams }: Props) {
  const { type } = await searchParams
  const activeTab = (TABS.find((t) => t.key === type)?.key ?? 'all') as InquiryType | 'all'
  const activeTabMeta = TABS.find((t) => t.key === activeTab)!

  const requestsRaw = await getRequests(activeTab)
  const requests = await Promise.all(
    requestsRaw.map(async (req) => {
      const contact = await decryptContactFromJoin(req.crm_contacts)
      const fields = await decryptRequestFields(req, contact?.subject_id)
      return { req, fields }
    }),
  )

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar title="Inbox" subtitle={activeTabMeta.description} />

      <div className="p-7">
        {/* Tab bar */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.key === 'all' ? '/dashboard/requests' : `/dashboard/requests?type=${tab.key}`}
              className={
                activeTab === tab.key
                  ? 'text-xs font-medium px-4 py-1.5 rounded-full bg-accent-m text-white shadow-sm transition-all duration-150'
                  : 'text-xs font-medium px-4 py-1.5 rounded-full border b-bdr c2 hover:bg-panel2 transition-all duration-150 bg-panel'
              }
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Request cards */}
        <div className="flex flex-col gap-3">
          {requests.length === 0 ? (
            <div className="bg-panel rounded-2xl shadow-card border b-bdr py-16 text-center text-[0.82rem] c3 flex flex-col items-center">
              <FontAwesomeIcon icon={faInbox} className="w-10 h-10 c3 mb-4 opacity-30" />
              No submissions yet{activeTab !== 'all' ? ` in "${activeTabMeta.label}"` : ''}.
            </div>
          ) : (
            requests.map(({ req, fields }) => {
              const firstName  = fields.firstName ?? ''
              const lastName   = fields.lastName  ?? ''
              const email      = fields.email     ?? ''
              const company    = fields.company
              const message    = fields.message
              const inquiryKey = req.inquiry_type ?? ''
              const pillStyle  = inquiryPillStyle[inquiryKey]

              return (
                <div
                  key={req.id}
                  className="bg-panel rounded-2xl shadow-card border b-bdr p-6 hover:shadow-card-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-[0.95rem] font-bold c1">
                        {firstName} {lastName}
                      </p>
                      <p className="text-[0.78rem] c3 mt-0.5">
                        {email}
                        {company ? ` · ${company}` : ''}
                        {req.ip_address ? ` · ${req.ip_address}` : ''}
                      </p>
                    </div>
                    <time className="text-[0.72rem] c3 shrink-0">
                      {new Date(req.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </time>
                  </div>

                  <div className="flex gap-2 flex-wrap mb-3">
                    {inquiryLabels[inquiryKey] && pillStyle && (
                      <span
                        style={{ background: pillStyle.bg, color: pillStyle.text, borderColor: pillStyle.border }}
                        className="text-[0.6rem] tracking-[0.12em] uppercase font-bold border px-2.5 py-[0.2rem] rounded-full"
                      >
                        {inquiryLabels[inquiryKey]}
                      </span>
                    )}
                    {[
                      projectTypeLabels[req.project_type ?? ''],
                      modelLabels[req.engagement_model ?? ''],
                      timelineLabels[req.timeline ?? ''],
                    ]
                      .filter(Boolean)
                      .map((tag, i) => (
                        <span
                          key={i}
                          className="text-[0.6rem] tracking-[0.12em] uppercase font-bold border b-bdr2 c3 px-2.5 py-[0.2rem] rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>

                  {message && (
                    <p className="text-[0.82rem] c2 leading-[1.65] border-l-2 border-accent-m pl-4">
                      {message}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
