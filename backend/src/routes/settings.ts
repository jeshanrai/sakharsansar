import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { getNotificationEmails, setNotificationEmails, isEmail, MAX_NOTIFY_EMAILS } from "../lib/settings";
import { MAIL_FROM, mailConfigured, sendOrderNotification } from "../lib/mailer";

const router = Router();
router.use(requireAuth);

// GET /api/settings/notifications — who gets order emails, and whether sending is set up
router.get("/notifications", async (_req: AuthRequest, res: Response): Promise<void> => {
  const { emails, source } = await getNotificationEmails();
  res.json({ emails, source, from: MAIL_FROM, configured: mailConfigured, max: MAX_NOTIFY_EMAILS });
});

// PUT /api/settings/notifications — replace the list
router.put("/notifications", async (req: AuthRequest, res: Response): Promise<void> => {
  const raw: unknown = req.body?.emails;
  if (!Array.isArray(raw) || raw.some((e) => typeof e !== "string")) {
    res.status(400).json({ error: "emails must be a list of addresses" });
    return;
  }
  const bad = (raw as string[]).filter((e) => !isEmail(e));
  if (bad.length) {
    res.status(400).json({ error: `Not a valid email: ${bad.join(", ")}` });
    return;
  }
  if (raw.length > MAX_NOTIFY_EMAILS) {
    res.status(400).json({ error: `At most ${MAX_NOTIFY_EMAILS} addresses` });
    return;
  }
  try {
    const emails = await setNotificationEmails(raw as string[], req.adminId);
    res.json({ emails, source: "settings" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Could not save. If this is a new deploy, run `npx prisma migrate deploy` on the backend.",
    });
  }
});

// POST /api/settings/notifications/test — send a sample order email now
router.post("/notifications/test", async (req: AuthRequest, res: Response): Promise<void> => {
  // Test the list on screen if one is sent, so it can be checked before saving.
  const draft: unknown = req.body?.emails;
  const to = Array.isArray(draft) ? (draft as unknown[]).filter((e): e is string => typeof e === "string" && isEmail(e)) : undefined;

  const result = await sendOrderNotification(
    {
      id: "test00sample",
      customer: "Test Customer",
      phone: "9800000000",
      address: "Kapan, Kathmandu\n(This is a test email from Settings — no order was placed.)",
      product: "Sankhuwasabha Sakhar Block",
      quantity: 5,
      unitPrice: 400,
      weight: "1kg",
      image: "/products/sakhar-block.jpg",
      subtotal: 2000,
      discountCode: "SAKHAR10",
      discount: 200,
      amount: 1800,
      freeDelivery: true,
    },
    to && to.length ? to : undefined,
  );
  if (result.ok) res.json({ ok: true });
  else res.status(502).json({ ok: false, error: result.error });
});

export default router;
