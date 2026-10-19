# Mya Nyo Herbal Tea

Mya Nyo Herbal Tea is a Burmese-first online tea shop built with React, Vite,
Express, and MySQL. Customers can browse tea products, switch languages,
open product details, view image galleries, and contact the shop by phone or
Viber. Administrators can manage products, shop settings, About content, and
admin accounts from a protected dashboard.

## Features

### Customer experience

- Burmese-first customer interface with English language switching.
- Responsive mobile, tablet, and desktop layouts.
- Product categories and paginated product cards.
- Product details page with multiple product images, thumbnails, and navigation.
- Product stock indicators and localized product content.
- Smooth navigation from the top bar directly to the All teas area.
- Responsive decorations for the products, About, and Contact sections.
- Mobile-friendly ordering and contact sections.
- Phone and Viber ordering actions.

### Admin dashboard

- Cookie-based admin authentication.
- Burmese and English admin interface.
- Create, edit, hide, restore, and delete products.
- Upload multiple product images.
- Update product names, descriptions, flavors, sizes, prices, categories, and stock.
- Search and filter products by status.
- Edit phone and Viber shop settings.
- Edit English and Myanmar About descriptions.
- Add and delete other admin accounts.
- Change the signed-in administrator's password.
- Prevent deletion of the currently signed-in administrator.

## Technology

- React 19
- Vite 7
- Tailwind CSS 4
- Express 5
- MySQL 8.4
- Node.js 20+
- JWT authentication in an HTTP-only cookie
- Sharp image processing
- Docker Compose support

## Local development

### Requirements

- Node.js 20 or newer
- MySQL 8 or Docker Desktop

### Install dependencies

```bash
npm install
```

### Configure environment variables

Copy `.env.example` to `.env` and set the database and authentication values:

```bash
copy .env.example .env
```

At minimum, configure:

- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

The admin password must be at least 8 characters when creating or changing an
administrator account.

### Start the development app

With MySQL running locally:

```bash
npm run db:seed
npm run dev
```

The development URLs are:

- Customer site: `http://localhost:5173`
- Admin dashboard: `http://localhost:5173/admin`
- API server: `http://localhost:3000`

## Docker deployment

Docker Compose starts MySQL and the production Express/Vite application:

```bash
docker compose up -d --build
```

The application is available at `http://localhost:3000` by default. The
container waits for MySQL health checks, initializes the schema, seeds the
configured administrator, and serves the built frontend and API together.

Persistent Docker volumes are used for:

- MySQL data: `mysql-data`
- Uploaded product images: `uploads-data`

For production deployment:

1. Replace all local/default secrets in `.env`.
2. Use a long random `JWT_SECRET`.
3. Set a strong `DB_PASSWORD` and `ADMIN_PASSWORD`.
4. Configure HTTPS at the hosting provider or reverse proxy.
5. Keep the MySQL and upload volumes backed up.
6. Set the production `APP_PORT` as needed.

## Useful commands

```bash
npm run dev          # Start the Vite frontend and Express API
npm run build        # Create the production frontend build
npm start            # Start the Express production server
npm run db:seed      # Initialize schema and seed configured data
npm audit --omit=dev --audit-level=high
```

## API documentation

See [API.md](./API.md) for public, authentication, product, settings, and
administration endpoints.

## Validation

The current deployment checks include:

- Successful Vite production build.
- Node.js syntax checks for server routes and database seed code.
- Docker Compose configuration validation.
- Public API health, settings, categories, and products smoke checks.
- Admin login, session, and protected product API smoke checks.
- Production dependency audit with no high-severity vulnerabilities.
- Browser checks for Shop navigation, pagination, mobile layout, and decorations.
