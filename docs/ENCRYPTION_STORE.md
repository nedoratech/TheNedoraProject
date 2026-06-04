# Encryption store (per-subject keys)

CRM contact fields are encrypted with a **unique AES-256 key per subject**, stored in Supabase.

## Flow

1. **Form submit** (landing) calls `provisionContactSubject()` → creates or finds `auth.users` + `profiles` (`role: contact`).
2. **`ensureSubjectDek()`** inserts a 32-byte key into `nedora_encryption_store` if missing.
3. **`encryptContactFields()` / `encryptRequestFields()`** write ciphertext using that subject's DEK.
4. **microCRM** loads rows and **`decryptContact()`** / **`decryptRequestFields()`** load the DEK by `subject_id` and decrypt.

## Table

| Table | Purpose |
|-------|---------|
| `nedora_encryption_store` | `subject_id` (auth user UUID) → `dek_b64` (32-byte AES key) |
| `crm_contacts.subject_id` | Links CRM contact to auth subject |
| `crm_project_requests.subject_id` | Same DEK as contact for request ciphertext |

RLS: no policies on `nedora_encryption_store` — only the **service role** can read/write keys.

## Helper module

Use **`@nedora/db/encryption`** everywhere:

```ts
import {
  provisionContactSubject,
  encryptForSubject,
  decryptForSubject,
  encryptContactFields,
  decryptContact,
} from '@nedora/db/encryption'
```

Low-level primitives: **`@nedora/crypto/cipher`**.

## Environment

Required for landing + microCRM server code:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

No shared encryption env var — keys live in `nedora_encryption_store`.

## Migrations

- `20260603120000_pii_encryption_columns.sql` — `*_ciphertext` column names (historical)
- `20260605100000_encryption_store.sql` — store table, `contact` role, `subject_id` columns

After deploy: `yarn db:types` and commit `packages/db/src/types.ts`.

## Security notes

- DEKs in Postgres are protected by RLS + service-role-only access.
- Rotating a subject key requires re-encrypting that subject's CRM rows (not automated).
- Staff (`admin` / `editor` / `viewer`) use normal auth; contacts use `role: contact` without dashboard access.
