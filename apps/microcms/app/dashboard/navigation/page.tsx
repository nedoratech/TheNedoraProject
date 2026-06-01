import { createServerClient } from '@nedora/db/client'

async function getNavItems() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('cms_navigation')
    .select('*')
    .order('order_index')
  return data ?? []
}

export default async function NavigationPage() {
  const items = await getNavItems()

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Site structure</p>
        <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Navigation</h1>
        <p className="text-[0.85rem] text-nd-grey-400 mt-1">Manage navigation items for the landing page header and footer.</p>
      </div>

      {['main', 'footer_col1', 'footer_col2', 'footer_col3'].map((location) => {
        const locationItems = items.filter((i) => i.location === location)
        const locationLabel = location === 'main' ? 'Main navigation' : `Footer — ${location.replace('footer_', '')}`
        return (
          <div key={location} className="mb-8">
            <h2 className="text-[0.72rem] tracking-[0.16em] uppercase font-bold text-nd-grey-400 mb-3">{locationLabel}</h2>
            <div className="border border-white/[0.08] divide-y divide-white/[0.06]">
              {locationItems.length === 0 ? (
                <div className="px-5 py-4 text-[0.78rem] text-nd-grey-600">No items</div>
              ) : (
                locationItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02]">
                    <div className="flex items-center gap-4">
                      <span className="text-nd-grey-600 cursor-grab text-sm">⠿</span>
                      <div>
                        <span className="text-[0.85rem] text-nd-white">{item.label}</span>
                        <span className="text-[0.75rem] text-nd-grey-600 ml-3 font-mono">{item.href}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.62rem] tracking-[0.1em] uppercase border border-white/10 text-nd-grey-600 px-1.5 py-0.5">{item.locale}</span>
                      <button className="text-[0.65rem] tracking-[0.1em] uppercase font-bold text-nd-accent-mid hover:text-nd-accent-bright transition-colors">Edit</button>
                    </div>
                  </div>
                ))
              )}
              <div className="px-5 py-3">
                <button className="text-[0.68rem] tracking-[0.1em] uppercase font-bold text-nd-grey-600 hover:text-nd-white transition-colors">
                  + Add item
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
