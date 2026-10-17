import { Router } from 'express'
import { db } from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { upload } from '../middleware/upload.js'
import { saveImage, deleteImage } from '../utils/image.js'

const router = Router()
router.use(requireAdmin)

const PRODUCT_FIELDS = [
  'category_id', 'name_en', 'name_mm', 'flavor_en', 'flavor_mm',
  'description_en', 'description_mm', 'size', 'price', 'in_stock',
]
const CATEGORY_FIELDS = ['name_en', 'name_mm', 'sort_order']
const SETTING_KEYS = ['viber', 'phone', 'messenger']

function badRequest(message) {
  const error = new Error(message)
  error.status = 400
  return error
}

// Pick only allowed fields from the body and clean up form values (they arrive as strings).
function productData(body, isNew) {
  const data = {}
  for (const field of PRODUCT_FIELDS) {
    if (body[field] === undefined) continue
    const value = typeof body[field] === 'string' ? body[field].trim() : body[field]
    data[field] = value === '' ? null : value
  }

  if ('category_id' in data && data.category_id !== null) data.category_id = Number(data.category_id)
  if ('in_stock' in data) data.in_stock = [true, 1, '1', 'true'].includes(data.in_stock) ? 1 : 0
  if ('price' in data) {
    data.price = Number(data.price)
    if (!Number.isInteger(data.price) || data.price <= 0) throw badRequest('Price must be a positive whole number')
  }

  for (const field of ['name_en', 'name_mm', 'price']) {
    if ((isNew || field in data) && !data[field]) throw badRequest(`${field} is required`)
  }
  return data
}

async function findProduct(id) {
  const [[product]] = await db.query('SELECT * FROM products WHERE id = ?', [id])
  if (!product) {
    const error = new Error('Product not found')
    error.status = 404
    throw error
  }
  return product
}

// ---------- Products ----------

// Includes deleted products (is_active = 0) so the admin can restore them.
router.get('/products', async (_request, response) => {
  const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC')
  response.json(rows)
})

router.post('/products', upload.single('image'), async (request, response) => {
  const data = productData(request.body ?? {}, true)
  if (request.file) data.image_url = await saveImage(request.file.buffer)

  try {
    const [result] = await db.query('INSERT INTO products SET ?', [data])
    response.status(201).json(await findProduct(result.insertId))
  } catch (error) {
    await deleteImage(data.image_url)
    throw error
  }
})

// Edit any fields (e.g. only { price }) and optionally replace the image.
router.put('/products/:id', upload.single('image'), async (request, response) => {
  const product = await findProduct(request.params.id)
  const data = productData(request.body ?? {}, false)
  if (request.file) data.image_url = await saveImage(request.file.buffer)

  if (Object.keys(data).length > 0) {
    await db.query('UPDATE products SET ? WHERE id = ?', [data, product.id])
  }
  if (request.file) await deleteImage(product.image_url)
  response.json(await findProduct(product.id))
})

router.patch('/products/:id/stock', async (request, response) => {
  const product = await findProduct(request.params.id)
  const inStock = [true, 1, '1', 'true'].includes(request.body?.in_stock) ? 1 : 0
  await db.query('UPDATE products SET in_stock = ? WHERE id = ?', [inStock, product.id])
  response.json({ ...product, in_stock: inStock })
})

// Soft delete: hides the product from visitors. Use ?permanent=1 to remove it and its image for good.
router.delete('/products/:id', async (request, response) => {
  const product = await findProduct(request.params.id)
  if (request.query.permanent === '1') {
    await db.query('DELETE FROM products WHERE id = ?', [product.id])
    await deleteImage(product.image_url)
  } else {
    await db.query('UPDATE products SET is_active = 0 WHERE id = ?', [product.id])
  }
  response.json({ ok: true })
})

router.patch('/products/:id/restore', async (request, response) => {
  const product = await findProduct(request.params.id)
  await db.query('UPDATE products SET is_active = 1 WHERE id = ?', [product.id])
  response.json({ ...product, is_active: 1 })
})

// ---------- Categories ----------

function categoryData(body) {
  const data = {}
  for (const field of CATEGORY_FIELDS) {
    if (body?.[field] !== undefined) data[field] = body[field]
  }
  if ('sort_order' in data) data.sort_order = Number(data.sort_order) || 0
  return data
}

router.post('/categories', async (request, response) => {
  const data = categoryData(request.body)
  if (!data.name_en || !data.name_mm) throw badRequest('name_en and name_mm are required')
  const [result] = await db.query('INSERT INTO categories SET ?', [data])
  response.status(201).json({ id: result.insertId, sort_order: 0, ...data })
})

router.put('/categories/:id', async (request, response) => {
  const data = categoryData(request.body)
  if (Object.keys(data).length === 0) throw badRequest('Nothing to update')
  const [result] = await db.query('UPDATE categories SET ? WHERE id = ?', [data, request.params.id])
  if (result.affectedRows === 0) return response.status(404).json({ error: 'Category not found' })
  response.json({ ok: true })
})

// Products in a deleted category stay, with category_id set to NULL.
router.delete('/categories/:id', async (request, response) => {
  await db.query('DELETE FROM categories WHERE id = ?', [request.params.id])
  response.json({ ok: true })
})

// ---------- Settings (shop contacts) ----------

// Body: any of { viber, phone, messenger }
router.put('/settings', async (request, response) => {
  const rows = SETTING_KEYS
    .filter((key) => typeof request.body?.[key] === 'string')
    .map((key) => [key, request.body[key].trim()])
  if (rows.length === 0) throw badRequest('Nothing to update')
  await db.query(
    'INSERT INTO settings (setting_key, setting_value) VALUES ? ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
    [rows],
  )
  response.json(Object.fromEntries(rows))
})

export default router
