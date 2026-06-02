/**
 * @nedora/db/cms
 * Server-side helpers for reading microCMS content from Supabase.
 */

import { createServiceClient } from './server'
import type { Database } from './types'

// ── Single block ─────────────────────────────────────────────────────────────

export async function getCmsBlock(
  pageSlug: string,
  blockKey: string,
  locale: string,
  fallback = 'en',
): Promise<string> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_content_blocks')
    .select('value')
    .eq('page_slug', pageSlug)
    .eq('block_key', blockKey)
    .eq('locale', locale)
    .maybeSingle()

  if (!data?.value && locale !== fallback) {
    return getCmsBlock(pageSlug, blockKey, fallback)
  }

  return data?.value ?? ''
}

// ── All blocks for a page (preferred — one query) ────────────────────────────

export async function getPageBlocks(
  pageSlug: string,
  locale: string,
  fallback = 'en',
): Promise<Record<string, string>> {
  const db = createServiceClient()

  const locales = locale === fallback ? [locale] : [locale, fallback]

  const { data } = await db
    .from('cms_content_blocks')
    .select('block_key, locale, value')
    .eq('page_slug', pageSlug)
    .in('locale', locales)

  if (!data) return {}

  const map: Record<string, string> = {}

  data
    .filter((r) => r.locale === fallback)
    .forEach((r) => {
      map[r.block_key] = r.value ?? ''
    })

  if (locale !== fallback) {
    data
      .filter((r) => r.locale === locale && r.value)
      .forEach((r) => {
        map[r.block_key] = r.value!
      })
  }

  return map
}

// ── Feature flags ────────────────────────────────────────────────────────────

export async function getFeatureFlag(flagKey: string): Promise<boolean> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_feature_flags')
    .select('enabled')
    .eq('flag_key', flagKey)
    .maybeSingle()

  return data?.enabled ?? false
}

export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  const db = createServiceClient()

  const { data } = await db.from('cms_feature_flags').select('flag_key, enabled')

  if (!data) return {}

  return Object.fromEntries(data.map((r) => [r.flag_key, r.enabled]))
}

// ── Navigation ───────────────────────────────────────────────────────────────

export async function getNavigation(location: string, locale: string) {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_navigation')
    .select('*')
    .eq('location', location)
    .eq('locale', locale)
    .eq('visible', true)
    .order('sort_order', { ascending: true })

  return data ?? []
}

// ── Active locales (derived from feature flags) ──────────────────────────────

export async function getActiveLocales(): Promise<string[]> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_feature_flags')
    .select('flag_key, enabled')
    .like('flag_key', 'locale.%.enabled')
    .eq('enabled', true)

  if (!data) return ['en']

  return data
    .map((r) => r.flag_key.replace('locale.', '').replace('.enabled', ''))
    .filter(Boolean)
}
