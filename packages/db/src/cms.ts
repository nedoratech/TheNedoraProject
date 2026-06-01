/**
 * @nedora/db/cms
 * Server-side helpers for reading microCMS content from Supabase.
 * All functions use the anon key — CMS content is publicly readable via RLS.
 * Always call from Server Components or Server Actions, never from client components.
 */

import { createServiceClient } from './client'
import type { Database } from './types'

type ContentBlock = Database['public']['Tables']['cms_content_blocks']['Row']

// ── Single block ─────────────────────────────────────────────────────────────

export async function getCmsBlock(
  pageSlug: string,
  key: string,
  locale: string,
  fallback = 'en'
): Promise<string> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_content_blocks')
    .select('value')
    .eq('page_slug', pageSlug)
    .eq('key', key)
    .eq('locale', locale)
    .maybeSingle()

  if (!data?.value && locale !== fallback) {
    return getCmsBlock(pageSlug, key, fallback)
  }

  return data?.value ?? ''
}

// ── All blocks for a page (preferred — one query) ────────────────────────────

export async function getPageBlocks(
  pageSlug: string,
  locale: string,
  fallback = 'en'
): Promise<Record<string, string>> {
  const db = createServiceClient()

  const locales = locale === fallback ? [locale] : [locale, fallback]

  const { data } = await db
    .from('cms_content_blocks')
    .select('key, locale, value')
    .eq('page_slug', pageSlug)
    .in('locale', locales)

  if (!data) return {}

  // Build map — locale-specific value wins over fallback
  const map: Record<string, string> = {}

  // First pass: populate fallback
  data
    .filter((r) => r.locale === fallback)
    .forEach((r) => { map[r.key] = r.value ?? '' })

  // Second pass: overwrite with locale-specific value
  if (locale !== fallback) {
    data
      .filter((r) => r.locale === locale && r.value)
      .forEach((r) => { map[r.key] = r.value! })
  }

  return map
}

// ── Feature flags ────────────────────────────────────────────────────────────

export async function getFeatureFlag(key: string): Promise<boolean> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_feature_flags')
    .select('enabled')
    .eq('key', key)
    .maybeSingle()

  return data?.enabled ?? false
}

export async function getAllFeatureFlags(): Promise<Record<string, boolean>> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_feature_flags')
    .select('key, enabled')

  if (!data) return {}

  return Object.fromEntries(data.map((r) => [r.key, r.enabled]))
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
    .order('order', { ascending: true })

  return data ?? []
}

// ── Active locales (derived from feature flags) ──────────────────────────────

export async function getActiveLocales(): Promise<string[]> {
  const db = createServiceClient()

  const { data } = await db
    .from('cms_feature_flags')
    .select('key, enabled')
    .like('key', 'locale.%.enabled')
    .eq('enabled', true)

  if (!data) return ['en']

  return data
    .map((r) => r.key.replace('locale.', '').replace('.enabled', ''))
    .filter(Boolean)
}
