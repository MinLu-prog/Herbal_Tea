import jwt from 'jsonwebtoken'

export function requireAdmin(request, response, next) {
  try {
    request.admin = jwt.verify(request.cookies.token, process.env.JWT_SECRET)
    next()
  } catch {
    response.status(401).json({ error: 'Please log in' })
  }
}
