# Nedora Project — Claude Instructions

## Project Overview

**Nedora** is an enterprise software services company (Bucharest, Romania) that sells custom software development to enterprise clients. This repository contains:

- **Landing page** (`/apps/landing`) — Lead generation site for enterprise clients. B&W theme, multi-language (EN/RO), driven by microCMS.
- **microCMS** (`/apps/microcms`) — Headless content + feature flag system driving all public-facing content and i18n.
- **microCRM** (`/apps/microcrm`) — Lead, contact, newsletter, and interaction management for Nedora's internal team.
- **NedAI** (`/apps/nedai`) — Nedora's first product (separate app, shares auth layer).

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, TypeScript) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Styling | Tailwind CSS v4 |
| Fonts | Futura (local, `/public/fonts/`) — fallback: `Century Gothic, Trebuchet MS, ui-sans-serif` |
| Theme | Black & white only (`#0a0a0a` / `#fafafa`) with grey scale |
| Forms | React Hook Form + Zod |
| Email | Resend |
| i18n | next-intl (locale files in `/messages/`) |

## Monorepo Structure

```
TheNedoraProject/
├── apps/
│   ├── landing/          # Public-facing landing page
│   ├── microcms/         # CMS admin + API
│   ├── microcrm/         # CRM admin
│   └── nedai/            # NedAI product
├── packages/
│   ├── db/               # Supabase client, types, migrations
│   ├── ui/               # Shared component library
│   └── config/           # Shared TS, ESLint, Tailwind config
├── supabase/
│   ├── migrations/       # SQL migration files (numbered)
│   └── seed.sql          # Dev seed data
├── mockups/              # HTML mockups (design reference only)
├── CLAUDE.md             # This file
└── package.json          # Turborepo root
```

## Design System

### Colors (strictly B&W)
```css
--black: #0a0a0a;
--white: #fafafa;
--grey-50:  #f7f7f7;
--grey-100: #efefef;
--grey-200: #dedede;
--grey-400: #9a9a9a;
--grey-600: #555555;
```

### Typography
- **Font**: Futura (loaded from `/public/fonts/`)
- Weights: 300 (Light), 400 (Book), 500 (Medium), 700 (Bold)
- All UI text: Futura or fallback stack
- Letter-spacing: generous (`0.08em`–`0.2em`) for labels/uppercase elements

### Conventions
- No rounded corners (border-radius: 0) on buttons and cards — sharp, architectural feel
- Section labels use `0.7rem / letter-spacing: 0.2em / uppercase` style
- CTAs always use `text-transform: uppercase; font-weight: 700; letter-spacing: 0.12em`

## microCMS Architecture

The microCMS is the **single source of truth** for:
- All text content on the landing page (headings, body, CTAs, labels)
- Feature flags (enable/disable sections, products, features)
- i18n translations (EN / RO, extensible to more)
- Navigation links and footer content

### CMS Content Model (Supabase tables)
- `cms_pages` — page-level metadata (slug, title, locale, published)
- `cms_content_blocks` — named content blocks with locale variants (`key`, `locale`, `value`, `type`)
- `cms_feature_flags` — boolean flags keyed by name (`key`, `enabled`, `description`)
- `cms_navigation` — nav items (label, href, order, locale)
- `cms_media` — media assets (stored in Supabase Storage)

### Content Access Pattern
In Next.js pages, always fetch CMS content server-side:
```ts
// Good — server component
const content = await getCmsBlock('hero.heading', locale)

// Never fetch CMS in client components — use server components or RSC
```

## microCRM Architecture

### Data Model (Supabase tables)
- `crm_contacts` — all people (leads, clients, partners)
- `crm_leads` — lead pipeline with status tracking
- `crm_project_requests` — form submissions from landing page
- `crm_interactions` — activity log (calls, emails, notes, status changes)
- `crm_newsletter_subscribers` — newsletter opt-ins with consent tracking
- `crm_newsletter_campaigns` — campaign metadata and stats

### Lead Pipeline Stages
`new` → `qualified` → `proposal` → `negotiation` → `won` / `lost`

### Key Rules
- Every form submission on the landing page creates a `crm_project_request` and a `crm_contact` (upsert on email)
- Every status change on a lead is logged as a `crm_interaction`
- Newsletter consent must be explicit (GDPR) — never auto-subscribe from project requests
- All CRM data is internal-only — RLS policies must prevent public access

## Supabase Conventions

- Always use **Row Level Security (RLS)** on every table
- Migrations live in `/supabase/migrations/` with format `YYYYMMDDHHMMSS_description.sql`
- **Migrations:** applied automatically via Supabase GitHub integration — see `docs/SUPABASE.md`
- **Types:** regenerated locally only (`yarn db:types` or `yarn db:types:remote`) → commit `packages/db/src/types.ts`
- Never use the `service_role` key client-side — only in server-only code (`/server/` or API routes)
- Use `anon` key for public reads (CMS content), `service_role` only for CRM writes from server actions

## i18n (next-intl)

- Supported locales: `en` (default), `ro`
- Message files: `/messages/en.json`, `/messages/ro.json`
- Content served dynamically from microCMS overrides static message files
- If a CMS block has no translation for a locale, fall back to `en`
- Language switcher in nav reads available locales from `cms_feature_flags` (`locale.ro.enabled`, etc.)

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # Server-only

# Resend (email for CRM notifications + newsletter)
RESEND_API_KEY=

# App URLs
NEXT_PUBLIC_LANDING_URL=https://nedora.co
NEXT_PUBLIC_CMS_URL=https://cms.nedora.co
NEXT_PUBLIC_CRM_URL=https://crm.nedora.co
```

## Code Conventions

- **TypeScript strict mode** everywhere — no `any`
- Server Actions for all mutations (forms, CRM updates)
- Never use `useEffect` for data fetching — use React Server Components
- Zod schemas for all form validation and API inputs
- Co-locate component styles with components (Tailwind classes, no separate CSS files)
- All Supabase queries use the typed client from `@nedora/db`

## File Naming
- Components: `PascalCase.tsx`
- Utilities/hooks: `camelCase.ts`
- Pages/layouts: `page.tsx`, `layout.tsx` (Next.js convention)
- Supabase migrations: `YYYYMMDDHHMMSS_snake_case_description.sql`

## Common Commands

```bash
# Install dependencies
pnpm install

# Dev (all apps)
pnpm dev

# Dev (single app)
pnpm dev --filter landing

# Supabase local
supabase start
supabase db reset   # re-run all migrations + seed

# Regenerate DB types
pnpm db:types

# Type check
pnpm typecheck

# Build
pnpm build
```

## Key Architectural Decisions

1. **microCMS as the content layer** — the landing page has zero hardcoded copy. All text, CTAs, section visibility, and language variants come from Supabase via the CMS API. This means non-technical team members can update the site without a deployment.

2. **Single Supabase project** — all apps share one Supabase project with schema isolation via prefixes (`cms_`, `crm_`, `nedai_`). RLS enforces access boundaries.

3. **Landing page is a Next.js app, not a CMS template** — the design is custom-coded; the CMS only controls content, not layout. Layout/design changes require code deploys.

4. **microCRM is internal-only** — no public API. All CRM endpoints are protected by Supabase Auth with role-based access. The landing page contact form writes directly to Supabase via a server action (not through the CRM app).

5. **Futura is a licensed font** — served from `/public/fonts/` as WOFF2. Never load from Google Fonts or CDN.
