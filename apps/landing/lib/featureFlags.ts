/** Explicit `"true"` only — unset or any other value is disabled. */
export function envFlag(name: string): boolean {
  return process.env[name] === 'true'
}

/** Show the Solutions nav dropdown, mobile section, and footer products column. */
export function isNavSolutionsEnabled(): boolean {
  return envFlag('NEXT_PUBLIC_NAV_SOLUTIONS_ENABLED')
}

export function getNedaiProductUrl(): string {
  const url = process.env.NEXT_PUBLIC_NEDAI_URL?.trim()
  return url && url.length > 0 ? url : '#'
}

export function isExternalNavUrl(href: string): boolean {
  return href.startsWith('http://') || href.startsWith('https://')
}
