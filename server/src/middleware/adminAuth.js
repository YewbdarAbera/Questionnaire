// server/src/middleware/adminAuth.js
import { verifyAdminSession } from "../utils/jwt.js";

/**
 * Checks Authorization: Bearer <app JWT> and verifies it.
 * Sets req.admin = { email, name }
 */
export default function adminAuth(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");
    if (!token) return res.status(401).json({ error: "Missing token" });

    const payload = verifyAdminSession(token); // { email, name, iat, exp }
    if (!payload?.email) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.admin = { email: payload.email, name: payload.name || "" };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
}
