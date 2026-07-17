// Shared-password auth. A signed cookie proves the user entered the password.
// Uses Web Crypto (HMAC) so it works in both the Edge middleware and Node routes.

const encoder = new TextEncoder();

function getSecret(): string {
  return process.env.AUTH_SECRET || "insecure-dev-secret-change-me";
}

async function hmac(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Buffer.from(new Uint8Array(sig)).toString("base64url");
}

// The cookie value is a signature over a fixed marker. If it verifies, the
// holder knew the password at login time.
const MARKER = "rvtimes-authenticated";

export const COOKIE_NAME = "rvtimes_auth";

export async function createToken(): Promise<string> {
  return await hmac(MARKER);
}

export async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const expected = await hmac(MARKER);
  // constant-time-ish comparison
  if (token.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < token.length; i++) {
    diff |= token.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.SITE_PASSWORD || "";
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < input.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
