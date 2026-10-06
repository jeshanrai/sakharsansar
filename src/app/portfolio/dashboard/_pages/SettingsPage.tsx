"use client";

import { useEffect, useState } from "react";
import { Mail, X, Send, AlertCircle, CheckCircle2, Plus } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { Card, SectionHeading, Button } from "../_components/primitives";

type NotifySettings = {
  emails: string[];
  /** "env" until someone saves a list here: the backend's MAIL_TO is in use. */
  source: "settings" | "env";
  from: string;
  configured: boolean;
  max: number;
};

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((e, i) => e === b[i]);

export default function SettingsPage({ onToast }: { onToast: (msg: string) => void }) {
  const [settings, setSettings] = useState<NotifySettings | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [draftError, setDraftError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    apiFetch("/settings/notifications")
      .then(async (res) => {
        if (!alive) return;
        if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? `HTTP ${res.status}`);
        const data: NotifySettings = await res.json();
        setSettings(data);
        setEmails(data.emails);
      })
      .catch((err) => alive && setLoadError(err instanceof Error ? err.message : String(err)));
    return () => {
      alive = false;
    };
  }, []);

  const max = settings?.max ?? 5;
  const dirty = settings ? settings.source === "env" || !sameList(emails, settings.emails) : false;

  const addDraft = () => {
    const value = draft.trim().toLowerCase();
    if (!value) return;
    if (!isEmail(value)) return setDraftError("That doesn't look like an email address.");
    if (emails.includes(value)) return setDraftError("Already on the list.");
    if (emails.length >= max) return setDraftError(`At most ${max} addresses.`);
    setEmails([...emails, value]);
    setDraft("");
    setDraftError(null);
  };

  const save = async () => {
    setSaving(true);
    setNotice(null);
    const res = await apiFetch("/settings/notifications", {
      method: "PUT",
      body: JSON.stringify({ emails }),
    });
    const data = await res.json().catch(() => null);
    setSaving(false);
    if (!res.ok) {
      setNotice({ kind: "error", text: data?.error ?? "Could not save." });
      return;
    }
    setSettings((s) => (s ? { ...s, emails: data.emails, source: "settings" } : s));
    setEmails(data.emails);
    onToast("Notification emails saved");
  };

  const sendTest = async () => {
    setTesting(true);
    setNotice(null);
    const res = await apiFetch("/settings/notifications/test", {
      method: "POST",
      body: JSON.stringify({ emails }),
    });
    const data = await res.json().catch(() => null);
    setTesting(false);
    if (res.ok) {
      setNotice({ kind: "ok", text: `Test order email sent to ${emails.join(", ")}. Check the inbox (and spam).` });
    } else {
      setNotice({ kind: "error", text: data?.error ?? "The test email could not be sent." });
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        eyebrow="Settings"
        title="Order notifications"
        description="Every order placed on the website is emailed to these addresses, with the customer's details and a button to call them."
      />

      {loadError ? (
        <Card className="p-5 sm:p-6">
          <p className="text-sm text-rose-700">Could not load settings: {loadError}</p>
        </Card>
      ) : !settings ? (
        <Card className="p-6">
          <div className="w-6 h-6 border-2 border-[#B8763E] border-t-transparent rounded-full animate-spin" />
        </Card>
      ) : (
        <Card className="p-5 sm:p-6 space-y-6">
          {!settings.configured && (
            <div className="flex gap-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Email sending is not set up on the server yet: <code className="font-mono text-xs">RESEND_API_KEY</code> is
                missing from the backend environment. Orders are still saved; they just won&apos;t be emailed.
              </span>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-[11px] tracking-[0.14em] uppercase text-[#1A1410]/50 font-medium">Send order emails to</p>

            {emails.length === 0 ? (
              <p className="text-sm text-[#1A1410]/50">No addresses yet. Orders won&apos;t be emailed to anyone.</p>
            ) : (
              <ul className="space-y-2">
                {emails.map((email) => (
                  <li
                    key={email}
                    className="flex items-center gap-3 rounded-xl bg-[#FAF6EE] border border-[#1A1410]/6 pl-3.5 pr-1.5 h-11"
                  >
                    <Mail className="w-4 h-4 text-[#B8763E] shrink-0" />
                    <span className="flex-1 min-w-0 truncate text-sm text-[#1A1410]">{email}</span>
                    <button
                      onClick={() => setEmails(emails.filter((e) => e !== email))}
                      aria-label={`Remove ${email}`}
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-[#1A1410]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {settings.source === "env" && emails.length > 0 && (
              <p className="text-xs text-[#1A1410]/50">
                This is the server&apos;s default (MAIL_TO). Save to manage the list from here.
              </p>
            )}

            {emails.length < max && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addDraft();
                }}
                className="flex gap-2"
              >
                <input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setDraftError(null);
                  }}
                  placeholder="name@example.com"
                  aria-label="Add an email address"
                  className="flex-1 min-w-0 h-11 px-3.5 rounded-xl bg-white border border-[#1A1410]/10 text-sm placeholder:text-[#1A1410]/30 focus:outline-none focus:border-[#B8763E]/50 focus:ring-2 focus:ring-[#B8763E]/15 transition-all"
                />
                <Button type="submit" variant="secondary" disabled={!draft.trim()}>
                  <Plus className="w-4 h-4" /> Add
                </Button>
              </form>
            )}
            {draftError && <p className="text-xs text-rose-600">{draftError}</p>}
          </div>

          {notice && (
            <div
              className={`flex gap-3 rounded-xl px-4 py-3 text-sm ${
                notice.kind === "ok"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border border-rose-200 text-rose-800"
              }`}
            >
              {notice.kind === "ok" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span className="break-words min-w-0">{notice.text}</span>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:items-center sm:justify-between border-t border-[#1A1410]/6 pt-5">
            <p className="text-xs text-[#1A1410]/45">
              Sent from <span className="font-medium text-[#1A1410]/70 break-all">{settings.from}</span>
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={sendTest}
                disabled={testing || emails.length === 0 || !settings.configured}
                className="flex-1 sm:flex-none"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {testing ? "Sending…" : (
                    <>
                      <span className="sm:hidden">Send test</span>
                      <span className="hidden sm:inline">Send test email</span>
                    </>
                  )}
                </span>
              </Button>
              <Button onClick={save} disabled={saving || !dirty} className="flex-1 sm:flex-none">
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
