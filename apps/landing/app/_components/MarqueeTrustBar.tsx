'use client'

const ITEMS = [
  'Enterprise ERP Systems', 'Custom Integrations', 'Cloud Migrations',
  'Process Automation', 'Data Platforms', 'API Architecture',
  'Legacy Modernisation', 'Team Augmentation', 'Technical Advisory',
  // duplicated for seamless loop
  'Enterprise ERP Systems', 'Custom Integrations', 'Cloud Migrations',
  'Process Automation', 'Data Platforms', 'API Architecture',
  'Legacy Modernisation', 'Team Augmentation', 'Technical Advisory',
]

export default function MarqueeTrustBar() {
  return (
    <div className="bg-nd-white border-t border-nd-grey-100 border-b overflow-hidden py-[0.9rem]">
      <div
        className="flex w-max"
        style={{ animation: 'marquee 28s linear infinite' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.animationPlayState = 'running')}
      >
        {ITEMS.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-14 text-[0.68rem] tracking-[0.16em] uppercase font-bold text-nd-grey-400 whitespace-nowrap shrink-0">
            {item}
            <span className="w-[3px] h-[3px] bg-nd-grey-200 rounded-full" />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
    </div>
  )
}
