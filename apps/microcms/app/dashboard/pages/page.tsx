import { createServerClient } from '@nedora/db/client'
import Link from 'next/link'

async function getPages() {
  const supabase = await createServerClient()
  const { data } = await supabase
    .from('cms_pages')
    .select('id, slug, title, locale, published, updated_at')
    .order('updated_at', { ascending: false })
  return data ?? []
}

export default async function PagesPage() {
  const pages = await getPages()

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase font-bold text-nd-accent-bright mb-1">Content</p>
          <h1 className="text-[1.8rem] font-bold tracking-[-0.025em] text-nd-white">Pages</h1>
        </div>
        <button className="text-[0.72rem] tracking-[0.12em] uppercase font-bold px-5 py-2.5 bg-nd-accent-mid text-nd-white hover:bg-nd-accent-bright transition-colors duration-200">
          + New page
        </button>
      </div>

      <div className="border border-white/[0.08]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {['Slug', 'Title', 'Locale', 'Status', 'Updated', ''].map((h) => (
                <th key={h} className="px-5 py-3 text-[0.6rem] tracking-[0.18em] uppercase font-bold text-nd-grey-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-[0.82rem] text-nd-grey-600">
                  No pages yet. Run migrations and seed to populate.
                </td>
              </tr>
            ) : pages.map((page) => (
              <tr key={page.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-[0.82rem] font-mono text-nd-accent-bright">{page.slug}</td>
                <td className="px-5 py-3.5 text-[0.82rem] text-nd-white">{page.title}</td>
                <td className="px-5 py-3.5">
                  <span className="text-[0.62rem] tracking-[0.12em] uppercase font-bold border border-white/20 text-nd-grey-400 px-2 py-0.5">{page.locale}</span>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[0.62rem] tracking-[0.12em] uppercase font-bold px-2 py-0.5 ${page.published ? 'bg-green-900/40 text-green-400' : 'bg-nd-grey-600/20 text-nd-grey-400'}`}>
                    {page.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-[0.78rem] text-nd-grey-600">
                  {new Date(page.updated_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  <Link href={`/dashboard/pages/${page.id}`} className="text-[0.68rem] tracking-[0.1em] uppercase font-bold text-nd-accent-mid hover:text-nd-accent-bright transition-colors">
                    Edit →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
