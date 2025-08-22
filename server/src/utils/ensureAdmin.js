import Admin from '../models/Admin.js'
import bcrypt from 'bcryptjs'

export default async function ensureAdmin(){
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = (process.env.ADMIN_PASSWORD || '').trim();
 
  if(!email || !password) throw new Error('ADMIN_EMAIL/ADMIN_PASSWORD missing in .env')

  const existing = await Admin.findOne({ email })
  if(existing) return

  const passwordHash = await bcrypt.hash(password, 10)
  await Admin.create({ email, passwordHash })
  console.log(`Seeded admin ${email}`)
}
