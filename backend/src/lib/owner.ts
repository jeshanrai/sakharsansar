import prisma from "./prisma";
import { getSeasons, seasonOfDate } from "./seasons";

/**
 * The owner can delete sales, close and reopen years, and change records in
 * a closed year. Everyone else is staff. Owners are named by email in
 * OWNER_EMAILS (comma-separated) so a new owner needs no code change.
 */
const OWNER_EMAILS = new Set(
  (process.env.OWNER_EMAILS ?? "jeshan@sakharsansar.com")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

export function isOwnerEmail(email: string): boolean {
  return OWNER_EMAILS.has(email.trim().toLowerCase());
}

export async function isOwner(adminId?: string): Promise<boolean> {
  if (!adminId) return false;
  const admin = await prisma.admin.findUnique({ where: { id: adminId }, select: { email: true } });
  return !!admin && isOwnerEmail(admin.email);
}

/**
 * Staff may only add or change records in the current year. Pass every date
 * the change touches (the record's old date and its new one); returns the
 * refusal message, or null when the change may go ahead.
 */
export async function closedYearRefusal(
  adminId: string | undefined,
  dates: (Date | string | null | undefined)[],
): Promise<string | null> {
  const seasons = await getSeasons();
  if (seasons.length === 1) return null;
  const closed = dates
    .filter((d): d is Date | string => d != null && d !== "")
    .map((d) => seasonOfDate(seasons, new Date(d)))
    .find((s) => !s.current);
  if (!closed) return null;
  if (await isOwner(adminId)) return null;
  return `Year ${closed.number} is closed. Only the owner can change its records.`;
}
