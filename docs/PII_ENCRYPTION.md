# PII encryption

Personal data in CRM tables is encrypted **in the application** before it reaches Postgres, using a shared key across all Nedora apps.

## Algorithm

- **AES-256-GCM** (authenticated encryption)
- **Email lookup:** HMAC-SHA256 hash of normalized email (`email_hash`) for unique constraints and upserts — plaintext email is never stored

Implementation: `@nedora/crypto` → used by `@nedora/db/crm` on write and `@nedora/db/pii` on read.

## Environment variable

Set the **same** value in every app (and Vercel project) that reads or writes PII:

```bash
# 32-byte key, base64-encoded (recommended)
PII_ENCRYPTION_KEY=

# Generate:
openssl rand -base64 32
```

Add to:

- Repo root `.env.local` (reference)
- `apps/landing/.env.local`
- `apps/microcms/.env.local` (if it ever writes PII)
- `apps/microcrm/.env.local`
- Vercel env for each deployed app

**Never** expose `PII_ENCRYPTION_KEY` to the browser (`NEXT_PUBLIC_*`). Encryption runs only in Server Actions and server components via the service role client.

## Encrypted fields

| Table | Ciphertext columns | Lookup |
|-------|-------------------|--------|
| `crm_contacts` | email, names, phone, company, notes, address | `email_hash` |
| `crm_project_requests` | email, names, company, message, address | `email_hash` |
| `crm_newsletter_subscribers` | email, names | `email_hash` |

`profiles` (staff auth) and CMS content are **not** encrypted.

## Usage in code

**Write (landing form, CRM):**

```ts
import { createProjectRequest } from '@nedora/db/crm'
// encrypts automatically
await createProjectRequest({ firstName, lastName, email, ... })
```

**Read (microCRM):**

```ts
import { decryptContact } from '@nedora/db/pii'
const contacts = rows.map(decryptContact)
```

**Low-level:**

```ts
import { encryptPii, decryptPii, hashPiiLookup } from '@nedora/crypto/pii'
```

## Migrations

Schema changes deploy via **Supabase GitHub integration** (see [SUPABASE.md](./SUPABASE.md)).

After a migration changes columns, run `yarn db:types` locally and commit `packages/db/src/types.ts`.

## Legacy plaintext

If a row predates encryption, `decryptPii` returns the stored string unchanged when it does not start with `v1:`. Re-save contacts via the app to encrypt.

## Security notes

- Rotating the key requires re-encrypting all rows (not automated).
- Encryption at rest in Postgres (Supabase disk encryption) is separate from this field-level layer.
- Do not log decrypted PII in production.
