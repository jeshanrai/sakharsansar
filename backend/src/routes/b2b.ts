import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";
import { B2BType, Prisma } from "@prisma/client";

const router = Router();

// All B2B routes are protected
router.use(requireAuth);

const VALID_TYPES = new Set<B2BType>([
  B2BType.RETAILER,
  B2BType.WHOLESALER,
  B2BType.DISTRIBUTOR,
  B2BType.CAFE_RESTAURANT,
  B2BType.SUPERMARKET,
  B2BType.OTHER,
]);

// Trim a string field, returning null when empty so optional fields stay clean.
const clean = (v: unknown): string | null => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
};

// GET /api/b2b — list with search + type filter + pagination, plus directory-wide KPI stats
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { type, search, page = "1", limit = "20" } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const where: Prisma.B2BClientWhereInput = { deletedAt: null };
  if (type && VALID_TYPES.has(type as B2BType)) {
    where.type = type as B2BType;
  }
  if (search && typeof search === "string" && search.trim()) {
    const q = search.trim();
    where.OR = [
      { shopName: { contains: q, mode: "insensitive" } },
      { contactPerson: { contains: q, mode: "insensitive" } },
      { address: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
    ];
  }

  // KPI cards reflect the whole directory, independent of the current filter/page.
  const statsWhere: Prisma.B2BClientWhereInput = { deletedAt: null };

  const [clients, total, totalAll, retailers, wholesale, pinned] = await Promise.all([
    prisma.b2BClient.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: Number(limit) }),
    prisma.b2BClient.count({ where }),
    prisma.b2BClient.count({ where: statsWhere }),
    prisma.b2BClient.count({ where: { ...statsWhere, type: B2BType.RETAILER } }),
    prisma.b2BClient.count({
      where: { ...statsWhere, type: { in: [B2BType.WHOLESALER, B2BType.DISTRIBUTOR] } },
    }),
    prisma.b2BClient.count({ where: { ...statsWhere, NOT: { mapUrl: null } } }),
  ]);

  res.json({
    clients,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / Number(limit)),
    stats: { total: totalAll, retailers, wholesale, pinned },
  });
});

// POST /api/b2b
router.post("/", async (req: AuthRequest, res: Response): Promise<void> => {
  const { shopName, contactPerson, phone, altPhone, email, type, address, mapUrl, notes } = req.body ?? {};

  if (!shopName || !String(shopName).trim() || !phone || !String(phone).trim() || !address || !String(address).trim()) {
    res.status(400).json({ error: "Shop name, phone, and address are required" });
    return;
  }

  const safeType: B2BType = VALID_TYPES.has(type) ? type : B2BType.RETAILER;

  const client = await prisma.b2BClient.create({
    data: {
      shopName: String(shopName).trim(),
      contactPerson: clean(contactPerson),
      phone: String(phone).trim(),
      altPhone: clean(altPhone),
      email: clean(email),
      type: safeType,
      address: String(address).trim(),
      mapUrl: clean(mapUrl),
      notes: clean(notes),
      createdBy: req.adminId,
    },
  });

  res.status(201).json(client);
});

// PATCH /api/b2b/:id
router.patch("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { shopName, contactPerson, phone, altPhone, email, type, address, mapUrl, notes } = req.body ?? {};

  const data: Record<string, unknown> = { updatedBy: req.adminId };
  if (shopName !== undefined) data.shopName = String(shopName).trim();
  if (contactPerson !== undefined) data.contactPerson = clean(contactPerson);
  if (phone !== undefined) data.phone = String(phone).trim();
  if (altPhone !== undefined) data.altPhone = clean(altPhone);
  if (email !== undefined) data.email = clean(email);
  if (type !== undefined && VALID_TYPES.has(type as B2BType)) data.type = type as B2BType;
  if (address !== undefined) data.address = String(address).trim();
  if (mapUrl !== undefined) data.mapUrl = clean(mapUrl);
  if (notes !== undefined) data.notes = clean(notes);

  const client = await prisma.b2BClient.update({ where: { id }, data });

  res.json(client);
});

// DELETE /api/b2b/:id — soft delete
router.delete("/:id", async (req: AuthRequest, res: Response): Promise<void> => {
  const id = req.params.id as string;
  await prisma.b2BClient.update({
    where: { id },
    data: { deletedAt: new Date(), deletedBy: req.adminId },
  });
  res.json({ success: true });
});

export default router;
