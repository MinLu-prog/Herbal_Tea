import 'dotenv/config'
import path from 'node:path'
import express from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import publicRoutes from './routes/public.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import { UPLOAD_ROOT } from './utils/image.js'

if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is missing in .env')

const app = express()
const port = Number(process.env.PORT) || 3000

app.set('trust proxy', 1)
// Security headers; CSP off so images, fonts and order links keep working.
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json())
app.use(cookieParser())

// Product images (unique file names, so they can be cached for a long time)
app.use('/uploads', express.static(UPLOAD_ROOT, { maxAge: '30d' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', message: 'Express API is connected.' })
})
app.use('/api', publicRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api', (_request, response) => response.status(404).json({ error: 'Not found' }))

// In production, serve the built React app from the same server.
if (process.env.NODE_ENV === 'production') {
  const dist = path.resolve('dist')
  app.use(express.static(dist))
  app.get('/{*splat}', (_request, response) => response.sendFile(path.join(dist, 'index.html')))
}

app.use((error, _request, response, _next) => {
  const status = error.status || (error.code === 'LIMIT_FILE_SIZE' ? 400 : 500)
  if (status === 500) console.error(error)
  response.status(status).json({ error: status === 500 ? 'Server error' : error.message })
})

app.listen(port, () => {
  console.log(`Express API listening on http://localhost:${port}`)
})
