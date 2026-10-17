import jwt from 'jsonwebtoken'
import { db } from '../db.js'

// Valid token AND the admin still exists (a deleted admin is logged out right away).
export async function requireAdmin(request, response, next) {
  let payload
  try {
    payload = jwt.verify(request.cookies.token, process.env.JWT_SECRET)
  } catch {
    return response.status(401).json({ error: 'Please log in' })
  }

  const [[admin]] = await db.query('SELECT id, username FROM admins WHERE id = ?', [payload.id])
  if (!admin) return response.status(401).json({ error: 'Please log in' })
  request.admin = admin
  next()
}
