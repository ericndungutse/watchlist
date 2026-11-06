# Watchlist

A full-stack Next.js application designed to track TV series, available and watched seasons, and statuses (continuing, ended, canceled, unknown).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security:** [bcryptjs](https://github.com/dcodeIO/bcrypt.js) & [jose](https://github.com/panva/jose) (JWT in HTTP-only cookies)

---

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local` and configure a separate MongoDB URI for each environment, plus a JWT secret:

```bash
cp .env.example .env.local
```

Example in `.env.local`:
```env
NODE_ENV=development
MONGODB_URI_DEV=mongodb://localhost:27017/ent-tracker-dev
MONGODB_URI_PROD=mongodb://localhost:27017/ent-tracker-prod
JWT_SECRET=your-secret-key-32-chars-long
```

The application selects `MONGODB_URI_DEV` when `NODE_ENV=development` and
`MONGODB_URI_PROD` when `NODE_ENV=production`. Next.js sets `NODE_ENV` for its
development and production commands; production deployments must provide
`MONGODB_URI_PROD`. The CLI seed command loads `.env.local` and uses the same
environment selection.

### 2. Run Local MongoDB (Optional via Docker)

```bash
docker compose up -d
```
- MongoDB runs on port `27017`
- Mongo Express web UI runs on [http://localhost:8081](http://localhost:8081)

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Seed 35 TV Series

Seed the predefined TV series into the database selected by `NODE_ENV` with
`npm run seed`. The script requires the matching URI and does not fall back to
another database.

---

## API Routes

### Authentication
- `POST /api/auth/signup` — Create user account & set session cookie
- `POST /api/auth/login` — Sign in with email & password, set HTTP-only cookie
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Check active session claims

### TV Series Tracking
- `GET /api/series?status=all|continuing|ended|canceled|unknown&search=...` — Retrieve series and library statistics
- `POST /api/series` — Add a new series to watchlist
- `PUT /api/series/:id` — Update season progress, status, or notes
- `DELETE /api/series/:id` — Delete a series from watchlist
- `POST /api/series/seed` — Bulk upsert the user's 35 TV shows

---

## Project Structure

```text
ent-tracker/
├── docker-compose.yml           # Local MongoDB & Mongo Express containers
├── scripts/
│   └── seed.mjs                 # CLI script to seed TV series into MongoDB
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts
│   │   │   │   ├── logout/route.ts
│   │   │   │   ├── me/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── series/
│   │   │   │   ├── [id]/route.ts
│   │   │   │   ├── seed/route.ts
│   │   │   │   └── route.ts
│   │   │   └── health/route.ts
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── LandingHero.tsx
│   │   ├── LogoutButton.tsx
│   │   ├── MainContent.tsx
│   │   ├── SeriesDashboard.tsx  # Full tracking UI (KPIs, search, filters, modals)
│   │   └── UserSessionNav.tsx
│   ├── lib/
│   │   ├── auth.ts              # JWT & session cookie helpers
│   │   ├── initialSeriesData.ts # Digitalized catalog of 35 TV series
│   │   └── mongodb.ts           # Cached Mongoose connection helper
│   └── models/
│       ├── Series.ts            # Mongoose Series schema with userId index
│       └── User.ts              # Mongoose User schema with bcrypt
└── README.md
```

---

## Available Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Compiles production build.
- `npm run start` — Runs production server.
- `npm run lint` — Runs ESLint checks.
- `npm run seed` — Populates database with the 35 TV shows for registered users.
