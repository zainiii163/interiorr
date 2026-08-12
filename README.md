# Interior Platform

MERN stack platform for interior fit-out, joinery, and property renovation (Dubai).

**Architecture:** Separate `frontend/` (React + Vite) and `backend/` (Express + MongoDB) apps — connected via REST API only.

## Docs

- [Architecture](./docs/ARCHITECTURE.md) — **System structure (start here)**
- [Deploy (free)](./docs/DEPLOY.md) — **Vercel + Render + MongoDB Atlas**
- [SRS — Requirements](./docs/SRS_DOCUMENTATION.md)
- [SRC — Technical spec](./docs/SRC_DOCUMENTATION.md)

## Quick Start

```bash
# 1. MongoDB (optional — or use Atlas URI in backend/.env)
docker compose up -d

# 2. Install all deps
npm install
npm run install:all

# 3. Configure env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Seed demo data
npm run seed

# 5. Run both apps
npm run dev
```

| App | URL |
|-----|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api/v1 |
| Admin login | http://localhost:5173/admin/login |

**Default admin (after seed):** `admin@interior.com` / `Admin@123`

## Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node 20, Express, Mongoose, JWT, Multer, Cloudinary-ready
- **Database:** MongoDB 7
