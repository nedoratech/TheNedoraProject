import { pickCms } from './cmsPick'
import type { HeroHeadlinePart } from '../app/_components/Hero'

type HeroTranslator = {
  raw: (key: 'headline_parts') => HeroHeadlinePart[]
}

export interface ResolvedHeroHeadline {
  headlineParts: HeroHeadlinePart[]
}

/**
 * CMS may override static i18n headline parts later.
 * Legacy `hero.heading` is returned as a single non-underlined part.
 */
export function resolveHeroHeadline(
  cms: Record<string, string>,
  t: HeroTranslator,
): ResolvedHeroHeadline {
  const staticParts = t.raw('headline_parts')

  const cmsPartsRaw = pickCms(cms, 'hero.headline_parts', '')
  if (cmsPartsRaw) {
    try {
      const parsed = JSON.parse(cmsPartsRaw) as HeroHeadlinePart[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return { headlineParts: parsed }
      }
    } catch {
      // fall through
    }
  }

  const legacy = pickCms(cms, 'hero.heading', '')
  if (legacy) {
    return { headlineParts: [{ text: legacy }] }
  }

  return { headlineParts: staticParts }
}
