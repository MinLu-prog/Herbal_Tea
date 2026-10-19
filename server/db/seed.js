// Creates the tables, the first admin, and sample categories.
// Run once: npm run db:seed
import fs from 'node:fs/promises'
import bcrypt from 'bcryptjs'
import { db } from '../db.js'

const MAX_CONNECTION_ATTEMPTS = 30
const CONNECTION_RETRY_DELAY = 2000

async function waitForDatabase() {
  let lastError
  for (let attempt = 1; attempt <= MAX_CONNECTION_ATTEMPTS; attempt++) {
    try {
      await db.query('SELECT 1')
      return
    } catch (error) {
      lastError = error
      if (attempt < MAX_CONNECTION_ATTEMPTS) {
        console.warn(`Database is not ready; retrying in ${CONNECTION_RETRY_DELAY / 1000}s (${attempt}/${MAX_CONNECTION_ATTEMPTS})`)
        await new Promise((resolve) => setTimeout(resolve, CONNECTION_RETRY_DELAY))
      }
    }
  }
  throw lastError
}

await waitForDatabase()

const schema = (await fs.readFile(new URL('./schema.sql', import.meta.url), 'utf8'))
  .replace(/--.*$/gm, '') // drop SQL comments
for (const statement of schema.split(';').map((s) => s.trim())) {
  if (statement) await db.query(statement)
}

await db.query(`
  INSERT INTO product_images (product_id, image_url, sort_order)
  SELECT id, image_url, 0
  FROM products
  WHERE image_url IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM product_images
      WHERE product_images.product_id = products.id
    )
`)

const mockData = (await fs.readFile(new URL('./mock-data.sql', import.meta.url), 'utf8'))
  .replace(/--.*$/gm, '')
for (const statement of mockData.split(';').map((s) => s.trim())) {
  if (statement) await db.query(statement)
}

const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env
if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
  throw new Error('Set ADMIN_USERNAME and ADMIN_PASSWORD in .env')
}
const hash = await bcrypt.hash(ADMIN_PASSWORD, 10)
await db.query(
  'INSERT INTO admins (username, password_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)',
  [ADMIN_USERNAME, hash],
)

const [[{ count }]] = await db.query('SELECT COUNT(*) AS count FROM categories')
if (count === 0) {
  await db.query(
    'INSERT INTO categories (name_en, name_mm, sort_order) VALUES ?',
    [[
      ['Herbal Tea', 'ဆေးဖက်ဝင်လက်ဖက်ရည်', 1],
      ['Green Tea', 'လက်ဖက်စိမ်း', 2],
      ['Tea Bags', 'လက်ဖက်ရည်အိတ်', 3],
    ]],
  )
}

// Initial contacts from .env; after this the admin edits them in the panel.
await db.query(
  'INSERT IGNORE INTO settings (setting_key, setting_value) VALUES ?',
  [[
    ['viber', process.env.SHOP_VIBER || ''],
    ['phone', process.env.SHOP_PHONE || ''],
  ]],
)
await db.query('DELETE FROM settings WHERE setting_key = ?', ['messenger'])

console.log('Database ready. Admin:', ADMIN_USERNAME)
await db.end()
