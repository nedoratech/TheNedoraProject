/**
 * Application-layer PII encryption (AES-256-GCM).
 * Server-only — requires PII_ENCRYPTION_KEY in the environment.
 *
 * Same key across landing, microCMS, and microCRM (Vercel env / .env.local).
 */

import { createCipheriv, createDecipheriv, createHmac, createHash, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const VERSION = 'v1'

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('@nedora/crypto/pii must only be used on the server')
  }
}

/** 32-byte AES key from PII_ENCRYPTION_KEY (base64) or SHA-256 of a passphrase. */
export function getEncryptionKey(): Buffer {
  assertServerOnly()
  const raw = process.env.PII_ENCRYPTION_KEY
  if (!raw?.trim()) {
    throw new Error('PII_ENCRYPTION_KEY is not set')
  }

  const trimmed = raw.trim()
  const asBase64 = Buffer.from(trimmed, 'base64')
  if (asBase64.length === 32) {
    return asBase64
  }

  return createHash('sha256').update(trimmed, 'utf8').digest()
}

/** HMAC key derived from the encryption key (domain-separated). */
function getHashKey(): Buffer {
  return createHash('sha256')
    .update(getEncryptionKey())
    .update('nedora:pii:hmac:v1')
    .digest()
}

/**
 * Deterministic lookup token for unique constraints and upserts (e.g. email).
 * Never store plaintext email for uniqueness — use this hash only.
 */
export function hashPiiLookup(value: string, purpose: 'email' = 'email'): string {
  assertServerOnly()
  const normalized = value.trim().toLowerCase()
  return createHmac('sha256', getHashKey())
    .update(`${purpose}:${normalized}`)
    .digest('hex')
}

/** Encrypt a string; output format: v1:<iv>:<ciphertext+tag> (base64url). */
export function encryptPii(plaintext: string): string {
  assertServerOnly()
  if (!plaintext) {
    throw new Error('encryptPii: plaintext must be non-empty')
  }

  const key = getEncryptionKey()
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const payload = Buffer.concat([encrypted, tag]).toString('base64url')

  return `${VERSION}:${iv.toString('base64url')}:${payload}`
}

export function encryptPiiOptional(value: string | null | undefined): string | null {
  if (value == null || value.trim() === '') return null
  return encryptPii(value.trim())
}

/**
 * Decrypt a value produced by encryptPii.
 * Legacy plaintext (no v1: prefix) is returned as-is for transitional rows.
 */
export function decryptPii(ciphertext: string | null | undefined): string | null {
  assertServerOnly()
  if (ciphertext == null || ciphertext === '') return null

  if (!ciphertext.startsWith(`${VERSION}:`)) {
    return ciphertext
  }

  const parts = ciphertext.split(':')
  if (parts.length !== 3) {
    throw new Error('decryptPii: invalid ciphertext format')
  }

  const iv = Buffer.from(parts[1]!, 'base64url')
  const payload = Buffer.from(parts[2]!, 'base64url')
  if (payload.length < AUTH_TAG_LENGTH) {
    throw new Error('decryptPii: payload too short')
  }

  const tag = payload.subarray(payload.length - AUTH_TAG_LENGTH)
  const encrypted = payload.subarray(0, payload.length - AUTH_TAG_LENGTH)

  const key = getEncryptionKey()
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}

export function decryptPiiOptional(ciphertext: string | null | undefined): string | null {
  if (ciphertext == null || ciphertext === '') return null
  return decryptPii(ciphertext)
}
