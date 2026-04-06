import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import orderRoutes from "./routes/orders";
import expenseRoutes from "./routes/expenses";
import dashboardRoutes from "./routes/dashboard";
import { seedDatabase } from "./lib/seed";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ["http://localhost:3000", "http://localhost:3001"], credentials: true }));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, async () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  await seedDatabase();
});
