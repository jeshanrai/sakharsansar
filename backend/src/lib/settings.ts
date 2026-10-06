import prisma from "./prisma";

/**
 * Where order and enquiry notifications go, as set in the admin panel.
 *
 * Until someone saves a list there, the MAIL_TO env var is used, so a fresh
 * deploy still notifies somebody. If the Setting table does not exist yet (the
 * migration not applied), reading falls back the same way rather than
 * throwing: a missing table must never cost the shop an order.
 */
const NOTIFY_KEY = "notificationEmails";
export const MAX_NOTIFY_EMAILS = 5;

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function envEmails(): string[] {
  return (process.env.MAIL_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(isEmail);
}

export type NotifyEmails = { emails: string[]; source: "settings" | "env" };

export async function getNotificationEmails(): Promise<NotifyEmails> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: NOTIFY_KEY } });
    if (row) {
      const parsed: unknown = JSON.parse(row.value);
      if (Array.isArray(parsed)) {
        return { emails: parsed.filter((e): e is string => typeof e === "string" && isEmail(e)), source: "settings" };
      }
    }
  } catch (err) {
    console.error("⚠ Could not read notification emails; falling back to MAIL_TO:");
    console.error(err instanceof Error ? err.message : err);
  }
  return { emails: envEmails(), source: "env" };
}

export async function setNotificationEmails(emails: string[], adminId?: string): Promise<string[]> {
  const clean = [...new Set(emails.map((e) => e.trim().toLowerCase()))];
  const value = JSON.stringify(clean);
  await prisma.setting.upsert({
    where: { key: NOTIFY_KEY },
    create: { key: NOTIFY_KEY, value, updatedBy: adminId },
    update: { value, updatedBy: adminId },
  });
  return clean;
}
