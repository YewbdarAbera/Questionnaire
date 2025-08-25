import { Router } from "express";
import Submission from "../models/Submission.js";
import { submissionSchema } from "../validators/schemas.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const parsed = submissionSchema.parse({
      parent: req.body.parent,
      children: (req.body.children || []).map((c) => ({
        name: c.name,
        age: c.age,
        grade: c.grade,
        subjects: Array.isArray(c.subjects) ? c.subjects : [], // ✅ keep array
      })),
    });
    const doc = await Submission.create(parsed);
    res.status(201).json({ id: doc._id.toString() });
  } catch (err) {
    res
      .status(400)
      .json({ error: err?.errors?.[0]?.message || "Validation failed" });
  }
});

export default router;
