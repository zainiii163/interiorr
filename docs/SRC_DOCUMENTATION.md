# Interior Platform — MERN Source Documentation

> **Project:** Unified interior fit-out & renovation platform  
> **Stack:** MongoDB · Express.js · React · Node.js  
> **Reference prototypes:** [Halo Interiors](https://halointeriors.ae) · [Yalla Renovation](https://yallarenovation.com)  
> **Goal:** Same core functionality as both prototypes, refreshed UI/color system, extensible for future modules

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Feature Parity Matrix](#2-feature-parity-matrix)
3. [Tech Stack & Tooling](#3-tech-stack--tooling)
4. [Architecture & API Integration](#4-architecture--api-integration)
5. [Repository Structure](#5-repository-structure)
6. [Frontend Architecture (React)](#6-frontend-architecture-react)
7. [Backend Architecture (Node + Express)](#7-backend-architecture-node--express)
8. [Database Schema (MongoDB)](#8-database-schema-mongodb)
9. [API Specification](#9-api-specification)
10. [UI / Design System](#10-ui--design-system)
11. [Authentication & Roles](#11-authentication--roles)
12. [Third-Party Integrations](#12-third-party-integrations)
13. [Environment Variables](#13-environment-variables)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Development Phases](#15-development-phases)
16. [Future Extensions](#16-future-extensions)

---

## 1. Executive Summary

This document defines the **complete source structure** for a MERN application that merges the public-facing and lead-generation capabilities of two Dubai interior/renovation company websites into one platform.

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| **Frontend** | `frontend/` | React + Vite UI — marketing site, portfolio, booking flows, admin dashboard |
| **Backend** | `backend/` | Express REST API — auth, file uploads, email/WhatsApp, ERP-style quotes |
| **Database** | MongoDB Atlas / local | Content, leads, projects, services, users, reviews, partners |

**Architecture rule:** Frontend and backend are **fully separate apps**. They communicate **only via REST API** — no shared code, no direct database access from React.

### Core User Flows

```
Visitor → Browse services/projects → Book consultation → Lead stored → Admin notified
Admin   → Manage content/leads/projects → Update quotes → Track project status
Client  → (Phase 2) Portal to view quote, timeline, documents
```

---

## 2. Feature Parity Matrix

Functionality mapped from both reference sites. **Build all marked ✅ in Phase 1.**

| Feature | Halo | Yalla | Module | Phase |
|---------|:----:|:-----:|--------|:-----:|
| Hero + primary CTA | ✅ | ✅ | `Home` | 1 |
| WhatsApp quick contact | ✅ | — | `Contact` | 1 |
| Book free consultation form | ✅ | ✅ | `Leads` | 1 |
| Service type selector on form | — | ✅ | `Leads` | 1 |
| Trusted partners / logos | ✅ | ✅ | `Partners` | 1 |
| Services grid (18+ categories) | ✅ | ✅ | `Services` | 1 |
| Portfolio / featured projects | ✅ | ✅ | `Projects` | 1 |
| Project category filters | ✅ | — | `Projects` | 1 |
| About + company stats | ✅ | ✅ | `About` | 1 |
| Our Promise / trust pillars | — | ✅ | `TrustPillars` | 1 |
| Property inspection / snagging | ✅ | — | `Services` | 1 |
| Air quality / Halo Shield | ✅ | — | `Services` | 1 |
| Design styles showcase | ✅ | — | `DesignStyles` | 1 |
| Skills / expertise bars | ✅ | — | `About` | 1 |
| Google reviews / testimonials | ✅ | ✅ | `Reviews` | 1 |
| Video showcase | ✅ | — | `Media` | 1 |
| Standard pricing / ERP quotes | — | ✅ | `Quotes` | 1 |
| Material selection / experience center | — | ✅ | `Materials` | 2 |
| NOC & authority approvals info | ✅ | ✅ | `Services` | 1 |
| Warranty & timeline promises | — | ✅ | `TrustPillars` | 1 |
| Job applications (separate form) | — | ✅ | `Careers` | 2 |
| Admin CMS for all content | — | — | `Admin` | 1 |
| Client project portal | — | — | `Portal` | 3 |

---

## 3. Tech Stack & Tooling

### Core

| Tool | Version | Purpose |
|------|---------|---------|
| **Node.js** | 20 LTS | Runtime |
| **Express** | 4.x | HTTP API |
| **MongoDB** | 7.x | Primary database |
| **Mongoose** | 8.x | ODM |
| **React** | 18.x | UI |
| **Vite** | 5.x | Frontend build |
| **React Router** | 6.x | Routing |

### Recommended Libraries

| Area | Library |
|------|---------|
| Styling | Tailwind CSS 3.x + CSS variables for theme |
| Forms | React Hook Form + Zod validation |
| HTTP client | Axios |
| Auth | JSON Web Tokens (access + refresh) |
| Password hash | bcryptjs |
| File upload | Multer + Cloudinary (or AWS S3) |
| Email | Nodemailer / SendGrid |
| Rate limiting | express-rate-limit |
| Security | helmet, cors, express-mongo-sanitize |
| Admin UI tables | TanStack Table |
| Animations | Framer Motion (subtle) |
| Icons | Lucide React |
| Date | date-fns |
| SEO | react-helmet-async |

### DevOps (optional Phase 1)

- **Docker** — `docker-compose` for local MongoDB
- **PM2** — production process manager
- **GitHub Actions** — lint + test on PR

---

## 4. Architecture & API Integration

### 4.1 Architecture Decision

| Approach | Verdict | Why |
|----------|---------|-----|
| **Separate `frontend/` + `backend/` (monorepo)** | ✅ **Recommended** | Industry standard MERN; independent deploy; clean separation |
| Single combined app (React inside Express) | ❌ Avoid | Hard to maintain, poor scaling, outdated pattern |
| Two separate Git repos | ✅ Optional later | Good when team grows; same API contract applies |

### 4.2 System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
              ┌──────────────▼──────────────┐
              │   frontend/  (React + Vite) │
              │   Port 5173 (dev)           │
              │   yourcompany.com (prod)    │
              └──────────────┬──────────────┘
                             │  HTTPS REST API (Axios)
                             │  Authorization: Bearer <token>
              ┌──────────────▼──────────────┐
              │   backend/  (Express)       │
              │   Port 5000 (dev)           │
              │   api.yourcompany.com(prod) │
              └──────────────┬──────────────┘
                             │  Mongoose ODM
              ┌──────────────▼──────────────┐
              │   MongoDB Atlas / local     │
              └─────────────────────────────┘
```

### 4.3 Integration Rules

| Rule | Detail |
|------|--------|
| **Communication** | Frontend calls backend REST endpoints only |
| **No shared models** | Mongoose schemas live in `backend/` only |
| **Secrets** | JWT secrets, DB URI, Cloudinary keys — backend `.env` only |
| **CORS** | Backend whitelists frontend URL via `FRONTEND_URL` |
| **Auth** | JWT access token in `Authorization` header; refresh token in HTTP-only cookie |
| **File uploads** | Frontend → backend (Multer) → Cloudinary — never upload with secret keys from browser |
| **Env linking** | Frontend `VITE_API_URL` points to backend base URL |

### 4.4 Frontend API Layer (`frontend/src/services/api.js`)

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,  // http://localhost:5000/api/v1
  withCredentials: true,                   // send refresh-token cookie
  headers: { 'Content-Type': 'application/json' },
});

// Attach access token on every request (admin routes)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      localStorage.setItem('accessToken', data.data.accessToken);
      error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return api(error.config);
    }
    return Promise.reject(error);
  }
);

// ── Public endpoints ──
export const getServices     = ()           => api.get('/services');
export const getService      = (slug)       => api.get(`/services/${slug}`);
export const getProjects     = (params)     => api.get('/projects', { params });
export const getProject      = (slug)       => api.get(`/projects/${slug}`);
export const getReviews      = ()           => api.get('/reviews');
export const getPartners     = ()           => api.get('/partners');
export const getDesignStyles = ()           => api.get('/design-styles');
export const getSettings     = ()           => api.get('/settings');
export const submitLead      = (data)       => api.post('/leads', data);
export const submitContact   = (data)       => api.post('/leads', data);

// ── Admin endpoints ──
export const login           = (data)       => api.post('/auth/login', data);
export const logout          = ()           => api.post('/auth/logout');
export const getMe           = ()           => api.get('/auth/me');
export const getLeads        = (params)     => api.get('/leads', { params });
export const updateLead      = (id, data)   => api.patch(`/leads/${id}`, data);
export const uploadImage     = (formData)   => api.post('/uploads/image', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export default api;
```

### 4.5 Backend CORS Setup (`backend/src/app.js`)

```js
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,   // http://localhost:5173
  credentials: true,                 // allow cookies (refresh token)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
```

### 4.6 Example Request Flow — Consultation Form

```
1. User fills ConsultationForm.jsx (frontend)
2. React Hook Form validates locally (Zod)
3. submitLead(formData) → POST http://localhost:5000/api/v1/leads
4. backend/leadController.create → saves to MongoDB
5. backend/emailService → sends admin alert + client confirmation
6. API returns { success: true, message: "Lead submitted" }
7. Frontend shows success toast + redirects
```

### 4.7 What NOT To Do

| ❌ Avoid | ✅ Do instead |
|---------|---------------|
| Put MongoDB URI in frontend `.env` | Keep DB credentials backend-only |
| Hardcode `localhost:5000` in components | Use `VITE_API_URL` env variable |
| Serve React build from Express `public/` | Deploy frontend separately (Vercel/Netlify) |
| Share Mongoose models with frontend | Define TypeScript/JSDoc types in frontend if needed |
| Upload files directly to Cloudinary from browser with secret key | Upload via backend `/uploads/image` |

---

## 5. Repository Structure

**Monorepo layout (recommended for solo/small team):**

```
interior/
├── frontend/                        # React app — standalone, own package.json
├── backend/                         # Express API — standalone, own package.json
├── docs/
│   └── SRC_DOCUMENTATION.md       # This file
├── docker-compose.yml               # Local MongoDB only
├── .gitignore
└── README.md
```

> **Note:** Each folder is an independent Node project. Run `npm install` separately in `frontend/` and `backend/`. They deploy to different hosts in production.

### Full Tree

```
interior/
│
├── frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── robots.txt
│   │   └── assets/
│   │       └── og-image.jpg
│   │
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.css                  # Tailwind + CSS variables
│   │   │
│   │   ├── assets/
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── MobileNav.jsx
│   │   │   │   ├── WhatsAppFab.jsx
│   │   │   │   └── PageLayout.jsx
│   │   │   │
│   │   │   ├── ui/                      # Design system primitives
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── Accordion.jsx
│   │   │   │   ├── ProgressBar.jsx
│   │   │   │   ├── StarRating.jsx
│   │   │   │   ├── Skeleton.jsx
│   │   │   │   └── Toast.jsx
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx
│   │   │   │   ├── TrustPillars.jsx
│   │   │   │   ├── StatsCounter.jsx
│   │   │   │   ├── ServicesPreview.jsx
│   │   │   │   ├── FeaturedProjects.jsx
│   │   │   │   ├── DesignStylesPreview.jsx
│   │   │   │   ├── ReviewsCarousel.jsx
│   │   │   │   ├── VideoShowcase.jsx
│   │   │   │   ├── SkillsSection.jsx
│   │   │   │   ├── PartnersMarquee.jsx
│   │   │   │   └── CTABanner.jsx
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── ServiceCard.jsx
│   │   │   │   ├── ServiceGrid.jsx
│   │   │   │   └── ServiceDetailHero.jsx
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.jsx
│   │   │   │   ├── ProjectFilter.jsx
│   │   │   │   ├── ProjectGallery.jsx
│   │   │   │   └── BeforeAfterSlider.jsx
│   │   │   │
│   │   │   ├── design-styles/
│   │   │   │   ├── StyleCard.jsx
│   │   │   │   └── StyleDetailPanel.jsx
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── ConsultationForm.jsx
│   │   │   │   ├── ContactForm.jsx
│   │   │   │   └── JobApplicationForm.jsx
│   │   │   │
│   │   │   ├── reviews/
│   │   │   │   ├── ReviewCard.jsx
│   │   │   │   └── ReviewsGrid.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── DataTable.jsx
│   │   │       ├── ImageUploader.jsx
│   │   │       └── RichTextEditor.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── public/
│   │   │   │   ├── HomePage.jsx
│   │   │   │   ├── AboutPage.jsx
│   │   │   │   ├── ServicesPage.jsx
│   │   │   │   ├── ServiceDetailPage.jsx
│   │   │   │   ├── ProjectsPage.jsx
│   │   │   │   ├── ProjectDetailPage.jsx
│   │   │   │   ├── DesignStylesPage.jsx
│   │   │   │   ├── DesignStyleDetailPage.jsx
│   │   │   │   ├── ReviewsPage.jsx
│   │   │   │   ├── ContactPage.jsx
│   │   │   │   ├── BookConsultationPage.jsx
│   │   │   │   ├── CareersPage.jsx
│   │   │   │   └── NotFoundPage.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── LoginPage.jsx
│   │   │       ├── DashboardPage.jsx
│   │   │       ├── LeadsPage.jsx
│   │   │       ├── LeadDetailPage.jsx
│   │   │       ├── ServicesAdminPage.jsx
│   │   │       ├── ProjectsAdminPage.jsx
│   │   │       ├── ReviewsAdminPage.jsx
│   │   │       ├── PartnersAdminPage.jsx
│   │   │       ├── DesignStylesAdminPage.jsx
│   │   │       ├── QuotesAdminPage.jsx
│   │   │       ├── MediaAdminPage.jsx
│   │   │       └── SettingsPage.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useApi.js
│   │   │   ├── useDebounce.js
│   │   │   └── useMediaQuery.js
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ToastContext.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js                   # Axios instance + endpoint helpers
│   │   │
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   │
│   │   └── routes/
│   │       ├── PublicRoutes.jsx
│   │       └── AdminRoutes.jsx
│   │
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── index.js                     # Entry: connect DB, mount routes
│   │   ├── app.js                       # Express app config
│   │   │
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   ├── cloudinary.js
│   │   │   └── env.js                   # Validated env loader
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Lead.js
│   │   │   ├── Service.js
│   │   │   ├── Project.js
│   │   │   ├── Review.js
│   │   │   ├── Partner.js
│   │   │   ├── DesignStyle.js
│   │   │   ├── Quote.js
│   │   │   ├── Media.js
│   │   │   ├── TrustPillar.js
│   │   │   ├── SiteSetting.js
│   │   │   └── JobApplication.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── leadController.js
│   │   │   ├── serviceController.js
│   │   │   ├── projectController.js
│   │   │   ├── reviewController.js
│   │   │   ├── partnerController.js
│   │   │   ├── designStyleController.js
│   │   │   ├── quoteController.js
│   │   │   ├── mediaController.js
│   │   │   ├── settingsController.js
│   │   │   └── careerController.js
│   │   │
│   │   ├── routes/
│   │   │   ├── index.js
│   │   │   ├── authRoutes.js
│   │   │   ├── leadRoutes.js
│   │   │   ├── serviceRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── reviewRoutes.js
│   │   │   ├── partnerRoutes.js
│   │   │   ├── designStyleRoutes.js
│   │   │   ├── quoteRoutes.js
│   │   │   ├── mediaRoutes.js
│   │   │   ├── settingsRoutes.js
│   │   │   └── careerRoutes.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── auth.js                  # JWT verify
│   │   │   ├── roleCheck.js             # admin | editor
│   │   │   ├── validate.js              # Zod/Joi request validation
│   │   │   ├── upload.js                # Multer config
│   │   │   ├── errorHandler.js
│   │   │   └── notFound.js
│   │   │
│   │   ├── services/
│   │   │   ├── emailService.js
│   │   │   ├── whatsappService.js       # Optional: Twilio / direct link
│   │   │   └── uploadService.js
│   │   │
│   │   ├── utils/
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   └── slugify.js
│   │   │
│   │   └── seed/
│   │       ├── seed.js                  # Demo data
│   │       └── data/
│   │           ├── services.json
│   │           ├── designStyles.json
│   │           └── trustPillars.json
│   │
│   ├── .env.example
│   └── package.json
│
├── docs/
│   └── SRC_DOCUMENTATION.md
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 6. Frontend Architecture (React)

### 6.1 Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Hero, pillars, stats, services preview, projects, reviews, CTA |
| `/about` | AboutPage | Company story, stats, skills, team (optional) |
| `/services` | ServicesPage | Full services grid with categories |
| `/services/:slug` | ServiceDetailPage | Single service deep-dive |
| `/projects` | ProjectsPage | Filterable portfolio (All / Residential / Commercial / Retail) |
| `/projects/:slug` | ProjectDetailPage | Gallery, scope, timeline |
| `/design-styles` | DesignStylesPage | Style catalog (Contemporary, Japandi, etc.) |
| `/design-styles/:slug` | DesignStyleDetailPage | Style description + related projects |
| `/reviews` | ReviewsPage | All Google-style testimonials |
| `/contact` | ContactPage | Contact form + map + WhatsApp |
| `/book-consultation` | BookConsultationPage | Primary lead form with service selector |
| `/careers` | CareersPage | Job application form (Phase 2) |
| `*` | NotFoundPage | 404 |

### 6.2 Admin Routes (Protected)

| Route | Page |
|-------|------|
| `/admin/login` | LoginPage |
| `/admin` | DashboardPage — KPIs: leads today, open quotes, recent reviews |
| `/admin/leads` | LeadsPage |
| `/admin/leads/:id` | LeadDetailPage — status, notes, assign |
| `/admin/services` | CRUD services |
| `/admin/projects` | CRUD projects + image gallery |
| `/admin/reviews` | CRUD reviews |
| `/admin/partners` | CRUD partner logos |
| `/admin/design-styles` | CRUD design styles |
| `/admin/quotes` | Quote builder (ERP-style line items) |
| `/admin/media` | Video/image library |
| `/admin/settings` | Site settings, contact info, social links |

### 6.3 Key Component Contracts

#### `ConsultationForm.jsx`

```js
// Fields (matches Yalla + Halo)
{
  fullName: string,          // required
  email: string,             // required
  phone: string,             // required, UAE format
  propertyType: enum,        // villa | apartment | office | commercial | retail
  serviceRequired: ObjectId, // ref Service
  location: string,          // e.g. "Dubai Marina"
  message: string,
  preferredContact: enum,    // phone | email | whatsapp
  source: string             // auto: page URL / UTM
}
```

#### `ProjectFilter.jsx`

```js
categories: ['all', 'residential', 'commercial', 'retail']
// Filters via query param: /projects?category=residential
```

#### `FeaturedProjects.jsx` (Home)

- Fetches `GET {VITE_API_URL}/projects?featured=true&limit=6`
- Tab filters client-side or via API

---

## 7. Backend Architecture (Node + Express)

### 7.1 Layer Pattern

```
Request → Route → Middleware (auth/validate) → Controller → Model → Response
```

### 7.2 Controller Responsibilities

| Controller | Public | Admin |
|------------|:------:|:-----:|
| `leadController` | `create` | `list`, `getById`, `updateStatus`, `delete` |
| `serviceController` | `list`, `getBySlug` | `create`, `update`, `delete`, `reorder` |
| `projectController` | `list`, `getBySlug` | full CRUD |
| `reviewController` | `list` | full CRUD |
| `quoteController` | — | `create`, `update`, `send`, `pdf` |

### 7.3 Standard API Response Shape

```js
// Success
{
  success: true,
  message: "Leads fetched successfully",
  data: { ... },
  meta: { page: 1, limit: 10, total: 42 }  // when paginated
}

// Error
{
  success: false,
  message: "Validation failed",
  errors: [{ field: "email", message: "Invalid email" }]
}
```

### 7.4 Error Handling

- Central `errorHandler.js` catches all errors
- `ApiError` class with `statusCode` + `message`
- Never leak stack traces in production

---

## 8. Database Schema (MongoDB)

### 8.1 `User`

```js
{
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,           // bcrypt hashed
  role: { type: String, enum: ['admin', 'editor'], default: 'editor' },
  isActive: { type: Boolean, default: true },
  refreshToken: String,
  createdAt, updatedAt
}
```

### 8.2 `Lead`

```js
{
  fullName: String,
  email: String,
  phone: String,
  propertyType: { type: String, enum: ['villa','apartment','office','commercial','retail','other'] },
  service: { type: ObjectId, ref: 'Service' },
  location: String,
  message: String,
  preferredContact: { type: String, enum: ['phone','email','whatsapp'] },
  status: { type: String, enum: ['new','contacted','quoted','won','lost'], default: 'new' },
  source: String,
  assignedTo: { type: ObjectId, ref: 'User' },
  notes: [{ text: String, author: ObjectId, createdAt: Date }],
  createdAt, updatedAt
}
```

### 8.3 `Service`

```js
{
  title: String,
  slug: String,               // unique, indexed
  shortDescription: String,
  fullDescription: String,    // HTML or markdown
  icon: String,               // lucide icon name or URL
  image: String,
  category: { type: String, enum: ['fitout','joinery','renovation','inspection','specialty'] },
  features: [String],
  isFeatured: Boolean,
  order: Number,
  isActive: { type: Boolean, default: true },
  createdAt, updatedAt
}
```

**Seed services (Phase 1):** Villa Renovation, Bespoke Joinery, Decorative Paints, Terrazzo, Microcement, Automation, Stretch Ceiling, MEP & HVAC, Gypsum Works, Tile Installation, Marble Installation, Custom Furniture, Contracting, Window Glazing, Property Inspection, Halo Shield, Air Quality, Authority Approvals, Project Management, Kitchen Renovation, Bathroom Renovation, Full Home Renovation.

### 8.4 `Project`

```js
{
  title: String,
  slug: String,
  description: String,
  category: { type: String, enum: ['residential','commercial','retail'] },
  serviceTypes: [{ type: ObjectId, ref: 'Service' }],
  designStyle: { type: ObjectId, ref: 'DesignStyle' },
  location: String,           // e.g. "Dubai Creek Harbour"
  coverImage: String,
  gallery: [{ url: String, caption: String }],
  beforeAfter: { before: String, after: String },
  scope: String,
  duration: String,           // e.g. "8 weeks"
  isFeatured: Boolean,
  completedAt: Date,
  isPublished: { type: Boolean, default: true },
  createdAt, updatedAt
}
```

### 8.5 `Review`

```js
{
  authorName: String,
  authorTitle: String,        // e.g. "Property Owner"
  rating: { type: Number, min: 1, max: 5 },
  content: String,
  source: { type: String, enum: ['google','direct'], default: 'google' },
  externalUrl: String,
  isFeatured: Boolean,
  isPublished: { type: Boolean, default: true },
  createdAt, updatedAt
}
```

### 8.6 `Partner`

```js
{
  name: String,
  logo: String,
  website: String,
  order: Number,
  isActive: Boolean
}
```

### 8.7 `DesignStyle`

```js
{
  name: String,               // e.g. "Japandi"
  slug: String,
  tagline: String,
  description: String,
  image: String,
  traits: [String],           // e.g. ["minimal", "warm wood", "neutral"]
  relatedProjects: [{ type: ObjectId, ref: 'Project' }],
  order: Number,
  isActive: Boolean
}
```

**Seed styles:** Contemporary, Minimalist, Neoclassical, Mediterranean, Japandi, Arabian, Farmhouse, Industrial, Ultra Luxury, Boho Chic, Wellness.

### 8.8 `TrustPillar`

```js
{
  title: String,              // e.g. "10 Year Warranty"
  description: String,
  icon: String,
  order: Number
}
```

### 8.9 `Quote` (ERP-style — from Yalla)

```js
{
  lead: { type: ObjectId, ref: 'Lead' },
  quoteNumber: String,        // auto-generated Q-2026-0001
  lineItems: [{
    description: String,
    category: String,         // kitchen | bathroom | flooring | labour
    quantity: Number,
    unit: String,
    unitPrice: Number,
    total: Number
  }],
  subtotal: Number,
  tax: Number,
  discount: Number,
  grandTotal: Number,
  currency: { type: String, default: 'AED' },
  status: { type: String, enum: ['draft','sent','accepted','rejected'], default: 'draft' },
  validUntil: Date,
  notes: String,
  createdBy: { type: ObjectId, ref: 'User' },
  createdAt, updatedAt
}
```

### 8.10 `Media`

```js
{
  type: { type: String, enum: ['video','image'] },
  title: String,
  url: String,
  thumbnail: String,
  placement: { type: String, enum: ['home','about','global'] },
  order: Number
}
```

### 8.11 `SiteSetting` (singleton document)

```js
{
  companyName: String,
  tagline: String,
  phone: String,
  whatsapp: String,
  email: String,
  address: String,
  socialLinks: { facebook, instagram, linkedin, youtube },
  stats: {
    yearsExperience: Number,
    projectsCompleted: Number,
    employees: Number,
    inspections: Number,
    averageRating: Number
  },
  seo: { defaultTitle, defaultDescription, ogImage },
  heroVideo: String
}
```

### 8.12 `JobApplication` (Phase 2)

```js
{
  fullName, email, phone, position, experience, resumeUrl, coverLetter, status, createdAt
}
```

### 8.13 Indexes

```js
Service:    { slug: 1 } unique
Project:    { slug: 1 } unique, { category: 1, isPublished: 1 }
Lead:       { status: 1, createdAt: -1 }
Review:     { isPublished: 1, isFeatured: 1 }
DesignStyle:{ slug: 1 } unique
```

---

## 9. API Specification

Base URL: `http://localhost:5000/api/v1` (dev) · `https://api.yourcompany.com/api/v1` (prod)

> Frontend consumes all endpoints via `frontend/src/services/api.js` — never call MongoDB directly.

### 9.1 Auth

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/auth/login` | — | `{ email, password }` → tokens |
| POST | `/auth/refresh` | — | Refresh access token |
| POST | `/auth/logout` | ✓ | Clear refresh token |
| GET | `/auth/me` | ✓ | Current user |

### 9.2 Leads

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | `/leads` | — | Public consultation submit |
| GET | `/leads` | ✓ | List with filters & pagination |
| GET | `/leads/:id` | ✓ | Single lead |
| PATCH | `/leads/:id` | ✓ | Update status, notes, assignee |
| DELETE | `/leads/:id` | admin | Soft or hard delete |

### 9.3 Services

| Method | Endpoint | Auth |
|--------|----------|:----:|
| GET | `/services` | — |
| GET | `/services/:slug` | — |
| POST | `/services` | ✓ |
| PUT | `/services/:id` | ✓ |
| DELETE | `/services/:id` | admin |
| PATCH | `/services/reorder` | ✓ |

### 9.4 Projects

| Method | Endpoint | Auth |
|--------|----------|:----:|
| GET | `/projects` | — | Query: `?category=&featured=&page=&limit=` |
| GET | `/projects/:slug` | — |
| POST | `/projects` | ✓ |
| PUT | `/projects/:id` | ✓ |
| DELETE | `/projects/:id` | admin |

### 9.5 Reviews, Partners, Design Styles, Media, Settings

Same CRUD pattern:
- **Public:** `GET` list + detail
- **Admin:** `POST`, `PUT`, `DELETE`

### 9.6 Quotes

| Method | Endpoint | Auth |
|--------|----------|:----:|
| GET | `/quotes` | ✓ |
| POST | `/quotes` | ✓ |
| PUT | `/quotes/:id` | ✓ |
| POST | `/quotes/:id/send` | ✓ | Email PDF to client |
| GET | `/quotes/:id/pdf` | ✓ |

### 9.7 Uploads

| Method | Endpoint | Auth |
|--------|----------|:----:|
| POST | `/uploads/image` | ✓ |
| POST | `/uploads/video` | ✓ |

---

## 10. UI / Design System

> **Important:** Same functionality as prototypes, **different visual identity** — not a clone of Halo/Yalla branding.

### 10.1 Brand Direction

| Aspect | Prototype feel | Our direction |
|--------|----------------|---------------|
| Mood | Corporate luxury gold/black | Modern warm minimal |
| Layout | Dense sections, carousels | More whitespace, card-based grid |
| Typography | Serif headlines | **DM Sans** (body) + **Playfair Display** (headings) |
| Corners | Mixed | Consistent `rounded-2xl` cards |
| Motion | Heavy sliders | Subtle fade/slide on scroll |

### 10.2 Color Palette (CSS Variables)

```css
:root {
  /* Primary — warm terracotta/copper (interior craft) */
  --color-primary-50:  #FAF5F0;
  --color-primary-100: #F0E4D6;
  --color-primary-500: #C4795A;   /* main CTA */
  --color-primary-600: #A8614A;
  --color-primary-900: #3D2318;

  /* Secondary — deep sage green (trust, sustainability) */
  --color-secondary-500: #5C7A6B;
  --color-secondary-700: #3D5248;

  /* Neutral — warm stone */
  --color-neutral-50:  #FAFAF9;
  --color-neutral-100: #F5F5F4;
  --color-neutral-800: #292524;
  --color-neutral-900: #1C1917;

  /* Accent — muted gold for badges/stats */
  --color-accent-gold: #B8956A;

  /* Semantic */
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error:   #DC2626;

  /* Surfaces */
  --color-bg:        var(--color-neutral-50);
  --color-surface:   #FFFFFF;
  --color-text:      var(--color-neutral-900);
  --color-text-muted:#78716C;
}
```

### 10.3 Component Style Rules

| Element | Style |
|---------|-------|
| Primary button | `bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl` |
| Secondary button | Outline `border-primary-500 text-primary-600` |
| WhatsApp FAB | Fixed bottom-right, green `#25D366`, pulse on first visit |
| Section spacing | `py-20 md:py-28` |
| Container | `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` |
| Cards | White bg, soft shadow `shadow-sm hover:shadow-md transition` |
| Hero | Full-bleed image/video + gradient overlay `from-neutral-900/80` |

### 10.4 Page Section Order (Home)

1. Header (sticky, transparent → solid on scroll)
2. Hero + dual CTA (Book Consultation · WhatsApp)
3. Trust pillars (5 cards — warranty, timeline, pricing, design, approvals)
4. Animated stats counter
5. Services preview (6 featured → link to `/services`)
6. Featured projects with category tabs
7. Design styles horizontal scroll
8. Property inspection + air quality split section
9. Video showcase
10. Skills / expertise progress bars
11. Reviews carousel + aggregate rating badge
12. Partners logo strip
13. Final CTA banner
14. Footer

### 10.5 Responsive Breakpoints

Tailwind defaults: `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

Mobile-first. Hamburger nav below `lg`. Project grid: 1 → 2 → 3 columns.

---

## 11. Authentication & Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full CRUD, delete, user management, settings |
| **editor** | CRUD content & leads, no delete users/settings |

### Token Strategy

- **Access token:** 15 min, sent in `Authorization: Bearer`
- **Refresh token:** 7 days, HTTP-only cookie
- Admin routes wrapped in `ProtectedRoute` + `roleCheck('admin')`

---

## 12. Third-Party Integrations

| Service | Use | Phase |
|---------|-----|:-----:|
| **Cloudinary** | Image/video CDN | 1 |
| **SendGrid / SMTP** | Lead notification emails | 1 |
| **WhatsApp** | `wa.me/971XXXXXXXX` link (no API needed Phase 1) | 1 |
| **Google Maps embed** | Contact page | 1 |
| **Google Reviews API** | Auto-sync reviews | 3 |
| **Twilio WhatsApp API** | Automated lead alerts | 3 |
| **Stripe** | Deposit payments on quote accept | 3 |

### Lead Notification Flow

```
POST /api/v1/leads
  → Save to MongoDB
  → emailService.sendAdminAlert(lead)
  → emailService.sendClientConfirmation(lead)
  → (optional) whatsappService.notifySales(lead)
```

---

## 13. Environment Variables

> Each app has its **own `.env` file**. Never commit `.env` to Git — use `.env.example` as template.

### `backend/.env.example`

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interior_platform
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:5173          # CORS whitelist — frontend origin

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=admin@yourcompany.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### `frontend/.env.example`

```env
VITE_API_URL=http://localhost:5000/api/v1   # Backend API base URL
VITE_WHATSAPP_NUMBER=971559693009
VITE_GOOGLE_MAPS_EMBED_URL=
VITE_SITE_NAME=Interior Platform
```

### Production Values

| Variable | Development | Production |
|----------|-------------|------------|
| `FRONTEND_URL` (backend) | `http://localhost:5173` | `https://yourcompany.com` |
| `VITE_API_URL` (frontend) | `http://localhost:5000/api/v1` | `https://api.yourcompany.com/api/v1` |
| `MONGODB_URI` (backend) | `mongodb://localhost:27017/...` | MongoDB Atlas connection string |

---

## 14. Deployment Architecture

### 14.1 Production Setup

```
                    ┌─────────────────────────┐
  User browser  →   │  Vercel / Netlify       │  ← frontend/ (React build)
                    │  https://yourcompany.com│
                    └────────────┬────────────┘
                                 │ REST API (HTTPS)
                    ┌────────────▼────────────┐
                    │  Render / Railway / AWS │  ← backend/ (Express)
                    │  https://api.yourcompany.com
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  MongoDB Atlas          │  ← Cloud database
                    └─────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  Cloudinary             │  ← Images & videos CDN
                    └─────────────────────────┘
```

### 14.2 Recommended Hosts

| App | Host | Why |
|-----|------|-----|
| `frontend/` | **Vercel** or Netlify | Free tier, auto-deploy from Git, fast CDN |
| `backend/` | **Render** or Railway | Easy Node.js deploy, free tier available |
| MongoDB | **MongoDB Atlas** | Free 512MB cluster, managed backups |
| Media | **Cloudinary** | Free tier, image optimization |

### 14.3 Deploy Checklist

**Backend (`backend/`):**
- [ ] Set all env vars on Render/Railway dashboard
- [ ] Set `FRONTEND_URL` to production frontend domain
- [ ] Connect MongoDB Atlas URI
- [ ] Run seed script once: `npm run seed`
- [ ] Verify health: `GET https://api.yourcompany.com/api/v1/settings`

**Frontend (`frontend/`):**
- [ ] Set `VITE_API_URL` to production backend URL
- [ ] Build: `npm run build` → outputs `dist/`
- [ ] Deploy `dist/` to Vercel/Netlify
- [ ] Test lead form submits to production API

---

## 15. Development Phases

### Phase 1 — MVP (4–6 weeks)

- [ ] Scaffold monorepo (`frontend/` + `backend/` as separate apps)
- [ ] Wire API integration (`frontend/src/services/api.js` + backend CORS)
- [ ] MongoDB models + seed script
- [ ] Public pages: Home, Services, Projects, About, Contact, Book Consultation
- [ ] Lead form → API → email notification
- [ ] Admin: login, dashboard, leads, services, projects, reviews CRUD
- [ ] Image upload to Cloudinary
- [ ] Responsive UI with new color system
- [ ] WhatsApp FAB + contact CTAs

### Phase 2 — Enhanced CMS (2–3 weeks)

- [ ] Design styles pages + admin
- [ ] Quote builder (line items, PDF export)
- [ ] Trust pillars + site settings admin
- [ ] Careers / job applications
- [ ] Material catalog (experience center)

### Phase 3 — Client Portal & Automation (3–4 weeks)

- [ ] Client login to view quote & project timeline
- [ ] Google Reviews sync
- [ ] Payment on quote acceptance
- [ ] Analytics dashboard

---

## 16. Future Extensions

| Module | Description |
|--------|-------------|
| **3D tour embed** | Matterport / custom WebGL viewer on project pages |
| **AI room visualizer** | Upload photo → suggest styles (OpenAI / Replicate) |
| **Live chat** | Intercom / Crisp integration |
| **Multi-language** | EN + AR (RTL layout) |
| **Multi-branch** | Abu Dhabi, Sharjah office pages |
| **Vendor portal** | Subcontractor assignment on projects |
| **Inventory** | Track materials against quotes |
| **Mobile app** | React Native sharing API |

---

## Quick Start Commands (after scaffold)

```bash
# 1. Start MongoDB (from project root)
docker-compose up -d

# 2. Backend — terminal 1
cd backend
npm install
cp .env.example .env        # edit MONGODB_URI, secrets
npm run seed                # load demo data
npm run dev                 # → http://localhost:5000

# 3. Frontend — terminal 2
cd frontend
npm install
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api/v1
npm run dev                 # → http://localhost:5173

# 4. Verify integration
# Open http://localhost:5173
# Submit consultation form → check backend terminal for POST /api/v1/leads
# Admin login → http://localhost:5173/admin/login
```

### Run Both with One Command (optional root `package.json`)

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "install:all": "npm install --prefix backend && npm install --prefix frontend"
  },
  "devDependencies": { "concurrently": "^8.2.0" }
}
```

---

## Document Control

| Field | Value |
|-------|-------|
| Version | 1.1.0 |
| Last updated | 2026-08-10 |
| Author | Interior Platform Team |
| Status | Ready for implementation |
| Changelog | v1.1 — Separate `frontend/` + `backend/` architecture, API integration guide, deployment section |

---

*This document is the single source of truth for folder structure, data models, API contracts, and UI direction. Update version number when schemas or routes change.*
