import multer from 'multer'

const allowed = ['image/jpeg', 'image/png', 'image/webp']

// Keep the file in memory; utils/image.js resizes it before saving to disk.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, done) => {
    if (allowed.includes(file.mimetype)) return done(null, true)
    const error = new Error('Only JPG, PNG or WebP images are allowed')
    error.status = 400
    done(error)
  },
})
