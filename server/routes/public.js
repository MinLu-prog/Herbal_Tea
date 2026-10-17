import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/categories', async (_request, response) => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY sort_order, id')
  response.json(rows)
})

// Deleted products (is_active = 0) are hidden from visitors.
router.get('/products', async (request, response) => {
  const category = Number(request.query.category)
  const [rows] = category
    ? await db.query('SELECT * FROM products WHERE is_active = 1 AND category_id = ? ORDER BY id DESC', [category])
    : await db.query('SELECT * FROM products WHERE is_active = 1 ORDER BY id DESC')
  response.json(rows)
})

router.get('/products/:id', async (request, response) => {
  const [[product]] = await db.query('SELECT * FROM products WHERE id = ? AND is_active = 1', [request.params.id])
  if (!product) return response.status(404).json({ error: 'Product not found' })
  response.json(product)
})

// Returns { viber, phone, messenger }
router.get('/settings', async (_request, response) => {
  const [rows] = await db.query('SELECT setting_key, setting_value FROM settings')
  response.json(Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value])))
})

export default router
