import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import expenseRoutes from "./routes/expenses";
import dashboardRoutes from "./routes/dashboard";
import salesRoutes from "./routes/sales";
import { seedDatabase } from "./lib/seed";

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS ──────────────────────────────────────────────────────────────
// Allow the production frontend, all Vercel preview deploys, and localhost.
// Extra origins can be added via CORS_ORIGINS env (comma-separated).
const STATIC_ALLOWED = [
  "https://sakharsansar.vercel.app",
  "https://sakharsansar.com",
  "https://www.sakharsansar.com",
  "http://localhost:3000",
  "http://localhost:3001",
];
const envAllowed = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = new Set([...STATIC_ALLOWED, ...envAllowed]);
// Matches any Vercel preview deploy URL for this project (e.g. sakharsansar-abc123.vercel.app)
const VERCEL_PREVIEW = /^https:\/\/sakharsansar-[a-z0-9-]+\.vercel\.app$/;

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Allow same-origin / curl / mobile apps (no Origin header)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.has(origin) || VERCEL_PREVIEW.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin not allowed → ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400, // cache preflight 24h
};

// cors() responds to OPTIONS preflight automatically because it short-circuits
// when req.method === "OPTIONS". No separate app.options() handler needed.
app.use(cors(corsOptions));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sales", salesRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// ── Startup ──────────────────────────────────────────────────────────
// Validate critical env vars early so failures are obvious in the logs
// instead of cascading into Prisma's stack traces.
const dbUrl = process.env.DATABASE_URL ?? "";
if (!dbUrl) {
  console.error("✖ DATABASE_URL is not set. Set it in your hosting env.");
} else if (!/^(postgres(ql)?:\/\/)/.test(dbUrl)) {
  console.error(
    "✖ DATABASE_URL is set but does not start with 'postgresql://' or 'postgres://'. " +
      "Check the value in your hosting environment.",
  );
}

app.listen(PORT, async () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  // Seed must never crash the server. If the DB isn't reachable yet,
  // log it and keep serving — health/CORS still work, the API will
  // surface a clean error per request.
  try {
    await seedDatabase();
  } catch (err) {
    console.error("⚠ seedDatabase failed — continuing without seed:");
    console.error(err instanceof Error ? err.message : err);
  }
});
