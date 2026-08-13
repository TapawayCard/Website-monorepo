import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/jwt";

// Augment Express Request with the authenticated user.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const payload = await verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: "Invalid or expired session" });
  }
  req.userId = payload.uid;
  req.userEmail = payload.email;
  next();
}
