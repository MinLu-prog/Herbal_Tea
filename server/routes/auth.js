import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
const WEEK = 7 * 24 * 60 * 60 * 1000

// Simple in-memory limit: 5 failed logins per IP per 15 minutes.
const failures = new Map()
const WINDOW = 15 * 60 * 1000

function isBlocked(ip) {
  const entry = failures.get(ip)
  if (!entry || Date.now() - entry.first > WINDOW) return false
  return entry.count >= 5
}

function recordFailure(ip) {
  const entry = failures.get(ip)
  if (!entry || Date.now() - entry.first > WINDOW) failures.set(ip, { count: 1, first: Date.now() })
  else entry.count++
}

router.post('/login', async (request, response) => {
  if (isBlocked(request.ip)) {
    return response.status(429).json({ error: 'Too many attempts. Try again in 15 minutes.' })
  }

  const { username, password } = request.body ?? {}
  const [[admin]] = await db.query('SELECT * FROM admins WHERE username = ?', [username ?? ''])
  if (!admin || !(await bcrypt.compare(String(password ?? ''), admin.password_hash))) {
    recordFailure(request.ip)
    return response.status(401).json({ error: 'Wrong username or password' })
  }

  failures.delete(request.ip)
  const token = jwt.sign({ id: admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '7d' })
  response.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: WEEK,
  })
  response.json({ username: admin.username })
})

router.post('/logout', (_request, response) => {
  response.clearCookie('token')
  response.json({ ok: true })
})

router.get('/me', requireAdmin, (request, response) => {
  response.json({ username: request.admin.username })
})

export default router
