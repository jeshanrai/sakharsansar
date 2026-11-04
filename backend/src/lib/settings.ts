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

// ── Which events send an email ────────────────────────────────────────
// Stored as {"order":true,...} under one key. Missing keys default to on, so a
// new event type starts enabled without a data migration.
const EVENTS_KEY = "notificationEvents";
export const NOTIFY_EVENTS = ["order", "enquiry", "sale", "expense"] as const;
export type NotifyEvent = (typeof NOTIFY_EVENTS)[number];
export type NotifyEvents = Record<NotifyEvent, boolean>;

const ALL_ON: NotifyEvents = { order: true, enquiry: true, sale: true, expense: true };

export async function getNotificationEvents(): Promise<NotifyEvents> {
  try {
    const row = await prisma.setting.findUnique({ where: { key: EVENTS_KEY } });
    if (row) {
      const parsed: unknown = JSON.parse(row.value);
      if (parsed && typeof parsed === "object") {
        const out = { ...ALL_ON };
        for (const e of NOTIFY_EVENTS) {
          const v = (parsed as Record<string, unknown>)[e];
          if (typeof v === "boolean") out[e] = v;
        }
        return out;
      }
    }
  } catch (err) {
    console.error("⚠ Could not read notification events; defaulting to all on:");
    console.error(err instanceof Error ? err.message : err);
  }
  return { ...ALL_ON };
}

export async function setNotificationEvents(input: Partial<Record<string, unknown>>, adminId?: string): Promise<NotifyEvents> {
  const next = await getNotificationEvents();
  for (const e of NOTIFY_EVENTS) {
    if (typeof input[e] === "boolean") next[e] = input[e] as boolean;
  }
  const value = JSON.stringify(next);
  await prisma.setting.upsert({
    where: { key: EVENTS_KEY },
    create: { key: EVENTS_KEY, value, updatedBy: adminId },
    update: { value, updatedBy: adminId },
  });
  return next;
}
