import { DEFAULT_SUPER_ADMIN_EMAILS } from './constants';

/**
 * Returns the sanitized list of super-admin email addresses configured in the environment.
 * Falls back to default institutional administrative addresses if unset.
 */
export function getSuperAdminEmails(): string[] {
  const envEmails = process.env.SUPER_ADMIN_EMAILS;
  if (!envEmails) {
    return DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
  }

  const parsed = envEmails
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0 && email.includes('@'));

  return parsed.length > 0 ? parsed : DEFAULT_SUPER_ADMIN_EMAILS.map((e) => e.trim().toLowerCase());
}

/**
 * Checks whether a given email matches the SUPER_ADMIN_EMAILS whitelist (case-insensitive).
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const whitelist = getSuperAdminEmails();
  return whitelist.includes(cleanEmail);
}

/**
 * Returns whitelist metadata for administrative telemetry displays.
 */
export function getWhitelistSummary() {
  const emails = getSuperAdminEmails();
  return {
    count: emails.length,
    emails,
    isActive: emails.length > 0,
    policy: 'Instant Super-Admin Promotion on Auth',
  };
}
