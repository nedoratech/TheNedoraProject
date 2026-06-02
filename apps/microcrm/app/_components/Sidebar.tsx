'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@nedora/db/browser'
import { useRouter } from 'next/navigation'

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: '⬡' },
  { label: 'Leads', href: '/dashboard/leads', icon: '◈' },
  { label: 'Project requests', href: '/dashboard/requests', icon: '◻' },
  { label: 'Contacts', href: '/dashboard/contacts', icon: '⬕' },
  { label: 'Newsletter', href: '/dashboard/newsletter', icon: '≡' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <aside className="w-56 shrink-0 bg-nd-black border-r border-white/[0.06] flex flex-col min-h-screen">
      <div className="flex items-center gap-2 text-[0.78rem] font-bold tracking-[0.18em] uppercase text-nd-white px-6 py-5 border-b border-white/[0.06]">
        <span className="w-1.5 h-1.5 bg-nd-accent-bright rounded-full" />
        NEDORA <span className="text-nd-grey-600 font-normal text-[0.65rem] tracking-[0.12em]">CRM</span>
      </div>

      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-[0.78rem] tracking-[0.08em] font-medium transition-colors duration-150 ${
                active ? 'bg-nd-accent/20 text-nd-accent-bright' : 'text-nd-grey-400 hover:text-nd-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-[0.85rem] w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[0.78rem] tracking-[0.08em] font-medium text-nd-grey-600 hover:text-red-400 transition-colors duration-150"
        >
          <span className="text-[0.85rem] w-4 text-center">↩</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
