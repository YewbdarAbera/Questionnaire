import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import Submission from '../models/Submission.js'
import { buildWorkbook } from '../utils/excel.js'
import * as XLSX from 'xlsx'

const router = Router()

router.get('/export', requireAdmin, async (_req, res) => {
  const submissions = await Submission.find().sort({ submittedAt: -1 }).lean()
  const wb = buildWorkbook(submissions)
  const fileName = `survey_export_${new Date().toISOString().slice(0,10)}.xlsx`
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' })
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)
  res.send(buf)
})

export default router
