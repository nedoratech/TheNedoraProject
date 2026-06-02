/** True when a CMS value is empty or looks like an unpublished block key placeholder. */
export function isCmsPlaceholder(value: string, blockKey: string): boolean {
  const v = value.trim()
  if (!v) return true
  if (v === blockKey) return true
  // e.g. "hero.heading" stored as placeholder instead of real copy
  if (/^[a-z][\w]*\.[\w.]+$/.test(v) && !v.includes(' ')) return true
  return false
}

/** Prefer static copy when CMS value is missing or a placeholder. */
export function pickCms(cms: Record<string, string>, blockKey: string, fallback: string): string {
  const raw = cms[blockKey]
  if (raw == null || isCmsPlaceholder(raw, blockKey)) return fallback
  return raw.trim()
}
