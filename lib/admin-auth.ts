export const ADMIN_COOKIE = "citymitra_admin";

export function adminSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN || "citymitra-local-admin-session";
}

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

export function isAdminCookie(value?: string) {
  return Boolean(value) && value === adminSessionToken();
}
