import { Router } from 'express'
import Submission from '../models/Submission.js'
import { submissionSchema } from '../validators/schemas.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

router.post('/', async (req, res) => {
  try {
    const parsed = submissionSchema.parse({
      parent: req.body.parent,
      children: (req.body.children || []).map(c => ({ ...c, age: Number(c.age) }))
    })
    const doc = await Submission.create(parsed)
    res.status(201).json({ id: doc._id.toString() })
  } catch(err){
    res.status(400).json({ error: err?.errors?.[0]?.message || 'Validation failed' })
  }
})

router.get('/', requireAdmin, async (_req, res) => {
  const list = await Submission.find().sort({ submittedAt: -1 }).lean()
  res.json(list)
})

export default router
