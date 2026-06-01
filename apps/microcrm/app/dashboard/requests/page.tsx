import { createServerClient } from '@nedora/db/client'

async function getRequests() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('crm_project_requests')
    .select(`
      id, project_type, engagement_model, timeline, message, created_at,
      crm_contacts ( first_name, last_name, email, company )
    `)
    .order('created_at', { ascending: false })
  return data ?? []
}

const typeLabels: Record<string, string> = {
  new_application: 'New app',
  integration_modernisation: 'Integration',
  support_evolution: 'Support',
  not_sure: 'Not sure',
}
const modelLabels: Record<string, string> = {
  fixed_scope: 'Fixed-scope',
  time_based: 'Time-based',
  not_sure: 'Not sure',
}
const timelineLabels: Record<string, string> = {
  ready_now: 'Ready now',
  '1_3_months': '1–3 months',
  '3_6_months': '3–6 months',
  exploring: 'Exploring',
}

export default async function RequestsPage() {
  const requests = await getRequests()

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Inbound</p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Project requests</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mt-1">Submitted via the landing page contact form.</p>
      </div>

      <div className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <div className="border border-white/[0.06] py-16 text-center text-[0.82rem] text-nd-grey-600">
            No requests yet. Submissions from the landing page contact form will appear here.
          </div>
        ) : requests.map((req) => {
          const contact = Array.isArray(req.crm_contacts) ? req.crm_contacts[0] : req.crm_contacts
          return (
            <div key={req.id} className="border border-white/[0.08] bg-white/[0.02] p-6 hover:border-nd-accent-mid/40 transition-colors">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[0.95rem] font-bold text-nd-white">{contact?.first_name} {contact?.last_name}</p>
                  <p className="text-[0.78rem] text-nd-grey-600">{contact?.email} · {contact?.company}</p>
                </div>
                <time className="text-[0.72rem] text-nd-grey-600 shrink-0">
                  {new Date(req.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </time>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                {[typeLabels[req.project_type], modelLabels[req.engagement_model], timelineLabels[req.timeline]].map((tag, i) => (
                  <span key={i} className="text-[0.6rem] tracking-[0.12em] uppercase font-bold border border-white/10 text-nd-grey-400 px-2 py-0.5">{tag}</span>
                ))}
              </div>

              {req.message && (
                <p className="text-[0.82rem] text-nd-grey-400 leading-[1.65] border-l-2 border-nd-accent-mid/40 pl-4">
                  {req.message}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
