const styles = {
  new:         { bg: '#f4f4f5', text: '#52525b', border: '#d4d4d8', dot: '#a1a1aa' },
  qualified:   { bg: '#dbeafe', text: '#1e40af', border: '#93c5fd', dot: '#3b82f6' },
  proposal:    { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', dot: '#f59e0b' },
  negotiation: { bg: '#e0e7ff', text: '#3730a3', border: '#a5b4fc', dot: '#6366f1' },
  won:         { bg: '#dcfce7', text: '#166534', border: '#86efac', dot: '#22c55e' },
  lost:        { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5', dot: '#ef4444' },
} as const

type Status = keyof typeof styles

export default function LeadStatusBadge({ status }: { status: Status }) {
  const s = styles[status] ?? styles.new
  return (
    <span
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
      className="inline-flex items-center gap-1.5 text-[0.65rem] font-semibold border px-2.5 py-1 rounded-full"
    >
      <span
        style={{ background: s.dot }}
        className="w-[5px] h-[5px] rounded-full flex-shrink-0"
      />
      {status}
    </span>
  )
}
