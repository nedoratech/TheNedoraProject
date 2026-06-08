'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { useTheme } from './ThemeProvider'

interface Props {
  title: string
  subtitle?: string
  children?: React.ReactNode
}

export default function Topbar({ title, subtitle, children }: Props) {
  const { theme, toggle } = useTheme()

  return (
    <header className="bg-panel border-b b-bdr flex items-center justify-between px-6 h-16 flex-shrink-0">
      <div>
        <h1 className="text-[1.05rem] font-semibold c1 tracking-[-0.01em]">{title}</h1>
        {subtitle && <p className="text-[0.72rem] c3 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {children}
        <button
          onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-full c3 hover:bg-panel2 transition-all duration-150"
          aria-label="Toggle theme"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}
