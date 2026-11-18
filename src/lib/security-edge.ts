import { getSessionSecret, type SessionPayload } from './session';

/**
 * Edge-safe (Web Crypto) implementation of the signed session token verifier.
 *
 * The middleware runs on the Edge runtime, where the Node `crypto` module is
 * unavailable. This module only relies on `globalThis.crypto.subtle`, so it
 * works both in the Edge runtime and in Node 18+.
 */

function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function verifySignedSessionTokenEdge(
  token: string | undefined | null,
  expectedRole?: 'admin' | 'student'
): Promise<{ valid: boolean; payload?: SessionPayload; error?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing or invalid' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [payloadEncoded, signature] = parts;

  try {
    const enc = new TextEncoder();
    const key = await globalThis.crypto.subtle.importKey(
      'raw',
      enc.encode(getSessionSecret()),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const signatureBytes = await globalThis.crypto.subtle.sign(
      'HMAC',
      key,
      enc.encode(payloadEncoded)
    );
    const expectedSignature = bytesToBase64Url(new Uint8Array(signatureBytes));

    if (!timingSafeEqual(signature, expectedSignature)) {
      return { valid: false, error: 'Invalid token signature' };
    }

    const payloadJson = new TextDecoder().decode(base64UrlToBytes(payloadEncoded));
    const payload: SessionPayload = JSON.parse(payloadJson);

    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp < now) {
      return { valid: false, error: 'Token expired' };
    }

    if (expectedRole && payload.role !== expectedRole) {
      return { valid: false, error: `Unauthorized role: expected ${expectedRole}` };
    }

    return { valid: true, payload };
  } catch {
    return { valid: false, error: 'Invalid token payload' };
  }
}
