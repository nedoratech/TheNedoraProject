import { pickCms } from './cmsPick'

type HeroTranslator = {
  (key: 'headline_before' | 'headline_accent' | 'headline_after'): string
}

export interface ResolvedHeroHeadline {
  headlineBefore: string
  headlineAccent: string
  headlineAfter: string
}

/**
 * CMS seed uses `hero.heading` (single line). Static i18n uses split headline parts.
 * Split CMS keys (`hero.headline_*`) override when present.
 */
export function resolveHeroHeadline(
  cms: Record<string, string>,
  t: HeroTranslator,
): ResolvedHeroHeadline {
  const staticBefore = t('headline_before')
  const staticAccent = t('headline_accent')
  const staticAfter = t('headline_after')

  const splitBefore = pickCms(cms, 'hero.headline_before', '')
  const splitAccent = pickCms(cms, 'hero.headline_accent', '')
  const splitAfter = pickCms(cms, 'hero.headline_after', '')

  if (splitBefore || splitAccent || splitAfter) {
    return {
      headlineBefore: splitBefore || staticBefore,
      headlineAccent: splitAccent || staticAccent,
      headlineAfter: splitAfter || staticAfter,
    }
  }

  const legacy = pickCms(cms, 'hero.heading', '')
  if (legacy) {
    return { headlineBefore: legacy, headlineAccent: '', headlineAfter: '' }
  }

  return {
    headlineBefore: staticBefore,
    headlineAccent: staticAccent,
    headlineAfter: staticAfter,
  }
}
