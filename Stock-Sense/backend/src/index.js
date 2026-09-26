require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { initSocket } = require("./socket");
const { errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth.routes");
const submissionRoutes = require("./routes/submission.routes");

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);

app.use(errorHandler);

const httpServer = createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
