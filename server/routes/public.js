import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

router.get('/categories', async (_request, response) => {
  const [rows] = await db.query('SELECT * FROM categories ORDER BY sort_order, id')
  response.json(rows)
})

router.get('/products', async (request, response) => {
  const category = Number(request.query.category)
  const [rows] = category
    ? await db.query('SELECT * FROM products WHERE category_id = ? ORDER BY id DESC', [category])
    : await db.query('SELECT * FROM products ORDER BY id DESC')
  response.json(rows)
})

router.get('/settings', (_request, response) => {
  response.json({
    viber: process.env.SHOP_VIBER || '',
    phone: process.env.SHOP_PHONE || '',
    messenger: process.env.SHOP_MESSENGER || '',
  })
})

export default router
