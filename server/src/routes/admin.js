// server/src/routes/admin.js
import express from "express";
import { OAuth2Client } from "google-auth-library";
import adminAuth from "../middleware/adminAuth.js";
import { signAdminSession } from "../utils/jwt.js";
import Submission from "../models/Submission.js";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/admin/google-login
router.post("/google-login", async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) return res.status(400).json({ error: "Missing token" });

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = (payload?.email || "").trim().toLowerCase();

    const allowed = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    if (!allowed.includes(email)) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const appToken = signAdminSession({ email, name: payload.name || "" });

    return res.json({
      ok: true,
      token: appToken,
      profile: {
        email,
        name: payload.name || "",
        picture: payload.picture || "",
      },
    });
  } catch (err) {
    console.error("google-login error:", err);
    return res.status(403).json({ error: "Invalid Google token" });
  }
});

// GET /api/admin/submissions
router.get("/submissions", adminAuth, async (req, res) => {
  try {
    const rows = await Submission.aggregate([
      {
        $addFields: {
          emailLower: { $toLower: "$contact.email" },
          phoneNorm: "$contact.phone",
        },
      },
      {
        $group: {
          _id: { email: "$emailLower", phone: "$phoneNorm" },
          parentName: { $last: "$contact.guardianName" },
          email: { $last: "$contact.email" },
          phone: { $last: "$contact.phone" },
          address: { $last: "$contact.address" },
          preferred: { $last: "$contact.preferred" },
          childrenArrays: { $push: "$children" },
          createdAt: { $max: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          parentName: 1,
          email: 1,
          phone: 1,
          address: 1,
          preferred: 1,
          createdAt: 1,
          count: 1,
          children: {
            $reduce: {
              input: "$childrenArrays",
              initialValue: [],
              in: { $concatArrays: ["$$value", "$$this"] },
            },
          },
        },
      },
      { $addFields: { childrenCount: { $size: "$children" } } },
      { $sort: { createdAt: -1 } },
    ]);

    res.json({ ok: true, rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch admin data" });
  }
});

export default router;
