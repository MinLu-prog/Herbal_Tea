import { Router } from 'express'
import { db } from '../db.js'

const router = Router()

async function attachImages(products) {
  const list = Array.isArray(products) ? products : [products]
  if (list.length === 0) return Array.isArray(products) ? [] : null
  const ids = list.map((product) => product.id)
  const [images] = await db.query(
    'SELECT product_id, image_url FROM product_images WHERE product_id IN (?) ORDER BY sort_order, id',
    [ids],
  )
  const byProduct = new Map(ids.map((id) => [id, []]))
  images.forEach((image) => byProduct.get(image.product_id)?.push(image.image_url))
  return Array.isArray(products)
    ? list.map((product) => ({ ...product, images: byProduct.get(product.id)?.length ? byProduct.get(product.id) : [product.image_url].filter(Boolean) }))
    : { ...list[0], images: byProduct.get(list[0].id)?.length ? byProduct.get(list[0].id) : [list[0].image_url].filter(Boolean) }
}

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
  response.json(await attachImages(rows))
})

router.get('/products/:id', async (request, response) => {
  const [[product]] = await db.query('SELECT * FROM products WHERE id = ? AND is_active = 1', [request.params.id])
  if (!product) return response.status(404).json({ error: 'Product not found' })
  response.json(await attachImages(product))
})

// Returns the contact settings used by the customer site.
router.get('/settings', async (_request, response) => {
  const [rows] = await db.query('SELECT setting_key, setting_value FROM settings')
  response.json(Object.fromEntries(rows
    .filter((row) => row.setting_key !== 'messenger')
    .map((row) => [row.setting_key, row.setting_value])))
})

export default router
