import { Resend } from "resend";
import { getNotificationEmails } from "./settings";

/**
 * Resend notifier.
 *
 * Emails the shop whenever the storefront submits an order or an enquiry. The
 * recipients are set in the admin panel (Settings → Order notifications); see
 * lib/settings.ts for the MAIL_TO fallback.
 *
 * Deliberately fail-soft: if the key is missing or Resend rejects the message,
 * it logs and returns a result. It never throws, so a mail problem can never
 * break order or enquiry creation.
 *
 * Env (backend/.env):
 *   RESEND_API_KEY  from resend.com → API Keys
 *   RESEND_FROM     sender, on a domain verified in Resend, e.g.
 *                   "SakharSansar Orders <orders@sakharsansar.com.np>"
 *   SITE_URL        storefront origin, for product images and dashboard links
 */
const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
export const MAIL_FROM = process.env.RESEND_FROM || "SakharSansar Orders <orders@sakharsansar.com.np>";
const SITE_URL = (process.env.SITE_URL || "https://www.sakharsansar.com.np").replace(/\/$/, "");
const DASHBOARD_URL = `${SITE_URL}/portfolio/dashboard`;

export const mailConfigured = Boolean(RESEND_API_KEY);
const resend = mailConfigured ? new Resend(RESEND_API_KEY) : null;

export type SendResult = { ok: true; id?: string } | { ok: false; error: string };

type Message = { subject: string; html: string; text: string; replyTo?: string; to?: string[] };

async function send(msg: Message): Promise<SendResult> {
  if (!resend) {
    console.warn(`⚠ Email skipped (set RESEND_API_KEY): ${msg.subject}`);
    return { ok: false, error: "RESEND_API_KEY is not set on the backend." };
  }
  const to = msg.to ?? (await getNotificationEmails()).emails;
  if (to.length === 0) {
    console.warn(`⚠ Email skipped (no notification address set): ${msg.subject}`);
    return { ok: false, error: "No notification email is set. Add one in Settings." };
  }
  try {
    const { data, error } = await resend.emails.send({
      from: MAIL_FROM,
      to,
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      ...(msg.replyTo ? { replyTo: msg.replyTo } : {}),
    });
    if (error) {
      console.error(`✖ Email failed: ${msg.subject}\n  ${error.message}`);
      return { ok: false, error: error.message };
    }
    console.log(`✉ Email sent → ${to.join(", ")}: ${msg.subject}`);
    return { ok: true, id: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`✖ Email failed: ${msg.subject}\n  ${message}`);
    return { ok: false, error: message };
  }
}

// ── Formatting ────────────────────────────────────────────────────────

function esc(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const rs = (n: number) => `Rs. ${Math.round(n).toLocaleString("en-US")}`;

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** The reference the customer is shown: the tail of the order id, upper-cased.
 *  Mirrors orderRef() in the storefront's src/lib/order-pricing.ts. */
export function orderRef(id: string): string {
  return id.slice(-6).toUpperCase();
}

/** Nepali mobiles are written 98XXXXXXXX; wa.me wants the country code. */
function whatsappNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("977")) return digits;
  return digits.length === 10 ? `977${digits}` : digits;
}

function kathmanduTime(d: Date): string {
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Kathmandu",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ── Layout ────────────────────────────────────────────────────────────
// Tables and inline styles only: Gmail strips <style>, Outlook ignores flex.

const C = {
  bg: "#F5EDE0",
  card: "#FFFFFF",
  ink: "#2C1500",
  muted: "#8A7A66",
  line: "#EFE6D8",
  amber: "#C17A2A",
  dark: "#1A1410",
  green: "#2F7D32",
};
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function shell({ preheader, eyebrow, title, subtitle, body }: {
  preheader: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  body: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}">
<tr><td align="center" style="padding:28px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:${FONT}">
    <tr><td style="background:${C.dark};border-radius:20px 20px 0 0;padding:26px 28px 24px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td style="font-family:Georgia,'Times New Roman',serif;font-size:20px;color:#F5EDE0;letter-spacing:0.5px">Sakhar<span style="color:#E8A857">Sansar</span></td>
        <td align="right" style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#E8A857;font-weight:600">${esc(eyebrow)}</td>
      </tr></table>
      <div style="height:22px;line-height:22px">&nbsp;</div>
      <div style="font-size:28px;line-height:34px;font-weight:700;color:#FFFFFF">${esc(title)}</div>
      <div style="font-size:14px;line-height:20px;color:#F5EDE0;opacity:0.75;padding-top:6px">${esc(subtitle)}</div>
    </td></tr>
    <tr><td style="background:${C.card};border-radius:0 0 20px 20px;padding:8px 28px 28px">
      ${body}
    </td></tr>
    <tr><td align="center" style="padding:18px 12px 0;font-size:12px;line-height:18px;color:${C.muted}">
      Sent automatically by the SakharSansar website.<br>
      Change who receives these in the <a href="${DASHBOARD_URL}" style="color:${C.muted}">admin panel</a> → Settings.
    </td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;
}

function sectionTitle(text: string): string {
  return `<div style="padding:24px 0 10px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.muted};font-weight:600">${esc(text)}</div>`;
}

function amountRow(label: string, value: string, opts: { color?: string; bold?: boolean } = {}): string {
  const weight = opts.bold ? "700" : "400";
  const size = opts.bold ? "18px" : "14px";
  return `<tr>
    <td style="padding:5px 0;font-size:${size};color:${opts.bold ? C.ink : C.muted};font-weight:${weight}">${esc(label)}</td>
    <td align="right" style="padding:5px 0;font-size:${size};color:${opts.color ?? C.ink};font-weight:${weight};white-space:nowrap">${esc(value)}</td>
  </tr>`;
}

function button(href: string, label: string, primary: boolean): string {
  const bg = primary ? C.dark : "#FFFFFF";
  const fg = primary ? "#FFFFFF" : C.ink;
  const border = primary ? C.dark : "#D9CCBA";
  return `<a href="${esc(href)}" style="display:inline-block;background:${bg};color:${fg};border:1px solid ${border};border-radius:12px;padding:11px 18px;font-size:14px;font-weight:600;text-decoration:none;margin:0 8px 8px 0">${esc(label)}</a>`;
}

// ── Orders ────────────────────────────────────────────────────────────

export interface OrderEmail {
  id: string;
  createdAt?: Date;
  customer: string;
  phone: string;
  address: string;
  product: string;
  quantity: number;
  /** What the customer will pay. 0 for a custom order priced on the call. */
  amount: number;
  unitPrice?: number;
  weight?: string | null;
  /** Site-relative path to the product photo, e.g. /products/sakhar-block.jpg */
  image?: string | null;
  subtotal?: number;
  discountCode?: string | null;
  discount?: number;
  freeDelivery?: boolean;
}

export function renderOrderEmail(order: OrderEmail): { subject: string; html: string; text: string } {
  const ref = orderRef(order.id);
  const placed = kathmanduTime(order.createdAt ?? new Date());
  const priced = order.amount > 0;
  const subtotal = order.subtotal || order.amount;
  const discount = order.discountCode && order.discount ? order.discount : 0;
  const delivery = order.freeDelivery ? "Free" : "Quote on the call";
  const imageUrl = order.image ? `${SITE_URL}${order.image}` : null;
  const lineMeta = [
    order.weight,
    order.unitPrice ? `${rs(order.unitPrice)} each` : null,
  ].filter(Boolean).join(" · ");

  const productRow = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${C.line};border-radius:14px">
    <tr>
      ${imageUrl
        ? `<td width="76" style="padding:12px 0 12px 12px;vertical-align:middle"><img src="${esc(imageUrl)}" width="64" height="64" alt="" style="display:block;width:64px;height:64px;border-radius:10px;object-fit:cover;background:${C.bg}"></td>`
        : ""}
      <td style="padding:12px;vertical-align:middle">
        <div style="font-size:15px;font-weight:600;color:${C.ink}">${esc(order.product)}</div>
        ${lineMeta ? `<div style="font-size:13px;color:${C.muted};padding-top:3px">${esc(lineMeta)}</div>` : ""}
      </td>
      <td align="right" style="padding:12px 14px 12px 0;vertical-align:middle;white-space:nowrap">
        <div style="font-size:13px;color:${C.muted}">× ${order.quantity}</div>
        ${priced ? `<div style="font-size:15px;font-weight:600;color:${C.ink};padding-top:3px">${rs(subtotal)}</div>` : ""}
      </td>
    </tr>
  </table>`;

  const totals = priced
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
        ${discount ? amountRow("Subtotal", rs(subtotal)) : ""}
        ${discount ? amountRow(`Discount (${order.discountCode})`, `−${rs(discount)}`, { color: C.green }) : ""}
        ${amountRow("Delivery", delivery, { color: order.freeDelivery ? C.green : C.ink })}
        <tr><td colspan="2" style="padding-top:6px;border-bottom:1px solid ${C.line}"></td></tr>
        ${amountRow("Total to collect", rs(order.amount), { color: C.amber, bold: true })}
      </table>`
    : `<div style="margin-top:12px;padding:12px 14px;background:${C.bg};border-radius:12px;font-size:14px;color:${C.ink}">
        Custom / bulk order: <strong>agree the price on the call.</strong>
      </div>`;

  const wa = whatsappNumber(order.phone);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.address)}`;
  const customer = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};border-radius:14px">
    <tr><td style="padding:16px 16px 4px">
      <div style="font-size:16px;font-weight:600;color:${C.ink}">${esc(order.customer)}</div>
      <div style="padding-top:4px"><a href="tel:${esc(order.phone.replace(/[^\d+]/g, ""))}" style="font-size:15px;color:${C.amber};font-weight:600;text-decoration:none">${esc(order.phone)}</a></div>
      <div style="font-size:14px;line-height:20px;color:${C.ink};padding-top:10px;white-space:pre-line">${esc(order.address)}</div>
      <div style="padding-top:4px"><a href="${esc(mapsUrl)}" style="font-size:13px;color:${C.muted}">Open in Google Maps →</a></div>
    </td></tr>
    <tr><td style="padding:12px 16px 8px">
      ${button(`tel:${order.phone.replace(/[^\d+]/g, "")}`, "Call customer", true)}
      ${wa ? button(`https://wa.me/${wa}`, "WhatsApp", false) : ""}
    </td></tr>
  </table>`;

  const next = `<div style="padding-top:22px;font-size:14px;line-height:21px;color:${C.ink}">
      <strong>Next:</strong> call ${esc(order.customer.split(" ")[0] || "the customer")} to confirm the order${priced && !order.freeDelivery ? " and quote delivery" : ""}, then mark it <em>Confirmed</em> in the dashboard.
    </div>
    <div style="padding-top:16px">${button(DASHBOARD_URL, "Open orders dashboard", true)}</div>`;

  const html = shell({
    preheader: `${priced ? rs(order.amount) : "Custom order"} · ${order.quantity}× ${order.product} · ${order.customer}`,
    eyebrow: "New order",
    title: `Order #${ref}`,
    subtitle: placed,
    body: `${sectionTitle("Order")}${productRow}${totals}${sectionTitle("Deliver to")}${customer}${next}`,
  });

  const text = [
    `New order #${ref} (${placed})`,
    "",
    `${order.quantity} × ${order.product}${lineMeta ? ` (${lineMeta})` : ""}`,
    ...(priced
      ? [
          ...(discount ? [`Subtotal: ${rs(subtotal)}`, `Discount (${order.discountCode}): -${rs(discount)}`] : []),
          `Delivery: ${delivery}`,
          `Total to collect: ${rs(order.amount)}`,
        ]
      : ["Custom / bulk order: agree the price on the call."]),
    "",
    `Customer: ${order.customer}`,
    `Phone: ${order.phone}`,
    `Address: ${order.address}`,
    "",
    `Dashboard: ${DASHBOARD_URL}`,
  ].join("\n");

  const subject = `New order #${ref} · ${priced ? rs(order.amount) : "Custom order"} · ${order.customer}`;
  return { subject, html, text };
}

export async function sendOrderNotification(order: OrderEmail, to?: string[]): Promise<SendResult> {
  return send({ ...renderOrderEmail(order), to });
}

// ── Enquiries ─────────────────────────────────────────────────────────

export interface EnquiryEmail {
  name: string;
  contact: string;
  type: string;
  message: string;
}

export async function sendEnquiryNotification(enquiry: EnquiryEmail): Promise<SendResult> {
  const replyable = looksLikeEmail(enquiry.contact);
  const body = `${sectionTitle("From")}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};border-radius:14px">
      <tr><td style="padding:16px">
        <div style="font-size:16px;font-weight:600;color:${C.ink}">${esc(enquiry.name)}</div>
        <div style="font-size:15px;color:${C.amber};font-weight:600;padding-top:4px">${esc(enquiry.contact)}</div>
      </td></tr>
    </table>
    ${sectionTitle("Message")}
    <div style="font-size:15px;line-height:23px;color:${C.ink};white-space:pre-line">${esc(enquiry.message)}</div>
    <div style="padding-top:22px">${replyable ? `<span style="font-size:13px;color:${C.muted}">Reply to this email to answer ${esc(enquiry.name)} directly.</span>` : button(DASHBOARD_URL, "Open dashboard", true)}</div>`;

  return send({
    subject: `New enquiry (${enquiry.type}) from ${enquiry.name}`,
    html: shell({
      preheader: enquiry.message.slice(0, 120),
      eyebrow: "New enquiry",
      title: enquiry.name,
      subtitle: `${enquiry.type} enquiry · ${kathmanduTime(new Date())}`,
      body,
    }),
    text: `New ${enquiry.type} enquiry\n\nFrom: ${enquiry.name}\nContact: ${enquiry.contact}\n\n${enquiry.message}`,
    replyTo: replyable ? enquiry.contact : undefined,
  });
}
