import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { sendEnquiryNotification } from "../lib/mailer";
import { EnquiryStatus, EnquiryType, Prisma } from "@prisma/client";

const router = Router();

const VALID_TYPES = new Set<EnquiryType>([
  EnquiryType.B2C,
  EnquiryType.B2B,
  EnquiryType.GIFTING,
  EnquiryType.PARTNERSHIP,
  EnquiryType.OTHER,
]);

const VALID_STATUSES = new Set<EnquiryStatus>([
  EnquiryStatus.NEW,
  EnquiryStatus.READ,
  EnquiryStatus.REPLIED,
  EnquiryStatus.ARCHIVED,
]);

// POST /api/enquiries — public (from the storefront contact form)
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { name, contact, type, message } = req.body ?? {};

  if (!name || !contact || !message) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const safeType: EnquiryType = VALID_TYPES.has(type) ? type : EnquiryType.OTHER;

  const enquiry = await prisma.enquiry.create({
    data: {
      name: String(name).slice(0, 200),
      contact: String(contact).slice(0, 200),
      type: safeType,
      message: String(message).slice(0, 5000),
    },
  });

  // Notify the shop inbox. Fire-and-forget: the mailer never throws.
  void sendEnquiryNotification({
    name: enquiry.name,
    contact: enquiry.contact,
    type: enquiry.type,
    message: enquiry.message,
  });

  res.status(201).json(enquiry);
});

// GET /api/enquiries — protected (dashboard)
router.get("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  const { status, type, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Prisma.EnquiryWhereInput = { deletedAt: null };
  if (status && VALID_STATUSES.has(status as EnquiryStatus)) {
    where.status = status as EnquiryStatus;
  }
  if (type && VALID_TYPES.has(type as EnquiryType)) {
    where.type = type as EnquiryType;
  }

  const [enquiries, total, newCount] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: Number(limit),
    }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.count({ where: { deletedAt: null, status: EnquiryStatus.NEW } }),
  ]);

  res.json({
    enquiries,
    total,
    newCount,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
  });
});

// PATCH /api/enquiries/:id — protected (update status)
router.patch("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { status } = req.body ?? {};

  if (!status || !VALID_STATUSES.has(status as EnquiryStatus)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const enquiry = await prisma.enquiry.update({
    where: { id },
    data: { status: status as EnquiryStatus, updatedBy: req.adminId },
  });

  res.json(enquiry);
});

// DELETE /api/enquiries/:id — soft delete
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.enquiry.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy: req.adminId },
  });
  res.json({ success: true });
});

export default router;
