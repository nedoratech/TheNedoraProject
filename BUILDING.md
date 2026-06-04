# Nedora — Build Guide

Step-by-step for Cursor. Each step is self-contained — finish one before starting the next.
Use the HTML mockups in `/mockups` as your visual reference throughout.

---

## Prerequisites

Install these once, globally:

```bash
npm install -g yarn
npm install -g turbo
brew install supabase/tap/supabase   # macOS; or see supabase.com/docs/guides/cli
```

---

## Step 1 — Monorepo bootstrap

```bash
cd TheNedoraProject
corepack enable
yarn install          # installs turbo + typescript at root
```

Verify:
```bash
yarn turbo --version  # should print turbo version
```

---

## Step 2 — Supabase

**Remote (staging/production):** Migrations deploy through **Supabase’s GitHub integration**, not manual `db push` from your machine. See **[docs/SUPABASE.md](./docs/SUPABASE.md)** for Dashboard setup.

**Local (optional):** For offline schema testing before you push:

```bash
supabase start        # Postgres + Auth + Studio locally (config.toml already in repo)
```

Supabase Studio opens at **http://localhost:54323**
API is at **http://localhost:54321**

Copy the printed anon key + service role key into a `.env.local` at the repo root:

```bash
cp .env.example .env.local
# then fill in the values printed by `supabase start`
```

---

## Step 3 — Local migrations + seed (optional)

Only needed if you use local Supabase (`supabase start`):

```bash
yarn db:reset
# Applies /supabase/migrations/ + seed.sql on your machine
```

Verify in Studio → Table Editor: `cms_*` and `crm_*` tables.

If you work only against a linked preview/production project, skip this — migrations run when you merge via Supabase.

---

## Step 4 — TypeScript types (local only)

Migrations deploy via **Supabase GitHub integration** (automatic). Types are generated **on your machine**:

```bash
yarn db:types          # after `supabase start` + `yarn db:reset`
# or, after migrations merged to a linked project:
yarn db:types:remote   # requires `supabase link --project-ref <ref>`
```

Commit `packages/db/src/types.ts` whenever the schema changes.

---

## Step 5 — Install dependencies

Apps, packages, and shared configs are already scaffolded. Just install:

```bash
yarn install
```

---

## Step 6 — Add Futura fonts

Copy your licensed Futura WOFF2 files into each app's `public/fonts/` directory.
The expected filenames (referenced in `globals.css`) are:

```
apps/landing/public/fonts/futura-regular.woff2   # 400 (book)
apps/landing/public/fonts/futura-bold.woff2      # 700
apps/landing/public/fonts/futura-medium.woff2    # 500 (optional; 500 uses regular until added)
apps/landing/public/fonts/futura-light.woff2     # 300 (optional)
```

Do the same for `apps/microcms/public/fonts/` and `apps/microcrm/public/fonts/`.

> **Note:** Futura is a licensed font. Never load it from a CDN or commit the files to a public repo.

---

## Step 7 — Copy `.env.local` into each app

Each Next.js app needs its own env file in development:

```bash
cp .env.local apps/landing/.env.local
cp .env.local apps/microcms/.env.local
cp .env.local apps/microcrm/.env.local
```

Each app runs on a fixed port — update the `NEXT_PUBLIC_*_URL` vars accordingly:

| App       | Port | URL                    |
|-----------|------|------------------------|
| landing   | 3000 | http://localhost:3000  |
| microcms  | 3001 | http://localhost:3001  |
| microcrm  | 3002 | http://localhost:3002  |

---

## Step 8 — Start the dev servers

```bash
# All apps in parallel (recommended)
yarn dev

# Or one at a time
yarn dev:landing    # port 3000
yarn dev:cms        # port 3001
yarn dev:crm        # port 3002
```

At this point you should see:
- **Landing page** at http://localhost:3000 — 2026 design, CMS-driven
- **microCMS** at http://localhost:3001 — login, then /dashboard
- **microCRM** at http://localhost:3002 — login, then /dashboard

> **Login:** Create a user in Supabase Studio → Authentication → Users, or via the Supabase CLI:
> ```bash
> supabase auth admin create --email admin@nedora.co --password your-password
> ```

---

## Step 9 — Extend the landing page

The landing page components live in `apps/landing/app/_components/`.
CMS content is fetched server-side in `apps/landing/app/[locale]/page.tsx`.

To add or edit content, update the seed (`supabase/seed.sql`) and re-run:
```bash
yarn db:reset
```

Or edit content directly in the microCMS at http://localhost:3001/dashboard/pages.

### Realtime badge (new requests in microCRM)

Add this hook to the microCRM sidebar for a live "new request" counter:

```ts
// apps/microcrm/app/_components/useNewRequests.ts
'use client'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@nedora/db/client'

export function useNewRequestsCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const db = createBrowserClient()
    const channel = db
      .channel('new-requests')
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'crm_project_requests',
      }, () => setCount((c) => c + 1))
      .subscribe()
    return () => { db.removeChannel(channel) }
  }, [])
  return count
}
```

---

## Step 10 — Deploy to Vercel

1. Push the repo to GitHub.
2. In Vercel, create **three projects** — one per app:

| Project     | Root dir       | Domain              |
|-------------|----------------|---------------------|
| landing     | `apps/landing` | nedora.co           |
| microcms    | `apps/microcms`| cms.nedora.co       |
| microcrm    | `apps/microcrm`| crm.nedora.co       |

3. In each Vercel project → Settings → Environment Variables, add all vars from `.env.example`.
4. Connect the repo in **Supabase → Integrations → GitHub** and enable **Deploy to production** on `main`. See [docs/SUPABASE.md](./docs/SUPABASE.md).
5. After migrations deploy remotely, run `yarn db:types:remote` locally and commit `packages/db/src/types.ts`.

---

## Quick reference

```bash
yarn dev                            # run all apps in parallel (turbo)
yarn workspace landing dev          # run only the landing page (port 3000)
yarn workspace microcms dev         # run only microCMS (port 3001)
yarn workspace microcrm dev         # run only microCRM (port 3002)
yarn db:reset                       # wipe local DB, re-run migrations + seed
yarn db:types                       # types from local DB (manual, after schema change)
yarn db:types:remote                # types from linked Supabase project (manual)
yarn build                          # production build all apps
yarn typecheck                      # type-check all apps + packages
supabase start                      # start local Supabase
supabase stop                       # stop local Supabase
supabase studio                     # open Studio at localhost:54323
```
