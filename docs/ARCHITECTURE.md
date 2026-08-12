# Architecture Overview

> **Interior Platform** — MERN monorepo with strict separation between `frontend/` and `backend/`.

---

## 1. High-Level System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                               │
│  Browser / Mobile Web                                                     │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ HTTPS
┌───────────────────────────────────▼─────────────────────────────────────┐
│                         PRESENTATION LAYER                              │
│  frontend/  —  React 18 + Vite + Tailwind                               │
│  • Public marketing site                                                  │
│  • Admin dashboard (/admin/*)                                             │
│  • No database access · No secrets                                        │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ REST JSON  /api/v1
┌───────────────────────────────────▼─────────────────────────────────────┐
│                         APPLICATION LAYER                               │
│  backend/  —  Express 4 + Node 20                                       │
│  Routes → Middleware → Controllers → Services → Models                    │
└───────────────────────────────────┬─────────────────────────────────────┘
                                    │ Mongoose
┌───────────────────────────────────▼─────────────────────────────────────┐
│                           DATA LAYER                                    │
│  MongoDB 7  (local Docker / Atlas)                                       │
└─────────────────────────────────────────────────────────────────────────┘

External: Cloudinary · SMTP/SendGrid · WhatsApp (wa.me) · Google Maps
```

---

## 2. Repository Layout

```
interior/
├── frontend/                 # React SPA — deploy to Vercel/Netlify
├── backend/                  # Express API — deploy to Render/Railway
├── docs/
│   ├── ARCHITECTURE.md       # This file
│   ├── SRS_DOCUMENTATION.md  # Requirements (WHAT)
│   └── SRC_DOCUMENTATION.md  # Implementation spec (HOW)
├── docker-compose.yml        # Local MongoDB only
├── package.json              # Root scripts (dev both apps)
└── README.md
```

**Rule:** Each app has its own `package.json`, `.env`, and deploy pipeline.

---

## 3. Backend Architecture (`backend/`)

### 3.1 Layered Flow

```
HTTP Request
    │
    ▼
┌─────────┐
│  app.js │  helmet · cors · json · cookies · sanitize
└────┬────┘
     ▼
┌─────────┐
│ routes/ │  URL mapping · rate limits · route-level middleware
└────┬────┘
     ▼
┌────────────┐
│ middleware/│  auth · authorize · upload · validate (future)
└────┬───────┘
     ▼
┌─────────────┐
│ controllers/│  Request/response handling · status codes
└────┬────────┘
     ▼
┌──────────┐
│ services/ │  Email · WhatsApp · Cloudinary · PDF (side effects)
└────┬─────┘
     ▼
┌─────────┐
│ models/ │  Mongoose schemas · validation · indexes
└────┬────┘
     ▼
  MongoDB
```

### 3.2 Folder Structure

```
backend/
├── src/
│   ├── index.js              # Entry: connect DB → listen
│   ├── app.js                # Express app factory
│   │
│   ├── config/               # Environment & connections
│   │   ├── env.js
│   │   ├── db.js
│   │   └── cloudinary.js     # (when configured)
│   │
│   ├── models/               # Data layer (12 entities)
│   │   ├── User.js
│   │   ├── Lead.js
│   │   ├── Service.js
│   │   ├── Project.js
│   │   ├── Review.js
│   │   ├── Partner.js
│   │   ├── DesignStyle.js
│   │   ├── TrustPillar.js
│   │   ├── Quote.js
│   │   ├── Media.js
│   │   ├── SiteSetting.js
│   │   └── JobApplication.js
│   │
│   ├── controllers/          # HTTP handlers (thin)
│   │   ├── authController.js
│   │   ├── leadController.js
│   │   ├── serviceController.js
│   │   ├── projectController.js
│   │   └── contentController.js   # reviews, partners, settings, etc.
│   │
│   ├── routes/               # API surface /api/v1/*
│   │   ├── index.js          # Mounts all route modules
│   │   ├── authRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── serviceRoutes.js
│   │   ├── projectRoutes.js
│   │   └── contentRoutes.js
│   │
│   ├── middleware/
│   │   ├── auth.js           # JWT protect + authorize(roles)
│   │   ├── upload.js         # Multer config
│   │   └── errorHandler.js   # notFound + global errorHandler
│   │
│   ├── services/             # Business / external integrations
│   │   ├── emailService.js
│   │   ├── whatsappService.js    # (future)
│   │   └── uploadService.js      # (future Cloudinary)
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   ├── ApiResponse.js
│   │   ├── asyncHandler.js
│   │   └── slugify.js
│   │
│   └── seed/
│       ├── seed.js
│       └── data/*.json
│
├── .env.example
├── .env                        # gitignored
└── package.json
```

### 3.3 API Namespace

| Prefix | Module |
|--------|--------|
| `GET /api/v1/health` | Health check |
| `/api/v1/auth/*` | Login, refresh, logout, me |
| `/api/v1/leads/*` | Lead capture + admin CRM |
| `/api/v1/services/*` | Service catalog |
| `/api/v1/projects/*` | Portfolio |
| `/api/v1/reviews` | Testimonials |
| `/api/v1/partners` | Partner logos |
| `/api/v1/design-styles` | Design style catalog |
| `/api/v1/trust-pillars` | Trust/value cards |
| `/api/v1/settings` | Site config (singleton) |
| `/api/v1/quotes` | ERP quotes (admin) |
| `/api/v1/media` | Media library |
| `/api/v1/uploads/image` | File upload |
| `/api/v1/dashboard/stats` | Admin KPIs |

### 3.4 Auth Model

```
Login → accessToken (15m, JSON body) + refreshToken (7d, httpOnly cookie)
Protected routes → Authorization: Bearer {accessToken}
401 → frontend calls POST /auth/refresh → new accessToken
Roles: admin | editor
```

---

## 4. Frontend Architecture (`frontend/`)

### 4.1 Layered Flow

```
User interaction
    │
    ▼
┌──────────┐
│  pages/  │  Route-level views · data fetching orchestration
└────┬─────┘
     ▼
┌──────────────┐
│ components/  │  UI composition · layout · feature widgets
└────┬─────────┘
     ▼
┌──────────┐
│  hooks/  │  Reusable state & effects (useAuth, useApi)
└────┬─────┘
     ▼
┌───────────┐
│ context/  │  Global state (Auth, Toast)
└────┬──────┘
     ▼
┌───────────┐
│ services/ │  api.js — single Axios instance + endpoint functions
└────┬──────┘
     ▼
  backend REST API
```

### 4.2 Folder Structure

```
frontend/
├── public/
│   ├── favicon.ico
│   └── robots.txt
│
├── src/
│   ├── main.jsx              # React root + providers
│   ├── App.jsx               # Top-level router shell
│   ├── index.css             # Tailwind + CSS variables (theme)
│   │
│   ├── routes/
│   │   ├── PublicRoutes.jsx  # Marketing site routes
│   │   └── AdminRoutes.jsx   # Protected admin routes
│   │
│   ├── pages/
│   │   ├── public/           # One file per public page
│   │   └── admin/            # One file per admin screen
│   │
│   ├── components/
│   │   ├── layout/           # Header, Footer, PageLayout, WhatsAppFab
│   │   ├── ui/               # Design system primitives (Button, Input…)
│   │   ├── home/             # Home page sections
│   │   ├── services/
│   │   ├── projects/
│   │   ├── forms/
│   │   ├── reviews/
│   │   └── admin/            # AdminLayout, Sidebar, DataTable
│   │
│   ├── services/
│   │   └── api.js            # Axios + interceptors + all API calls
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
│   │
│   └── utils/
│       ├── constants.js
│       └── formatters.js
│
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

### 4.3 Route Architecture

**Public** (`PublicRoutes.jsx`)

| Path | Page component |
|------|----------------|
| `/` | HomePage |
| `/about` | AboutPage |
| `/services` | ServicesPage |
| `/services/:slug` | ServiceDetailPage |
| `/projects` | ProjectsPage |
| `/projects/:slug` | ProjectDetailPage |
| `/design-styles` | DesignStylesPage |
| `/reviews` | ReviewsPage |
| `/contact` | ContactPage |
| `/book-consultation` | BookConsultationPage |
| `*` | NotFoundPage |

**Admin** (`AdminRoutes.jsx`) — wrapped in `ProtectedRoute`

| Path | Page component |
|------|----------------|
| `/admin/login` | LoginPage (public) |
| `/admin` | DashboardPage |
| `/admin/leads` | LeadsPage |
| `/admin/services` | ServicesAdminPage |
| `/admin/projects` | ProjectsAdminPage |
| `/admin/reviews` | ReviewsAdminPage |
| `/admin/settings` | SettingsPage |

### 4.4 State & Data Rules

| Concern | Where it lives |
|---------|----------------|
| Auth token | `localStorage` (access) + cookie (refresh, set by API) |
| User profile | `AuthContext` |
| Server data | Fetched in pages via `services/api.js` |
| Form state | React Hook Form (per form, local) |
| Theme / CSS vars | `index.css` + Tailwind config |

**Never:** MongoDB URI, JWT secrets, or Cloudinary secrets in frontend.

---

## 5. Cross-Cutting Concerns

### 5.1 Environment Wiring

| Variable | App | Purpose |
|----------|-----|---------|
| `VITE_API_URL` | frontend | Backend base URL |
| `FRONTEND_URL` | backend | CORS origin |
| `MONGODB_URI` | backend | Database |
| `JWT_*` | backend | Auth tokens |

### 5.2 Error Contract

All API responses:

```json
{ "success": true,  "message": "...", "data": {}, "meta": {} }
{ "success": false, "message": "...", "errors": [] }
```

Frontend `api.js` interceptors handle 401 refresh; pages handle user-facing errors via toast.

### 5.3 Deployment Topology

```
yourcompany.com          → frontend (static SPA)
api.yourcompany.com      → backend (Node process)
MongoDB Atlas            → database
Cloudinary               → media CDN
```

---

## 6. Development Workflow

```bash
# Terminal 1 — database
docker compose up -d

# Terminal 2 — backend
cd backend && npm install && npm run dev    # :5000

# Terminal 3 — frontend
cd frontend && npm install && npm run dev   # :5173

# Or from root
npm run dev
```

---

## 7. Implementation Status

| Layer | Status |
|-------|--------|
| Backend structure | ✅ Scaffolded |
| Backend models | ✅ All 12 models |
| Backend routes/controllers | ✅ Core modules |
| Backend seed | ✅ Demo data script |
| Frontend structure | ✅ Folder architecture |
| Frontend pages/components | 🔜 Stubs — implement per phase |
| Production deploy | 🔜 Phase 1 completion |

---

## 8. Related Documents

| Doc | Role |
|-----|------|
| [SRS_DOCUMENTATION.md](./SRS_DOCUMENTATION.md) | Business requirements |
| [SRC_DOCUMENTATION.md](./SRC_DOCUMENTATION.md) | Full technical spec |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System structure (this file) |
