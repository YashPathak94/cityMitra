import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "citymitra_session";
const sessionMaxAgeSeconds = 60 * 60 * 24 * 30;
const isProduction = process.env.NODE_ENV === "production";

function sessionSecret(): string | null {
  return process.env.AUTH_SESSION_SECRET || (isProduction ? null : "citymitra-dev-auth-secret");
}

export function authConfigured() {
  return Boolean(sessionSecret());
}

function safeEqualHex(a: string, b: string) {
  const bufferA = Buffer.from(a, "hex");
  const bufferB = Buffer.from(b, "hex");
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = (stored || "").split(":");
  if (!salt || !hash) return false;
  const derived = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return expected.length === derived.length && timingSafeEqual(expected, derived);
}

export function createSessionToken(email: string) {
  const secret = sessionSecret();
  if (!secret) return null;
  const expiresAt = Date.now() + sessionMaxAgeSeconds * 1000;
  const payload = `${email}|${expiresAt}`;
  const signature = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function readSessionToken(token?: string): { email: string } | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [email, expiresAt, signature] = decoded.split("|");
    if (!email || !expiresAt || !signature) return null;

    const expected = createHmac("sha256", secret).update(`${email}|${expiresAt}`).digest("hex");
    if (!safeEqualHex(signature, expected)) return null;
    if (Date.now() > Number(expiresAt)) return null;

    return { email };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
  maxAge: sessionMaxAgeSeconds
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Password-reset token: stateless, signed, and bound to the current password
// hash so it becomes single-use (changing the password invalidates it).
export function createResetToken(email: string, passwordHash: string) {
  const secret = sessionSecret();
  if (!secret) return null;
  const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
  const payload = `${email}|${expiresAt}`;
  const signature = createHmac("sha256", secret).update(`${payload}|${passwordHash}`).digest("hex");
  return Buffer.from(`${payload}|${signature}`).toString("base64url");
}

export function readResetToken(token: string, passwordHash: string): { email: string } | null {
  const secret = sessionSecret();
  if (!secret || !token) return null;

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const [email, expiresAt, signature] = decoded.split("|");
    if (!email || !expiresAt || !signature) return null;

    const expected = createHmac("sha256", secret).update(`${email}|${expiresAt}|${passwordHash}`).digest("hex");
    if (!safeEqualHex(signature, expected)) return null;
    if (Date.now() > Number(expiresAt)) return null;

    return { email };
  } catch {
    return null;
  }
}

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
