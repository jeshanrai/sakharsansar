import nodemailer from "nodemailer";

/**
 * Gmail SMTP notifier.
 *
 * Sends a notification to the shop inbox whenever the storefront submits an
 * order or an enquiry. It is deliberately fail-soft: if the credentials are
 * missing or Gmail rejects the message, it logs and returns — it never throws,
 * so a mail problem can never break order/enquiry creation.
 *
 * Required env (set in backend/.env):
 *   GMAIL_USER          the Gmail address that sends (e.g. sakharsansar@gmail.com)
 *   GMAIL_APP_PASSWORD  a 16-char Gmail "App Password" (NOT the account password)
 *   MAIL_TO             where notifications land (defaults to GMAIL_USER)
 */
const GMAIL_USER = process.env.GMAIL_USER ?? "";
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD ?? "").replace(/\s+/g, "");
const MAIL_TO = process.env.MAIL_TO || GMAIL_USER;

const configured = Boolean(GMAIL_USER && GMAIL_APP_PASSWORD);

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  if (!configured) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    });
  }
  return transporter;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function table(rows: [string, unknown][]): string {
  const cells = rows
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:6px 14px 6px 0;color:#8a7a66;font-size:13px;white-space:nowrap;vertical-align:top">${escapeHtml(label)}</td>
           <td style="padding:6px 0;color:#3D2817;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
         </tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;max-width:520px">${cells}</table>`;
}

function wrap(title: string, body: string): string {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#F5EDE0;padding:28px">
      <div style="max-width:560px;margin:0 auto;background:#FAF6EE;border-radius:18px;padding:28px 30px;border:1px solid rgba(61,40,23,0.08)">
        <h2 style="margin:0 0 18px;color:#3D2817;font-size:19px">${escapeHtml(title)}</h2>
        ${body}
        <p style="margin:22px 0 0;color:#8a7a66;font-size:12px">Sent automatically by the SakharSansar website.</p>
      </div>
    </div>`;
}

async function send(subject: string, html: string, replyTo?: string): Promise<void> {
  const t = getTransporter();
  if (!t) {
    console.warn(`⚠ Email skipped (set GMAIL_USER & GMAIL_APP_PASSWORD): ${subject}`);
    return;
  }
  try {
    await t.sendMail({
      from: `"SakharSansar" <${GMAIL_USER}>`,
      to: MAIL_TO,
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });
    console.log(`✉ Email sent → ${MAIL_TO}: ${subject}`);
  } catch (err) {
    console.error(`✖ Email failed: ${subject}`);
    console.error(err instanceof Error ? err.message : err);
  }
}

export interface OrderEmail {
  customer: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  amount?: number;
}

export async function sendOrderNotification(order: OrderEmail): Promise<void> {
  const html = wrap(
    "🛒 New order from the website",
    table([
      ["Customer", order.customer],
      ["Phone", order.phone],
      ["Product", order.product],
      ["Quantity", order.quantity],
      ["Amount", order.amount ? `Rs. ${order.amount}` : "—"],
      ["Address", order.address],
    ]),
  );
  await send(
    `🛒 New order — ${order.product} ×${order.quantity}`,
    html,
  );
}

export interface EnquiryEmail {
  name: string;
  contact: string;
  type: string;
  message: string;
}

export async function sendEnquiryNotification(enquiry: EnquiryEmail): Promise<void> {
  const html = wrap(
    "✉️ New enquiry from the website",
    table([
      ["Name", enquiry.name],
      ["Contact", enquiry.contact],
      ["Type", enquiry.type],
      ["Message", enquiry.message],
    ]),
  );
  await send(
    `✉️ New enquiry (${enquiry.type}) — ${enquiry.name}`,
    html,
    looksLikeEmail(enquiry.contact) ? enquiry.contact : undefined,
  );
}
