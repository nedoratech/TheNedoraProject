/**
 * AES-256-GCM field encryption (server-only).
 * Keys come from nedora_encryption_store per subject — see @nedora/db/encryption.
 */

import { createCipheriv, createDecipheriv, createHmac, createHash, randomBytes } from 'node:crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12
const AUTH_TAG_LENGTH = 16
const VERSION = 'v1'

function assertServerOnly(): void {
  if (typeof window !== 'undefined') {
    throw new Error('@nedora/crypto/cipher must only be used on the server')
  }
}

function assertKey(key: Buffer): void {
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes')
  }
}

function getHashKeyFromDek(dek: Buffer): Buffer {
  assertKey(dek)
  return createHash('sha256').update(dek).update('nedora:pii:hmac:v1').digest()
}

export function hashLookupWithKey(
  dek: Buffer,
  value: string,
  purpose: 'email' = 'email',
): string {
  assertServerOnly()
  const normalized = value.trim().toLowerCase()
  return createHmac('sha256', getHashKeyFromDek(dek))
    .update(`${purpose}:${normalized}`)
    .digest('hex')
}

export function encryptWithKey(dek: Buffer, plaintext: string): string {
  assertServerOnly()
  assertKey(dek)
  if (!plaintext) {
    throw new Error('encryptWithKey: plaintext must be non-empty')
  }

  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, dek, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  const payload = Buffer.concat([encrypted, tag]).toString('base64url')

  return `${VERSION}:${iv.toString('base64url')}:${payload}`
}

export function encryptWithKeyOptional(
  dek: Buffer,
  value: string | null | undefined,
): string | null {
  if (value == null || value.trim() === '') return null
  return encryptWithKey(dek, value.trim())
}

export function decryptWithKey(
  dek: Buffer,
  ciphertext: string | null | undefined,
): string | null {
  assertServerOnly()
  if (ciphertext == null || ciphertext === '') return null

  if (!ciphertext.startsWith(`${VERSION}:`)) {
    return ciphertext
  }

  const parts = ciphertext.split(':')
  if (parts.length !== 3) {
    throw new Error('decryptWithKey: invalid ciphertext format')
  }

  const iv = Buffer.from(parts[1]!, 'base64url')
  const payload = Buffer.from(parts[2]!, 'base64url')
  if (payload.length < AUTH_TAG_LENGTH) {
    throw new Error('decryptWithKey: payload too short')
  }

  const tag = payload.subarray(payload.length - AUTH_TAG_LENGTH)
  const encrypted = payload.subarray(0, payload.length - AUTH_TAG_LENGTH)

  assertKey(dek)
  const decipher = createDecipheriv(ALGORITHM, dek, iv)
  decipher.setAuthTag(tag)
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()])
  return decrypted.toString('utf8')
}

export function decryptWithKeyOptional(
  dek: Buffer,
  ciphertext: string | null | undefined,
): string | null {
  if (ciphertext == null || ciphertext === '') return null
  return decryptWithKey(dek, ciphertext)
}

export function generateDek(): Buffer {
  assertServerOnly()
  return randomBytes(32)
}
