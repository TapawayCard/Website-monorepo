import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { meRouter } from "./routes/me";
import { profilesRouter } from "./routes/profiles";
import { contactRouter } from "./routes/contact";

const app = express();

app.use(express.json({ limit: "1mb" }));

// CORS — only needed if you call the API directly from a browser.
// The Next.js frontend proxies server-side, so this is optional but handy.
const origins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors({
    origin: origins.length ? origins : true,
    credentials: true,
  })
);

// Health check (Railway pings this)
app.get("/", (_req, res) => res.json({ ok: true, service: "tapaway-api" }));
app.get("/health", (_req, res) => res.json({ ok: true }));

app.use("/auth", authRouter);
app.use("/me", meRouter);
app.use("/profiles", profilesRouter);
app.use("/contact", contactRouter);

// 404
app.use((_req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction
  ) => {
    console.error("[error]", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

const port = Number(process.env.PORT) || 4000;
app.listen(port, () => {
  console.log(`TapAway API listening on :${port}`);
});
