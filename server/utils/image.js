import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'
import sharp from 'sharp'

// Don't keep files open (avoids EBUSY when deleting on Windows).
sharp.cache(false)

export const UPLOAD_ROOT = path.resolve('uploads')
const PRODUCT_DIR = path.join(UPLOAD_ROOT, 'products')

// Resize to max 800px wide, convert to WebP, save, and return the public URL.
export async function saveImage(buffer) {
  await fs.mkdir(PRODUCT_DIR, { recursive: true })
  const name = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`
  await sharp(buffer)
    .rotate()
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(path.join(PRODUCT_DIR, name))
  return `/uploads/products/${name}`
}

export async function deleteImage(url) {
  if (!url?.startsWith('/uploads/products/')) return
  try {
    await fs.rm(path.join(PRODUCT_DIR, path.basename(url)), { force: true })
  } catch (error) {
    console.warn('Could not delete image', url, error.message)
  }
}
