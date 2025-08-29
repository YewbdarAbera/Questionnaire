import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { loginSchema } from "../validators/schemas.js";
import { OAuth2Client } from "google-auth-library";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_OAUTH_CLIENT_ID);

// ---- Existing email/password login (you can keep or delete) ----
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: admin._id.toString(), role: "admin", email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err?.errors?.[0]?.message || "Bad request" });
  }
});

// ---- NEW: Google Sign-In ----
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body; // Google ID token from client
    if (!credential)
      return res.status(400).json({ error: "Missing credential" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_OAUTH_CLIENT_ID,
    });
    const payload = ticket.getPayload() || {};
    const email = (payload.email || "").toLowerCase();
    if (!email) return res.status(400).json({ error: "Invalid Google token" });
    console.log("Google login attempt:", payload.email);
    const allow = (process.env.ADMIN_ALLOWLIST || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (!allow.includes(email))
      return res.status(403).json({ error: "Not authorized" });

    // Issue our own JWT for API access
    const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });
    res.json({ token, email, name: payload.name, picture: payload.picture });
  } catch (err) {
    console.error("Google auth error", err);
    res.status(401).json({ error: "Google sign-in failed" });
  }
});

export default router;
