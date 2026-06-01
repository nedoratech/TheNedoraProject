import { createServerClient } from '@nedora/db/client'

async function getStats() {
  try {
    const supabase = await createServerClient()
    const [pages, flags, blocks] = await Promise.all([
      supabase.from('cms_pages').select('id', { count: 'exact', head: true }),
      supabase.from('cms_feature_flags').select('id', { count: 'exact', head: true }),
      supabase.from('cms_content_blocks').select('id', { count: 'exact', head: true }),
    ])
    return {
      pages: pages.count ?? 0,
      flags: flags.count ?? 0,
      blocks: blocks.count ?? 0,
    }
  } catch {
    return { pages: 0, flags: 0, blocks: 0 }
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  const cards = [
    { label: 'Pages', value: stats.pages, href: '/dashboard/pages', desc: 'Published & draft pages' },
    { label: 'Content blocks', value: stats.blocks, href: '/dashboard/pages', desc: 'Across all pages & locales' },
    { label: 'Feature flags', value: stats.flags, href: '/dashboard/flags', desc: 'Active configuration keys' },
  ]

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Overview</p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">microCMS</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mt-1">Manage content, feature flags, navigation, and media.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            className="block border border-white/[0.08] bg-white/[0.02] p-6 hover:border-nd-accent-mid hover:bg-nd-accent/5 transition-all duration-200"
          >
            <div className="text-[2rem] font-bold tracking-[-0.04em] text-nd-white mb-1">{card.value}</div>
            <div className="text-[0.8rem] font-bold text-nd-white/80 mb-0.5">{card.label}</div>
            <div className="text-[0.72rem] text-nd-grey-600">{card.desc}</div>
          </a>
        ))}
      </div>

      <div className="border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-[0.75rem] tracking-[0.16em] uppercase font-bold text-nd-grey-400 mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: 'Edit home page', href: '/dashboard/pages' },
            { label: 'Toggle feature flags', href: '/dashboard/flags' },
            { label: 'Manage navigation', href: '/dashboard/navigation' },
            { label: 'Upload media', href: '/dashboard/media' },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="text-[0.72rem] tracking-[0.1em] uppercase font-bold px-4 py-2 border border-white/[0.1] text-nd-grey-400 hover:border-nd-accent-mid hover:text-nd-accent-bright transition-all duration-200"
            >
              {action.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
