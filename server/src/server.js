import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import surveyRoutes from './routes/surveys.js'
import adminRoutes from './routes/admin.js'
import ensureAdmin from './utils/ensureAdmin.js'

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/surveys', surveyRoutes)
app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 4000

connectDB().then(async () => {
  await ensureAdmin()
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
}).catch(err => {
  console.error('Failed to start server', err)
  process.exit(1)
})
