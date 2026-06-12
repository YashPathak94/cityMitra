export const ADMIN_COOKIE = "citymitra_admin";

const isProduction = process.env.NODE_ENV === "production";

// Constant-time string comparison; avoids node:crypto so the proxy can use it too.
function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;

  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// In production both secrets MUST come from env; without them admin access fails closed.
export function adminSessionToken(): string | null {
  return process.env.ADMIN_SESSION_TOKEN || (isProduction ? null : "citymitra-local-admin-session");
}

export function adminPassword(): string | null {
  return process.env.ADMIN_PASSWORD || (isProduction ? null : "admin123");
}

export function isAdminCookie(value?: string) {
  const token = adminSessionToken();
  return Boolean(value && token && safeEqual(value, token));
}

export function isValidAdminPassword(value?: string) {
  const password = adminPassword();
  return Boolean(value && password && safeEqual(value, password));
}
