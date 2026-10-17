# Mya Nyo Tea — API

Base URL: `http://localhost:3000` (local) · your domain on Z.com (production)

- All requests and responses are JSON, except product create/edit, which use **form-data** so an image can be attached.
- Errors always look like `{ "error": "message" }`.
- **Admin** routes need you to log in first. Login sets a `token` cookie (valid 7 days), and the browser or Postman sends it automatically.

| Status | Meaning |
|---|---|
| 200 / 201 | OK / Created |
| 400 | Invalid input (message explains) |
| 401 | Not logged in |
| 404 | Not found |
| 429 | Too many failed logins (wait 15 min) |

---

## Public (no login)

### `GET /api/categories`
All categories, in display order.
```json
[{ "id": 1, "name_en": "Herbal Tea", "name_mm": "ဆေးဖက်ဝင်လက်ဖက်ရည်", "sort_order": 1 }]
```

### `GET /api/products`
Products visible on the site (deleted ones are hidden). Newest first.

| Query | Example | |
|---|---|---|
| `category` | `?category=1` | optional, filter by category id |

```json
[{
  "id": 1, "category_id": 1,
  "name_en": "Ginger Tea", "name_mm": "ချင်းလက်ဖက်ရည်",
  "flavor_en": "Ginger", "flavor_mm": "ချင်း",
  "description_en": "Warming ginger blend", "description_mm": "ချင်းအရသာ",
  "size": "200g", "price": 5000,
  "in_stock": 1, "is_active": 1,
  "image_url": "/uploads/products/1729-ab12cd34.webp",
  "created_at": "...", "updated_at": "..."
}]
```
- `in_stock`: `1` = IN STOCK, `0` = OUT OF STOCK
- `image_url` is a path. Show it with `<img src={image_url}>` on the same domain.
- Each item has both `_en` and `_mm` fields; the frontend picks one by language.

### `GET /api/products/:id`
One product (same shape as above). `404` if it doesn't exist or was deleted.

### `GET /api/settings`
Shop contacts for the order buttons.
```json
{ "viber": "+959000000000", "phone": "+959000000000", "messenger": "https://m.me/yourpage" }
```
Order links are built on the frontend:
`tel:{phone}` · `viber://chat?number={encoded viber}` · `{messenger}`

---

## Auth

### `POST /api/auth/login`
```json
{ "username": "admin", "password": "admin123" }
```
→ `200 { "username": "admin" }` and sets the login cookie.
`401` wrong username/password · `429` after 5 failed tries (15 min).

### `POST /api/auth/logout`
Clears the cookie → `{ "ok": true }`

### `GET /api/auth/me`
→ `{ "username": "admin" }` if logged in, otherwise `401`. Use it to check the admin page session.

---

## Admin — Products (login required)

### `GET /api/admin/products`
All products **including deleted** (`is_active: 0`), so they can be restored.

### `POST /api/admin/products`
Create a product. Body: **form-data**.

| Field | Required | Notes |
|---|---|---|
| `name_en`, `name_mm` | yes | |
| `price` | yes | positive whole number (MMK) |
| `category_id` | | category id |
| `flavor_en`, `flavor_mm` | | |
| `description_en`, `description_mm` | | |
| `size` | | e.g. `200g` |
| `in_stock` | | `1` / `0` (default `1`) |
| `image` | | file: JPG / PNG / WebP, max 5MB. Saved as an 800px WebP |

→ `201` with the new product.

### `PUT /api/admin/products/:id`
Edit a product. Send **only the fields you want to change** (form-data, or JSON when no image).
- Change price only: `{ "price": 5500 }`
- New `image` file replaces the old one (old file is deleted).

→ `200` with the updated product.

### `PATCH /api/admin/products/:id/stock`
```json
{ "in_stock": false }
```
→ product with the new `in_stock`.

### `DELETE /api/admin/products/:id`
Soft delete: hides the product from the site and keeps it (and its image) so it can be restored.
→ `{ "ok": true }`

### `DELETE /api/admin/products/:id?permanent=1`
Deletes the product **and its image file** for good. Cannot be undone.

### `PATCH /api/admin/products/:id/restore`
Brings a deleted product back on the site.

---

## Admin — Categories (login required)

### `POST /api/admin/categories`
```json
{ "name_en": "Herbal Tea", "name_mm": "ဆေးဖက်ဝင်လက်ဖက်ရည်", "sort_order": 1 }
```
`name_en`, `name_mm` required → `201` with the new category.

### `PUT /api/admin/categories/:id`
Send any of `name_en`, `name_mm`, `sort_order` → `{ "ok": true }`

### `DELETE /api/admin/categories/:id`
→ `{ "ok": true }`. Its products stay, with `category_id` set to `null`.

---

## Admin — Settings (login required)

### `PUT /api/admin/settings`
Send any of `viber`, `phone`, `messenger`; other keys are ignored.
```json
{ "viber": "+959111222333" }
```
→ `{ "viber": "+959111222333" }`

---

## Images
Uploaded images are served at `/uploads/products/<file>.webp` (cached 30 days). They live in the `uploads/` folder on the server; back it up together with the database.
