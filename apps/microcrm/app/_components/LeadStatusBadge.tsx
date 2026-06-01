const styles = {
  new:         'bg-nd-grey-600/20 text-nd-grey-400 border-nd-grey-600/30',
  qualified:   'bg-nd-accent/20 text-nd-accent-bright border-nd-accent-mid/40',
  proposal:    'bg-amber-900/30 text-amber-400 border-amber-700/40',
  negotiation: 'bg-indigo-900/30 text-indigo-300 border-indigo-600/40',
  won:         'bg-green-900/30 text-green-400 border-green-700/40',
  lost:        'bg-red-900/30 text-red-400 border-red-800/40',
} as const

type Status = keyof typeof styles

export default function LeadStatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-block text-[0.6rem] tracking-[0.12em] uppercase font-bold border px-2 py-0.5 ${styles[status] ?? styles.new}`}>
      {status}
    </span>
  )
}
