require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { ZodError } = require("zod");
const { createServer } = require("http");
const { initSocket } = require("./socket");
const { errorHandler } = require("./middleware/errorHandler");

// ── Route imports ──────────────────────────────────────────────────────────
const authRoutes          = require("./routes/auth.routes");
const submissionRoutes    = require("./routes/submission.routes");
const productsRoutes      = require("./routes/products.routes");
const categoriesRoutes    = require("./routes/categories.routes");
const warehousesRoutes    = require("./routes/warehouses.routes");
const locationsRoutes     = require("./routes/locations.routes");
const suppliersRoutes     = require("./routes/suppliers.routes");
const operationsRoutes    = require("./routes/operations.routes");
const stockMovesRoutes    = require("./routes/stockmoves.routes");
const stockQtysRoutes     = require("./routes/stockquantities.routes");
const dashboardRoutes     = require("./routes/dashboard.routes");

const app = express();

// ── Global Middleware ──────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ── Health Check ───────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// ── Default Route ──────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.status(200).json({ success: true, message: "StockSense API is running" });
});

// ── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth",             authRoutes);
app.use("/api/submissions",      submissionRoutes);
app.use("/api/products",         productsRoutes);
app.use("/api/categories",       categoriesRoutes);
app.use("/api/warehouses",       warehousesRoutes);
app.use("/api/locations",        locationsRoutes);
app.use("/api/suppliers",        suppliersRoutes);
app.use("/api/operations",       operationsRoutes);
app.use("/api/stock-moves",      stockMovesRoutes);
app.use("/api/stock-quantities", stockQtysRoutes);
app.use("/api/dashboard",        dashboardRoutes);

// ── Zod Validation Error Handler ───────────────────────────────────────────
app.use((err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: err.errors.map((e) => ({ field: e.path.join("."), message: e.message })),
    });
  }
  next(err);
});

// ── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler);

// ── Server + Socket.IO ─────────────────────────────────────────────────────
const httpServer = createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () =>
  console.log(`✅ StockSense API running on http://localhost:${PORT}`)
);
