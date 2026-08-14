# TapAway — monorepo

> Your Identity. One Tap Away.

NFC-powered digital visiting cards, as a two-service monorepo:

```
tapaway/
├── frontend/   →  Next.js app  (marketing site, auth, Linktree profiles, dashboard)   →  Vercel
└── backend/    →  Express + Prisma REST API  (auth, profiles, links, contact)          →  Railway
```

The **frontend never calls the backend from the browser**. Its Next.js route handlers (`/api/*`) proxy requests server-side to the backend and store the backend-issued JWT in an httpOnly cookie — so there are no CORS headaches and no secrets in the browser. Only the **backend** touches PostgreSQL and signs tokens.

**Stack:** Next.js 14 · TypeScript · Tailwind · Framer Motion · Express · Prisma · PostgreSQL · npm workspaces.

---

## What's inside the product

- 🪩 **Futuristic landing page** — scroll-driven **dark → light → dark** theme, glassmorphism, a big TapAway card that **rotates on scroll** as features reveal, sassy mixed-font headlines.
- 🔐 **Auth** — email + password sign up / log in (JWT issued by the backend, kept in an httpOnly cookie by the frontend).
- 🌳 **Linktree-style public profile** at `/u/<username>` — the NFC card target: save-contact (vCard), quick actions, socials, custom links, QR code.
- 🛠️ **Editor dashboard** with a live phone-style preview.

---

## Quick start (local)

You'll run two dev servers: the API on `:4000` and the web app on `:3000`.

```bash
# 1. install everything (workspaces install both apps)
npm install

# 2. configure env
cp backend/.env.example  backend/.env      # set DATABASE_URL + AUTH_SECRET
cp frontend/.env.example frontend/.env     # BACKEND_API_URL defaults to :4000

#    generate an AUTH_SECRET:
#    openssl rand -base64 32

# 3. create the DB schema + demo data (from the backend)
npm run db:push
npm run db:seed
#    → login: demo@tapaway.in / demo1234   → profile: /u/ananya

# 4. run both apps (two terminals is clearest)
npm run dev:backend      # terminal 1 → http://localhost:4000
npm run dev:frontend     # terminal 2 → http://localhost:3000
#    (or `npm run dev` to start both together)
```

### Need a PostgreSQL database?

Fastest is Railway: **railway.app → New Project → Provision PostgreSQL**, then copy the **public** `DATABASE_URL` from the Postgres service's *Connect* tab into `backend/.env`. Or run one locally with Docker:

```bash
docker run --name tapaway-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=tapaway -p 5432:5432 -d postgres:16
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tapaway?schema=public"
```

---

## API (backend)

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/signup` | — | Create user + profile, returns `{ token, username }` |
| POST | `/auth/login` | — | Returns `{ token }` |
| GET | `/me/profile` | Bearer | Current user's profile + links |
| PUT | `/me/profile` | Bearer | Update profile fields |
| PUT | `/me/links` | Bearer | Replace the set of links |
| GET | `/profiles/:username` | — | Public profile (counts a view) |
| POST | `/contact` | — | Contact-form submissions |

The frontend's matching proxy routes live in `frontend/src/app/api/*`.

---

## Deployment

### Backend → Railway

1. **New Project → Provision PostgreSQL.**
2. **New → Deploy from GitHub repo**, and set the service's **Root Directory** to `backend`.
3. Add env vars: `DATABASE_URL` (reference the Postgres plugin), `AUTH_SECRET`, `CORS_ORIGIN=https://your-frontend-domain`, plus the SMTP vars for order/contact emails (see `backend/.env.example`). `PORT` is provided by Railway.
4. Railway builds with `npm run build` and starts with `prisma migrate deploy && npm run start` (see `backend/railway.json`) — this applies `prisma/migrations` automatically on every deploy, so no manual DB step is needed.

### Frontend → Vercel

1. **Import the repo** on Vercel and set the **Root Directory** to `frontend`.
2. Add env vars: `BACKEND_API_URL=https://your-backend.up.railway.app`, `NEXT_PUBLIC_SITE_URL=https://your-domain`.
3. Deploy. Build command is `next build`.

> Because it's a monorepo, the key step on both platforms is setting the **Root Directory** (`frontend` on Vercel, `backend` on Railway).

---

## Customising

- **Prices / add-ons** — `frontend/src/components/landing/Pricing.tsx` (`₹XXX` placeholders).
- **Contact details** — `Contact.tsx` and `Footer.tsx`.
- **Contact form delivery** — `backend/src/routes/contact.ts` currently logs; wire it to Resend / Nodemailer / a CRM.
- **Brand colours** — `frontend/tailwind.config.ts`.
- **Card artwork** — `frontend/src/components/ui/TapCard.tsx`.
- **Data model** — `backend/prisma/schema.prisma` (a `CardOrder` model is ready for when you add checkout/payments).
