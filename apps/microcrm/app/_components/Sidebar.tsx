'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createBrowserClient } from '@nedora/db/browser'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHouse,
  faChartBar,
  faInbox,
  faUsers,
  faEnvelope,
  faGear,
  faSun,
  faMoon,
  faRightFromBracket,
  type IconDefinition,
} from '@fortawesome/free-solid-svg-icons'
import NedoraLogo from './NedoraLogo'
import { useTheme } from './ThemeProvider'

// ── Nav config ─────────────────────────────────────────────────────────────
const nav: { label: string; href: string; icon: IconDefinition }[] = [
  { label: 'Dashboard',  href: '/dashboard',           icon: faHouse },
  { label: 'Leads',      href: '/dashboard/leads',      icon: faChartBar },
  { label: 'Inbox',      href: '/dashboard/requests',   icon: faInbox },
  { label: 'Contacts',   href: '/dashboard/contacts',   icon: faUsers },
  { label: 'Newsletter', href: '/dashboard/newsletter', icon: faEnvelope },
]

// ── Component ──────────────────────────────────────────────────────────────
export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggle } = useTheme()

  async function handleSignOut() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  function isActive(href: string) {
    return href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)
  }

  function navItemClass(active: boolean) {
    return [
      'flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150 w-full',
      active
        ? 'bg-[#eff6ff] text-[#1d4ed8]'
        : 'c2 hover:bg-panel2 hover:c1',
    ].join(' ')
  }

  return (
    <aside className="w-64 shrink-0 bg-panel flex flex-col h-screen border-r b-bdr shadow-card z-10">

      {/* ── Logo ─────────────────────────────────────────────────── */}
      <div className="h-16 flex items-center gap-3 px-5 border-b b-bdr flex-shrink-0">
        <NedoraLogo className="h-[14px] c1" />
        <span className="text-[0.55rem] font-bold tracking-widest uppercase bg-[#eff6ff] text-[#2563eb] px-2 py-0.5 rounded-full">
          CRM
        </span>
      </div>

      {/* ── Main nav ──────────────────────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 flex flex-col gap-0.5">
        <p className="text-[0.6rem] font-semibold c3 uppercase tracking-widest px-4 py-2">
          Menu
        </p>
        {nav.map((item) => {
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} className={navItemClass(active)}>
              <FontAwesomeIcon
                icon={item.icon}
                className={['w-4 h-4 flex-shrink-0', active ? 'text-[#2563eb]' : 'opacity-60'].join(' ')}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom section ────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-t b-bdr">

        <div className="px-3 py-3 flex flex-col gap-0.5">
          {/* Settings */}
          {(() => {
            const active = isActive('/dashboard/settings')
            return (
              <Link href="/dashboard/settings" className={navItemClass(active)}>
                <FontAwesomeIcon
                  icon={faGear}
                  className={['w-4 h-4 flex-shrink-0', active ? 'text-[#2563eb]' : 'opacity-60'].join(' ')}
                />
                Settings
              </Link>
            )
          })()}

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium c2 hover:bg-panel2 hover:c1 transition-all duration-150 w-full text-left"
          >
            <FontAwesomeIcon
              icon={theme === 'dark' ? faSun : faMoon}
              className="w-4 h-4 flex-shrink-0 opacity-60"
            />
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 rounded-full text-sm font-medium c3 hover:bg-red-50 hover:text-red-500 transition-all duration-150 w-full text-left"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4 flex-shrink-0 opacity-60" />
            Sign out
          </button>
        </div>

        {/* User row */}
        <div className="px-4 py-3.5 border-t b-bdr flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#dbeafe] flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-[#1d4ed8]">N</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold c1 truncate">Nedora Team</p>
            <p className="text-xs c3 truncate">Admin</p>
          </div>
        </div>

      </div>
    </aside>
  )
}
