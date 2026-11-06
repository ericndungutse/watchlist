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

- **Signup Page:** [http://localhost:3000/signup](http://localhost:3000/signup)
- **Signup API:** `POST /api/auth/signup`
  - Body:
    ```json
    {
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "password": "securepassword123"
    }
    ```
  - Result: Hashes password with bcrypt, assigns default role `"user"`, stores in MongoDB, and returns created user without the password hash.
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
│   │   │   │   └── signup/
│   │   │   │       └── route.ts # User signup endpoint (bcrypt hash, role: 'user')
│   │   │   └── health/
│   │   │       └── route.ts     # Health check & DB connection test
│   │   ├── signup/
│   │   │   └── page.tsx         # User signup form with validation & icons
│   │   ├── favicon.ico
│   │   ├── globals.css          # Tailwind CSS styling
│   │   ├── layout.tsx           # Root layout & metadata
│   │   └── page.tsx             # Home landing page
│   ├── lib/
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
