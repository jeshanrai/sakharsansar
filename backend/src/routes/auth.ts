import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, admin.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ id: admin.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email } });
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  const admin = await prisma.admin.findUnique({
    where: { id: req.adminId },
    select: { id: true, name: true, email: true },
  });
  if (!admin) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(admin);
});

export default router;
