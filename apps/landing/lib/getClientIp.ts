import { headers } from 'next/headers'

const IPV4_RE = /^(?:\d{1,3}\.){3}\d{1,3}$/
const IPV6_RE = /^[0-9a-f:]+$/i

function isPlausibleIp(value: string): boolean {
  if (IPV4_RE.test(value)) {
    return value.split('.').every((octet) => {
      const n = Number(octet)
      return n >= 0 && n <= 255
    })
  }
  return IPV6_RE.test(value) && value.includes(':')
}

/**
 * Best-effort client IP from reverse-proxy headers (Vercel, etc.).
 * Returns null when unavailable or not a plausible IPv4/IPv6 address.
 */
export async function getClientIp(): Promise<string | null> {
  const h = await headers()
  const candidates = [
    h.get('x-forwarded-for')?.split(',')[0]?.trim(),
    h.get('x-real-ip')?.trim(),
    h.get('cf-connecting-ip')?.trim(),
  ]

  for (const candidate of candidates) {
    if (candidate && isPlausibleIp(candidate)) return candidate
  }

  return null
}
