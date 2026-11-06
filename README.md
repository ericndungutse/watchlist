# EntTracker

A full-stack Next.js application designed to track TV series, watched seasons, and statuses (continuing, ended, canceled).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)

---

## Getting Started

### 1. Environment Setup

Copy `.env.example` to `.env.local` and configure your MongoDB connection URI:

```bash
cp .env.example .env.local
```

Example in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/ent-tracker
```

### 2. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Verify Database Connectivity

With your MongoDB instance running, check the health-check route:
- Visit [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## Project Structure

```text
ent-tracker/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── health/
│   │   │       └── route.ts     # Health check & DB connection test
│   │   ├── favicon.ico
│   │   ├── globals.css          # Tailwind CSS styling
│   │   ├── layout.tsx           # Root layout & metadata
│   │   └── page.tsx             # Home landing page
│   ├── lib/
│   │   └── mongodb.ts           # Cached Mongoose connection helper
│   └── models/
│       └── Series.ts            # Mongoose Series schema & TypeScript interface
├── .env.example                 # Example environment variables
├── .env.local                   # Local environment variables (git-ignored)
├── next.config.ts               # Next.js configuration
├── package.json                 # Project dependencies & scripts
├── tsconfig.json                # TypeScript configuration
└── README.md
```

---

## Available Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Compiles and builds the production application.
- `npm run start` — Runs the compiled production build.
- `npm run lint` — Runs ESLint checks.
