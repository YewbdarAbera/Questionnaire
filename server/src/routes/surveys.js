import { Router } from "express";
import Submission from "../models/Submission.js";
import { z } from "zod";

const router = Router();

const childSchema = z.object({
  name: z.string().min(1),
  grade: z.enum(["Elementary", "Middle", "High"]),
  subjects: z
    .array(z.enum(["Math", "Reading/Writing", "Science", "Other"]))
    .min(1),
});

const bodySchema = z.object({
  contact: z.object({
    guardian: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    preferred: z.enum(["email", "phone", "text"]),
  }),
  count: z.number().int().min(0),
  children: z.array(childSchema),
  format: z
    .enum(["in-person", "online", "either"])
    .optional()
    .or(z.literal("")),
  schedule: z.enum(["weekday", "weekend"]).optional().or(z.literal("")),
  days: z.number().int().min(0).max(3).optional(),
  hours: z.number().int().min(0).max(3).optional(),
  goals: z
    .array(z.enum(["improve", "confidence", "test"]))
    .optional()
    .default([]),
});

router.post("/", async (req, res) => {
  try {
    // coerce numbers from strings if needed
    const parsed = bodySchema.parse({
      ...req.body,
      count: Number(req.body?.count ?? 0),
      days: req.body?.days ? Number(req.body.days) : 0,
      hours: req.body?.hours ? Number(req.body.hours) : 0,
    });

    // extra guard: contact must have email OR phone
    if (!parsed.contact.email && !parsed.contact.phone) {
      return res.status(400).json({ error: "Provide email or phone." });
    }

    // sanity check: children length should match count
    if (parsed.children.length !== parsed.count) {
      return res.status(400).json({ error: "Children count mismatch." });
    }

    const doc = await Submission.create(parsed);
    res.status(201).json({ id: doc._id.toString() });
  } catch (err) {
    const msg = err?.errors?.[0]?.message || err?.message || "Invalid data";
    res.status(400).json({ error: msg });
  }
});

// (Optional) quick list endpoint for debugging in Postman
router.get("/", async (_req, res) => {
  const list = await Submission.find().sort({ submittedAt: -1 }).lean();
  res.json(list);
});

export default router;
