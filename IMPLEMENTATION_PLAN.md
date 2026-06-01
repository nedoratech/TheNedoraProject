# Nedora Project — Implementation Plan

> Build order: foundation first, then content layer, then UI, then comms.

---

## Phase 0 — Repo & Tooling Setup

**Goal:** One command gets any dev running locally.

### Steps

1. **Init monorepo**
   ```bash
   mkdir TheNedoraProject && cd TheNedoraProject
   pnpm init
   pnpm add -D turbo
   ```
   Create `turbo.json` with pipelines for `dev`, `build`, `typecheck`.

2. **Shared packages scaffold**
   ```
   packages/
     db/         # Supabase client + generated types
     ui/         # Shared components (Button, Input, etc.)
     config/     # tsconfig.base.json, eslint.config.js, tailwind preset
   ```

3. **Create Next.js apps**
   ```bash
   pnpm create next-app apps/landing --typescript --tailwind --app --no-src-dir
   pnpm create next-app apps/microcms --typescript --tailwind --app --no-src-dir
   pnpm create next-app apps/microcrm --typescript --tailwind --app --no-src-dir
   ```

4. **Install core dependencies (per app)**
   ```bash
   pnpm add @supabase/supabase-js @supabase/ssr next-intl react-hook-form zod resend
   ```

5. **Init Supabase**
   ```bash
   supabase init
   supabase start   # starts local Postgres + Studio
   ```

6. **Add Futura fonts**
   - Place WOFF2 files in `apps/landing/public/fonts/`
   - Define `@font-face` in `apps/landing/app/globals.css`

7. **Configure Tailwind** with shared B&W design tokens (extend in `packages/config/tailwind.preset.js`)

---

## Phase 1 — Supabase Migrations

Run in order. Each migration is one concern.

### Migration 001 — Core schema setup
```sql
-- supabase/migrations/20260601000001_init_schema.sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Shared: profiles (linked to auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can read own profile"
  on profiles for select using (auth.uid() = id);
```

### Migration 002 — microCMS tables
```sql
-- supabase/migrations/20260601000002_microcms.sql

create table public.cms_pages (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null,
  locale      text not null default 'en',
  title       text,
  published   boolean default false,
  meta_title  text,
  meta_desc   text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique(slug, locale)
);

create table public.cms_content_blocks (
  id         uuid primary key default uuid_generate_v4(),
  page_slug  text not null,            -- e.g. 'landing', 'privacy'
  key        text not null,            -- e.g. 'hero.heading'
  locale     text not null default 'en',
  value      text,
  type       text default 'text' check (type in ('text', 'html', 'markdown', 'image_url', 'json')),
  updated_at timestamptz default now(),
  unique(page_slug, key, locale)
);

create table public.cms_feature_flags (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,    -- e.g. 'locale.ro.enabled', 'section.nedai.visible'
  enabled     boolean default false,
  description text,
  updated_at  timestamptz default now()
);

create table public.cms_navigation (
  id       uuid primary key default uuid_generate_v4(),
  location text not null,             -- 'main', 'footer_company', 'footer_connect', 'footer_products'
  label    text not null,
  href     text not null,
  locale   text not null default 'en',
  order    integer default 0,
  visible  boolean default true
);

create table public.cms_media (
  id          uuid primary key default uuid_generate_v4(),
  key         text unique not null,   -- e.g. 'hero.image'
  storage_path text not null,
  alt_text    text,
  uploaded_at timestamptz default now()
);

-- RLS: CMS content is publicly readable
alter table public.cms_pages enable row level security;
alter table public.cms_content_blocks enable row level security;
alter table public.cms_feature_flags enable row level security;
alter table public.cms_navigation enable row level security;
alter table public.cms_media enable row level security;

create policy "CMS blocks are publicly readable"
  on cms_content_blocks for select using (true);
create policy "CMS flags are publicly readable"
  on cms_feature_flags for select using (true);
create policy "CMS pages are publicly readable"
  on cms_pages for select using (published = true);
create policy "CMS nav is publicly readable"
  on cms_navigation for select using (visible = true);
create policy "CMS media is publicly readable"
  on cms_media for select using (true);

-- Only authenticated admins can write
create policy "Admins can manage CMS"
  on cms_content_blocks for all using (auth.role() = 'authenticated');
-- (repeat for other CMS tables)
```

### Migration 003 — microCRM tables
```sql
-- supabase/migrations/20260601000003_microcrm.sql

create table public.crm_contacts (
  id          uuid primary key default uuid_generate_v4(),
  email       text unique not null,
  first_name  text,
  last_name   text,
  company     text,
  role        text,
  phone       text,
  source      text,                   -- 'website_form', 'linkedin', 'referral', 'conference'
  tags        text[] default '{}',
  notes       text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create type lead_status as enum ('new', 'qualified', 'proposal', 'negotiation', 'won', 'lost');
create type project_type as enum ('new_application', 'integration', 'support_evolution', 'not_sure');
create type engagement_model as enum ('fixed_scope', 'time_based', 'not_sure');
create type timeline_option as enum ('ready_now', '1_3_months', '3_6_months', 'exploring');

create table public.crm_leads (
  id              uuid primary key default uuid_generate_v4(),
  contact_id      uuid not null references crm_contacts(id),
  status          lead_status not null default 'new',
  priority        text check (priority in ('high', 'medium', 'low')) default 'medium',
  project_type    project_type,
  engagement_model engagement_model,
  timeline        timeline_option,
  estimated_value numeric,
  currency        text default 'EUR',
  assigned_to     uuid references profiles(id),
  closed_at       timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create table public.crm_project_requests (
  id               uuid primary key default uuid_generate_v4(),
  contact_id       uuid references crm_contacts(id),
  lead_id          uuid references crm_leads(id),
  first_name       text not null,
  last_name        text not null,
  email            text not null,
  company          text,
  project_type     project_type,
  engagement_model engagement_model,
  timeline         timeline_option,
  message          text,
  locale           text default 'en',
  ip_address       inet,
  read             boolean default false,
  created_at       timestamptz default now()
);

create type interaction_type as enum (
  'form_submission', 'email_sent', 'email_received',
  'call', 'meeting', 'note', 'status_change',
  'proposal_sent', 'contract_signed'
);

create table public.crm_interactions (
  id           uuid primary key default uuid_generate_v4(),
  contact_id   uuid references crm_contacts(id),
  lead_id      uuid references crm_leads(id),
  type         interaction_type not null,
  title        text not null,
  body         text,
  metadata     jsonb default '{}',
  created_by   uuid references profiles(id),
  created_at   timestamptz default now()
);

create table public.crm_newsletter_subscribers (
  id                uuid primary key default uuid_generate_v4(),
  email             text unique not null,
  first_name        text,
  locale            text default 'en',
  status            text default 'active' check (status in ('active', 'unsubscribed', 'bounced')),
  consent_given_at  timestamptz,
  unsubscribed_at   timestamptz,
  source            text,
  tags              text[] default '{}',
  created_at        timestamptz default now()
);

create table public.crm_newsletter_campaigns (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  subject       text,
  status        text default 'draft' check (status in ('draft', 'scheduled', 'sent')),
  segment       text default 'all',
  sent_count    integer default 0,
  open_count    integer default 0,
  click_count   integer default 0,
  unsub_count   integer default 0,
  scheduled_at  timestamptz,
  sent_at       timestamptz,
  created_at    timestamptz default now()
);

-- RLS: CRM is internal only
alter table public.crm_contacts enable row level security;
alter table public.crm_leads enable row level security;
alter table public.crm_project_requests enable row level security;
alter table public.crm_interactions enable row level security;
alter table public.crm_newsletter_subscribers enable row level security;
alter table public.crm_newsletter_campaigns enable row level security;

-- Public: allow insert on project_requests and newsletter_subscribers (form submissions)
create policy "Anyone can submit a project request"
  on crm_project_requests for insert with check (true);
create policy "Anyone can subscribe to newsletter"
  on crm_newsletter_subscribers for insert with check (true);
create policy "Subscribers can unsubscribe themselves"
  on crm_newsletter_subscribers for update using (true)
  with check (status = 'unsubscribed');

-- Internal reads: authenticated users only
create policy "Auth users can read CRM data"
  on crm_contacts for select using (auth.role() = 'authenticated');
create policy "Auth users can read leads"
  on crm_leads for select using (auth.role() = 'authenticated');
-- (repeat for other CRM tables with auth.role() = 'authenticated')
```

### Migration 004 — Indexes & triggers
```sql
-- supabase/migrations/20260601000004_indexes_triggers.sql

-- Indexes
create index on cms_content_blocks (page_slug, locale);
create index on crm_leads (status, created_at desc);
create index on crm_project_requests (read, created_at desc);
create index on crm_interactions (contact_id, created_at desc);
create index on crm_newsletter_subscribers (status, locale);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_cms_blocks_updated_at before update on cms_content_blocks
  for each row execute function update_updated_at();
create trigger trg_leads_updated_at before update on crm_leads
  for each row execute function update_updated_at();
create trigger trg_contacts_updated_at before update on crm_contacts
  for each row execute function update_updated_at();

-- Log lead status changes automatically
create or replace function log_lead_status_change()
returns trigger as $$
begin
  if old.status <> new.status then
    insert into crm_interactions (lead_id, contact_id, type, title, metadata)
    values (
      new.id, new.contact_id, 'status_change',
      'Status changed: ' || old.status || ' → ' || new.status,
      jsonb_build_object('from', old.status, 'to', new.status)
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_lead_status_log after update on crm_leads
  for each row execute function log_lead_status_change();
```

### Migration 005 — Seed content (landing page)
```sql
-- supabase/migrations/20260601000005_seed_landing_content.sql
-- Insert default EN content blocks for landing page

insert into cms_feature_flags (key, enabled, description) values
  ('locale.en.enabled', true, 'English language enabled'),
  ('locale.ro.enabled', true, 'Romanian language enabled'),
  ('section.trust_bar.visible', true, 'Show trust bar on landing'),
  ('section.products.visible', false, 'Show products section (enable when NedAI launches)');

insert into cms_pages (slug, locale, title, published) values
  ('landing', 'en', 'Nedora — Enterprise Software, Built with Intent', true),
  ('landing', 'ro', 'Nedora — Software Enterprise, Construit cu Intenție', true);

insert into cms_content_blocks (page_slug, key, locale, value) values
  ('landing', 'hero.eyebrow', 'en', 'Enterprise Software · Bucharest, Romania'),
  ('landing', 'hero.eyebrow', 'ro', 'Software Enterprise · București, România'),
  ('landing', 'hero.heading', 'en', 'Enterprise software, built for the way your business actually works.'),
  ('landing', 'hero.heading', 'ro', 'Software enterprise construit pentru felul în care afacerea ta funcționează cu adevărat.'),
  ('landing', 'hero.subheading', 'en', 'Nedora designs and delivers mission-critical applications and integrations for organisations that can''t afford guesswork.'),
  ('landing', 'hero.subheading', 'ro', 'Nedora proiectează și livrează aplicații și integrări critice pentru organizații care nu-și pot permite improvizații.'),
  ('landing', 'hero.cta_primary', 'en', 'Request an offer'),
  ('landing', 'hero.cta_primary', 'ro', 'Solicită o ofertă'),
  ('landing', 'hero.cta_secondary', 'en', 'See how we work'),
  ('landing', 'hero.cta_secondary', 'ro', 'Cum lucrăm'),
  ('landing', 'stats.years_value', 'en', '10+'),
  ('landing', 'stats.years_label', 'en', 'Years in enterprise software'),
  ('landing', 'stats.years_label', 'ro', 'Ani în software enterprise'),
  ('landing', 'stats.projects_value', 'en', '40+'),
  ('landing', 'stats.projects_label', 'en', 'Projects delivered'),
  ('landing', 'stats.projects_label', 'ro', 'Proiecte livrate'),
  ('landing', 'stats.retention_value', 'en', '90%'),
  ('landing', 'stats.retention_label', 'en', 'Client retention rate'),
  ('landing', 'stats.retention_label', 'ro', 'Rată de retenție clienți'),
  ('landing', 'footer.copyright', 'en', '© Nedora · 2026. All rights reserved.'),
  ('landing', 'footer.copyright', 'ro', '© Nedora · 2026. Toate drepturile rezervate.');
```

---

## Phase 2 — microCMS App

**Path:** `apps/microcms/`

### 2.1 — Supabase client (`packages/db`)

```ts
// packages/db/src/client.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'  // generated by supabase gen types

export const createSupabaseServerClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!  // server only
  )

export const createSupabasePublicClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
```

### 2.2 — CMS content helpers

```ts
// packages/db/src/cms.ts

export async function getCmsBlock(
  pageSlug: string,
  key: string,
  locale: string,
  fallbackLocale = 'en'
): Promise<string> {
  const client = createSupabaseServerClient()
  const { data } = await client
    .from('cms_content_blocks')
    .select('value')
    .eq('page_slug', pageSlug)
    .eq('key', key)
    .eq('locale', locale)
    .single()

  if (!data?.value && locale !== fallbackLocale) {
    return getCmsBlock(pageSlug, key, fallbackLocale)
  }
  return data?.value ?? ''
}

export async function getPageBlocks(
  pageSlug: string,
  locale: string
): Promise<Record<string, string>> {
  const client = createSupabaseServerClient()
  const { data } = await client
    .from('cms_content_blocks')
    .select('key, value')
    .eq('page_slug', pageSlug)
    .in('locale', [locale, 'en'])  // fetch both, prefer locale

  // Merge: locale takes priority over 'en' fallback
  const blocks: Record<string, string> = {}
  data?.forEach(row => {
    if (!blocks[row.key] || locale !== 'en') {
      blocks[row.key] = row.value ?? ''
    }
  })
  return blocks
}

export async function getFeatureFlag(key: string): Promise<boolean> {
  const client = createSupabaseServerClient()
  const { data } = await client
    .from('cms_feature_flags')
    .select('enabled')
    .eq('key', key)
    .single()
  return data?.enabled ?? false
}
```

### 2.3 — microCMS Admin UI (Next.js app)

Key pages to build:

| Route | Purpose |
|---|---|
| `/` | Dashboard — recent edits, page list |
| `/pages` | List of CMS pages |
| `/pages/[slug]/[locale]` | Edit all content blocks for a page/locale |
| `/flags` | Feature flags toggle UI |
| `/media` | Media library |
| `/navigation` | Nav link editor |

Implementation notes:
- Use Supabase Auth for login (email/password, no OAuth needed initially)
- All mutations via Server Actions
- Use a simple `<ContentBlockEditor>` component: key label + textarea + save button
- Flag toggles: checkbox UI with optimistic updates

---

## Phase 3 — Landing Page App

**Path:** `apps/landing/`

### 3.1 — next-intl setup

```ts
// apps/landing/i18n.ts
import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

const locales = ['en', 'ro']

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as string)) notFound()
  return {
    messages: (await import(`../../messages/${locale}.json`)).default
  }
})
```

### 3.2 — Route structure

```
apps/landing/app/
  [locale]/
    layout.tsx        # Sets locale, loads fonts, nav
    page.tsx          # Landing page — fetches all CMS blocks server-side
    privacy/
      page.tsx
  not-found.tsx
  globals.css         # @font-face + CSS variables
```

### 3.3 — Landing page data flow

```ts
// apps/landing/app/[locale]/page.tsx (Server Component)
import { getPageBlocks, getFeatureFlag } from '@nedora/db/cms'

export default async function LandingPage({ params: { locale } }) {
  const [cms, showProducts] = await Promise.all([
    getPageBlocks('landing', locale),
    getFeatureFlag('section.products.visible')
  ])

  return (
    <>
      <HeroSection cms={cms} locale={locale} />
      <CommitmentsSection cms={cms} />
      <ProcessSection cms={cms} />
      <EngagementSection cms={cms} />
      {showProducts && <ProductsSection cms={cms} />}
      <ContactSection locale={locale} />
    </>
  )
}
```

### 3.4 — Contact form (Server Action)

```ts
// apps/landing/app/actions/submitRequest.ts
'use server'
import { createSupabaseServerClient } from '@nedora/db'
import { z } from 'zod'

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  company: z.string().optional(),
  projectType: z.enum(['new_application', 'integration', 'support_evolution', 'not_sure']),
  engagementModel: z.enum(['fixed_scope', 'time_based', 'not_sure']),
  timeline: z.enum(['ready_now', '1_3_months', '3_6_months', 'exploring']),
  message: z.string().optional(),
  locale: z.enum(['en', 'ro']).default('en')
})

export async function submitProjectRequest(formData: FormData) {
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.flatten() }

  const db = createSupabaseServerClient()  // uses service_role

  // 1. Upsert contact
  const { data: contact } = await db
    .from('crm_contacts')
    .upsert({ email: parsed.data.email, first_name: parsed.data.firstName, ... })
    .select('id').single()

  // 2. Create project request
  await db.from('crm_project_requests').insert({
    contact_id: contact?.id,
    ...parsed.data
  })

  // 3. Create lead
  await db.from('crm_leads').insert({
    contact_id: contact?.id,
    status: 'new',
    project_type: parsed.data.projectType,
    ...
  })

  // 4. Send notification email via Resend
  // await sendNotificationEmail(parsed.data)

  return { success: true }
}
```

### 3.5 — Language switcher

```tsx
// apps/landing/components/LanguageSwitcher.tsx
'use client'
import { usePathname, useRouter } from 'next/navigation'

export function LanguageSwitcher({ locale, availableLocales }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (next: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    router.push(newPath)
  }

  return (
    <div className="flex gap-1">
      {availableLocales.map(l => (
        <button key={l} onClick={() => switchLocale(l)}
          className={locale === l ? 'opacity-100' : 'opacity-40'}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
```

`availableLocales` is fetched server-side from `cms_feature_flags` (`locale.*.enabled`), so adding a new language is just flipping a flag.

---

## Phase 4 — microCRM App

**Path:** `apps/microcrm/`

### 4.1 — Auth guard

All routes under `apps/microcrm/` require Supabase Auth. Protect via middleware:

```ts
// apps/microcrm/middleware.ts
import { createMiddlewareClient } from '@supabase/ssr'
export async function middleware(req) {
  const { supabase, response } = createMiddlewareClient({ req })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.redirect('/login')
  return response
}
```

### 4.2 — Key CRM pages

| Route | Purpose |
|---|---|
| `/` | Dashboard — stats, pipeline summary, recent activity |
| `/leads` | Lead list (table + kanban toggle) |
| `/leads/[id]` | Lead detail — info, history, notes |
| `/contacts` | Contact directory |
| `/contacts/[id]` | Contact detail |
| `/requests` | Incoming project request inbox |
| `/newsletter` | Campaign list + subscriber stats |
| `/newsletter/[id]` | Campaign editor |
| `/activity` | Full interaction feed |
| `/settings` | Pipeline stages, tags, users |

### 4.3 — Real-time lead notifications

Use Supabase Realtime to show a badge when new project requests arrive:

```ts
// apps/microcrm/hooks/useNewRequests.ts
'use client'
import { useEffect, useState } from 'react'
import { createSupabasePublicClient } from '@nedora/db'

export function useNewRequestsCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const client = createSupabasePublicClient()
    const sub = client
      .channel('new-requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'crm_project_requests'
      }, () => setCount(c => c + 1))
      .subscribe()

    return () => { client.removeChannel(sub) }
  }, [])

  return count
}
```

---

## Phase 5 — Deployment

### Vercel setup

Each app is deployed as a separate Vercel project:

| App | Domain |
|---|---|
| `apps/landing` | nedora.co |
| `apps/microcms` | cms.nedora.co |
| `apps/microcrm` | crm.nedora.co |

Vercel configuration (`vercel.json` in each app):
```json
{
  "framework": "nextjs",
  "buildCommand": "cd ../.. && pnpm build --filter landing",
  "outputDirectory": "apps/landing/.next"
}
```

### Supabase Production

1. Create Supabase project at supabase.com
2. Run migrations: `supabase db push`
3. Set environment variables in Vercel dashboard
4. Enable Supabase Auth email templates (custom branding)

---

## Build Order Summary

```
Week 1
  ✓ Repo + monorepo setup (Phase 0)
  ✓ Supabase migrations 001–005 (Phase 1)
  ✓ packages/db with Supabase client + CMS helpers

Week 2
  ✓ microCMS admin UI (Phase 2)
  ✓ Seed EN + RO content blocks

Week 3
  ✓ Landing page — layout, sections, fonts (Phase 3)
  ✓ Contact form + Server Action
  ✓ i18n + language switcher

Week 4
  ✓ microCRM — auth, dashboard, leads (Phase 4)
  ✓ Project requests inbox
  ✓ Activity feed + realtime

Week 5
  ✓ microCRM — contacts, newsletter
  ✓ Resend email notifications
  ✓ Vercel deploy + DNS (Phase 5)
  ✓ Supabase production + RLS audit
```

---

## Notes for VS Code

- Install extensions: **ESLint**, **Prettier**, **Tailwind CSS IntelliSense**, **Supabase** (if available), **GitLens**
- Use the **Turborepo** extension or run `pnpm dev` from the root in VS Code's integrated terminal
- Supabase Studio runs at `http://localhost:54323` when `supabase start` is active — use it to inspect tables and run SQL directly during development
- The `mockups/` folder contains the HTML design reference — open in browser to check layout/styles while building components
