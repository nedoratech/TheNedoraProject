'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { NavProductItem, NavProductsMenu as NavProductsMenuData } from '@/lib/landingShell'

const DESKTOP_PANEL_WIDTH = 'w-[min(920px,calc(100vw-2.5rem))]'

interface NavProductsMenuProps extends NavProductsMenuData {
  variant: 'desktop' | 'mobile'
  onNavigate?: () => void
}

function productRowStyle(theme: NavProductItem['theme']): CSSProperties {
  return {
    '--product-accent': theme.accent,
    '--product-accent-soft': theme.accentSoft,
    '--product-name': theme.name,
  } as CSSProperties
}

function ProductLink({
  item,
  className,
  style,
  children,
  onNavigate,
  onMouseEnter,
  onFocus,
}: {
  item: NavProductItem
  className: string
  style?: CSSProperties
  children: ReactNode
  onNavigate?: () => void
  onMouseEnter?: () => void
  onFocus?: () => void
}) {
  const linkProps = { className, style, onClick: onNavigate, onMouseEnter, onFocus }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" {...linkProps}>
        {children}
      </a>
    )
  }

  return (
    <a href={item.href} {...linkProps}>
      {children}
    </a>
  )
}

function DesktopSolutionsPanel({
  items,
  productsColumnLabel,
  onNavigate,
}: {
  items: NavProductItem[]
  productsColumnLabel: string
  onNavigate?: () => void
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeItem = items[activeIndex] ?? items[0]

  if (!activeItem) return null

  return (
    <div
      className={`${DESKTOP_PANEL_WIDTH} shrink-0 min-h-[320px] flex bg-nd-white border border-nd-grey-200 normal-case tracking-normal font-normal shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden`}
    >
      {/* Left — product showcase */}
      <div className="w-[42%] shrink-0 bg-nd-white border-r border-nd-grey-100 p-8 flex flex-col">
        <span className="text-[0.62rem] tracking-[0.2em] uppercase font-bold text-nd-grey-400 mb-6">
          {productsColumnLabel}
        </span>
        <div className="flex flex-col gap-1">
          {items.map((item, index) => (
              <ProductLink
                key={item.href}
                item={item}
                onNavigate={onNavigate}
                className="group/item flex w-full items-center gap-4 px-4 py-4 transition-colors duration-200 hover:bg-[var(--product-accent-soft)]"
                style={productRowStyle(item.theme)}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
              >
                <div className="shrink-0 w-[52px] h-[52px] bg-nd-grey-50 border border-nd-grey-100 flex items-center justify-center p-2">
                  <Image
                    src={item.logoSrc}
                    alt=""
                    width={44}
                    height={44}
                    className="h-8 w-auto max-w-[44px]"
                    aria-hidden
                  />
                </div>
                <span className="flex-1 text-left text-[0.88rem] font-bold normal-case tracking-[-0.01em] text-nd-black group-hover/item:text-[var(--product-accent)] transition-colors duration-200">
                  {item.label}
                </span>
                <span
                  className="shrink-0 text-[0.95rem] text-nd-grey-400 group-hover/item:text-[var(--product-accent)] transition-colors duration-200"
                  aria-hidden
                >
                  ↗
                </span>
              </ProductLink>
          ))}
        </div>
      </div>

      {/* Right — description for hovered product */}
      <div
        className="flex-1 bg-nd-grey-50 p-8 flex flex-col justify-center min-w-0 transition-colors duration-200"
        style={productRowStyle(activeItem.theme)}
      >
        <span className="text-[0.62rem] tracking-[0.2em] uppercase font-bold text-[var(--product-accent)] mb-4">
          {activeItem.label}
        </span>
        <p className="text-[0.9rem] text-nd-grey-600 leading-[1.55] max-w-[420px]">
          {activeItem.description}
        </p>
        <ProductLink
          item={activeItem}
          onNavigate={onNavigate}
          className="mt-6 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.14em] uppercase font-bold text-[var(--product-accent)] hover:text-[var(--product-name)] transition-colors duration-200 w-fit"
        >
          {activeItem.label}
          <span aria-hidden>↗</span>
        </ProductLink>
      </div>
    </div>
  )
}

function MobileSolutionsSection({
  label,
  items,
  onNavigate,
}: {
  label: string
  items: NavProductItem[]
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col gap-2 normal-case tracking-normal font-normal">
      <span className="text-[0.72rem] tracking-[0.12em] uppercase font-bold text-white/70">
        {label}
      </span>
      {items.map((item) => (
        <ProductLink
          key={item.href}
          item={item}
          onNavigate={onNavigate}
          className="group/mobile flex items-start justify-between gap-4 py-1 transition-colors duration-200"
          style={productRowStyle(item.theme)}
        >
          <div className="min-w-0">
            <span className="block text-[0.72rem] tracking-[0.08em] uppercase font-bold text-white/70 group-hover/mobile:text-[var(--product-accent)] transition-colors duration-200">
              {item.label}
            </span>
            <p className="text-[0.68rem] normal-case tracking-normal font-normal text-white/40 leading-[1.4] mt-1">
              {item.mobileDescription}
            </p>
          </div>
          <span
            className="shrink-0 text-[0.9rem] text-white/35 group-hover/mobile:text-[var(--product-accent)] transition-colors duration-200 pt-0.5"
            aria-hidden
          >
            ↗
          </span>
        </ProductLink>
      ))}
    </div>
  )
}

export default function NavProductsMenu({
  label,
  productsColumnLabel,
  items,
  variant,
  onNavigate,
}: NavProductsMenuProps) {
  if (variant === 'desktop') {
    return (
      <li className="relative group">
        <span className="text-white/50 group-hover:text-nd-white transition-colors duration-200 cursor-pointer">
          {label}
        </span>
        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 z-[110] invisible opacity-0 pointer-events-none group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:visible group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-opacity duration-200">
          <DesktopSolutionsPanel
            items={items}
            productsColumnLabel={productsColumnLabel}
            onNavigate={onNavigate}
          />
        </div>
      </li>
    )
  }

  return (
    <MobileSolutionsSection label={label} items={items} onNavigate={onNavigate} />
  )
}
