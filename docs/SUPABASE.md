# Supabase — migrations & environments

## Division of responsibility

| Task | Where it runs |
|------|----------------|
| **Migrations** (`supabase/migrations/*`) | **Automatic** — Supabase GitHub integration on push/merge |
| **TypeScript types** (`packages/db/src/types.ts`) | **Local** — you run `yarn db:types` (or `yarn db:types:remote`) on your machine and commit |

No custom GitHub Actions in this repo. Supabase applies schema changes; type generation stays a normal local dev step.

---

## Migrations (automatic)

When the GitHub integration is enabled, Supabase:

| Event | What happens |
|-------|----------------|
| PR / preview branch | Applies `supabase/migrations/*`, optional `seed.sql` on preview branches |
| Merge to production branch | Applies new migrations (if **Deploy to production** is on) |

Do **not** run `supabase db push` against staging/production from your laptop once the integration is on.

### One-time Dashboard setup

1. Create your project at [supabase.com](https://supabase.com).
2. **Project Settings → Integrations → GitHub** → connect this repo.
3. **Working directory:** `.`
4. Enable **Automatic branching** and **Deploy to production** (on `main`) as needed.
5. Add a **required Supabase check** on `main` in GitHub branch protection.

Typical git flow:

```text
feature/*  →  develop (preview)  →  main (production migrations)
```

Optional: `[remotes.staging]` / `[remotes.production]` in `supabase/config.toml` for Supabase Branching.

Docs: [GitHub integration](https://supabase.com/docs/guides/deployment/branching/github-integration)

### Authoring a migration

1. Add SQL under `supabase/migrations/` (or `supabase migration new <name>`).
2. Optionally validate locally: `supabase start` → `yarn db:reset`.
3. Commit, push, open PR — Supabase applies migrations on the preview branch.
4. Merge — remote DB updates automatically.

---

## PII encryption

CRM personal fields are encrypted in app code with a shared `PII_ENCRYPTION_KEY`. See **[PII_ENCRYPTION.md](./PII_ENCRYPTION.md)**.

## Types (local only)

Supabase does not update `packages/db/src/types.ts` in your repo. After schema changes (local or after a merge), regenerate types **on your machine** and commit:

**From local Supabase** (same migration files as CI; good while building a migration):

```bash
supabase start
yarn db:reset      # apply migrations + seed locally
yarn db:types      # writes packages/db/src/types.ts
```

**From a linked remote project** (after migrations landed on staging/production):

```bash
supabase link --project-ref <project-ref>
yarn db:types:remote
git add packages/db/src/types.ts && git commit -m "chore(db): regenerate types"
```

---

## Local Supabase (optional)

For offline work before push:

```bash
supabase start
yarn db:reset
yarn db:types
```

Use `.env.local` keys from `supabase start`, or point apps at a preview branch from the Dashboard.

---

## App env vars

Configure in Vercel and each app’s `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

No GitHub secrets are required for migrations when using Supabase’s integration.
