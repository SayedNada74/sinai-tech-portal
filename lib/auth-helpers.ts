/**
 * Environment-Aware URL Helper Functions for Supabase Auth & OAuth Callbacks.
 * Resolves the correct base domain for local development and production (Vercel).
 */

export function getURL(): string {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : null) ??
    (typeof window !== "undefined" && window.location.origin ? window.location.origin : "http://localhost:3000");

  // Ensure URL starts with http:// or https://
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }

  // Remove trailing slashes
  return url.replace(/\/+$/, "");
}

export function getAuthCallbackURL(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/auth/callback`;
  }
  return `${getURL()}/auth/callback`;
}

export function getPasswordResetCallbackURL(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/auth/callback?next=/auth/reset-password`;
  }
  return `${getURL()}/auth/callback?next=/auth/reset-password`;
}
