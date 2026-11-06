# EntTracker

A full-stack Next.js application designed to track TV series, watched seasons, and statuses (continuing, ended, canceled).

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Security:** [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing

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

### 2. Run Local MongoDB (Optional via Docker)

You can spin up local MongoDB and Mongo Express with Docker:

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

---

## Authentication & API Routes

- **Login Page:** [http://localhost:3000/login](http://localhost:3000/login)
- **Signup Page:** [http://localhost:3000/signup](http://localhost:3000/signup)
- **Login API:** `POST /api/auth/login`
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Result: Verifies password with bcrypt, signs JWT, and sets secure HTTP-only cookie (`ent_auth_token`).
- **Signup API:** `POST /api/auth/signup`
  - Body: `{ "fullName": "Jane Doe", "email": "jane@example.com", "password": "securepassword123" }`
  - Result: Hashes password with bcrypt, stores user, and automatically sets secure session cookie.
- **Logout API:** `POST /api/auth/logout`
  - Result: Clears the HTTP-only session cookie.
- **Session Check API:** `GET /api/auth/me`
  - Result: Returns current authenticated user claims from the JWT session.
- **Health Check API:** `GET /api/health`

---

## Project Structure

```text
ent-tracker/
├── docker-compose.yml           # Local MongoDB & Mongo Express containers
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.ts # User login & HTTP-only JWT cookie setter
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.ts # User logout & cookie clearer
│   │   │   │   ├── me/
│   │   │   │   │   └── route.ts # Session validation endpoint
│   │   │   │   └── signup/
│   │   │   │       └── route.ts # User signup endpoint (bcrypt hash, role: 'user')
│   │   │   └── health/
│   │   │       └── route.ts     # Health check & DB connection test
│   │   ├── login/
│   │   │   └── page.tsx         # User login form
│   │   ├── signup/
│   │   │   └── page.tsx         # User signup form
│   │   ├── favicon.ico
│   │   ├── globals.css          # Tailwind CSS styling
│   │   ├── layout.tsx           # Root layout & metadata
│   │   └── page.tsx             # Home landing page with live user session
│   ├── components/
│   │   └── LogoutButton.tsx     # Client-side sign out button
│   ├── lib/
│   │   ├── auth.ts              # JWT signing, verification, & cookie helpers (jose)
│   │   └── mongodb.ts           # Cached Mongoose connection helper
│   └── models/
│       ├── Series.ts            # Mongoose Series schema & TypeScript interface
│       └── User.ts              # Mongoose User schema (fullName, email, bcrypt, role)
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
