# Software Requirements Specification (SRS)

## Interior Platform — MERN Stack Application

---

| Field | Detail |
|-------|--------|
| **Document ID** | SRS-INT-001 |
| **Version** | 1.0.0 |
| **Status** | Approved for Development |
| **Date** | 10 August 2026 |
| **Prepared for** | Interior Platform Project Team |
| **Related documents** | [SRC_DOCUMENTATION.md](./SRC_DOCUMENTATION.md) |
| **Reference prototypes** | [Halo Interiors](https://halointeriors.ae) · [Yalla Renovation](https://yallarenovation.com) |

---

## Revision History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2026-08-10 | Project Team | Initial SRS — full requirements baseline |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Overall Description](#2-overall-description)
3. [User Classes & Personas](#3-user-classes--personas)
4. [System Features — Functional Requirements](#4-system-features--functional-requirements)
5. [External Interface Requirements](#5-external-interface-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Data Requirements](#7-data-requirements)
8. [Use Cases](#8-use-cases)
9. [Business Rules](#9-business-rules)
10. [Constraints & Assumptions](#10-constraints--assumptions)
11. [Acceptance Criteria](#11-acceptance-criteria)
12. [Release Plan](#12-release-plan)
13. [Requirements Traceability Matrix](#13-requirements-traceability-matrix)
14. [Appendices](#14-appendices)

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the **functional and non-functional requirements** for the **Interior Platform** — a web-based MERN stack application for an interior fit-out, joinery, and property renovation company operating in Dubai, UAE.

This document is intended for:

- **Developers** — to design and implement the system
- **Project managers** — to plan sprints and track scope
- **QA engineers** — to write test cases and validate delivery
- **Stakeholders / clients** — to approve scope and sign off features
- **Designers** — to produce UI/UX aligned with requirements

### 1.2 Scope

#### 1.2.1 Product Name

**Interior Platform** (working title — final brand name TBD)

#### 1.2.2 Product Description

A full-stack web platform consisting of:

1. **Public marketing website** — showcases services, portfolio, design styles, reviews, and company credibility; captures leads via consultation and contact forms.
2. **Admin CMS dashboard** — allows staff to manage content, leads, projects, quotes, and site settings without developer involvement.
3. **REST API backend** — serves all data to the frontend; handles authentication, file storage, and notifications.

#### 1.2.3 In Scope (Phase 1–3)

| Phase | Scope |
|-------|-------|
| **Phase 1 (MVP)** | Public website, lead capture, admin CMS, core content management |
| **Phase 2** | Quote builder, design styles, careers, material catalog |
| **Phase 3** | Client portal, payment integration, review sync automation |

#### 1.2.4 Out of Scope (Initial Release)

- Native mobile applications (iOS/Android)
- Full ERP/accounting system integration
- Real-time live chat (Phase 3+ optional)
- Arabic (RTL) localization (future extension)
- AI room visualizer (future extension)
- Subcontractor/vendor portal (future extension)

### 1.3 Definitions, Acronyms & Abbreviations

| Term | Definition |
|------|------------|
| **MERN** | MongoDB, Express.js, React, Node.js |
| **CMS** | Content Management System |
| **API** | Application Programming Interface |
| **REST** | Representational State Transfer |
| **JWT** | JSON Web Token |
| **Lead** | A prospective customer inquiry submitted via a form |
| **Fit-out** | Complete interior construction and finishing of a property |
| **Joinery** | Custom woodwork — wardrobes, kitchens, cabinetry |
| **Snagging** | Property inspection to identify defects before handover |
| **NOC** | No Objection Certificate — developer/building management approval |
| **ERP** | Enterprise Resource Planning (quote/pricing system) |
| **CTA** | Call To Action (button/link prompting user action) |
| **FAB** | Floating Action Button (WhatsApp quick-contact button) |
| **SSR/SPA** | Single Page Application (React) |
| **CORS** | Cross-Origin Resource Sharing |
| **CDN** | Content Delivery Network (Cloudinary) |
| **UAT** | User Acceptance Testing |

### 1.4 References

| ID | Document / Source |
|----|-------------------|
| REF-01 | [SRC_DOCUMENTATION.md](./SRC_DOCUMENTATION.md) — Technical source structure |
| REF-02 | Halo Interiors website — functional reference prototype |
| REF-03 | Yalla Renovation website — functional reference prototype |
| REF-04 | IEEE 830-1998 — Recommended Practice for Software Requirements Specifications |
| REF-05 | UAE PDPL — Personal Data Protection Law (data privacy compliance) |

### 1.5 Document Conventions

- Requirements are uniquely identified: **FR-xxx** (functional), **NFR-xxx** (non-functional), **BR-xxx** (business rules)
- Priority levels: **Must** (P1) · **Should** (P2) · **Could** (P3) · **Won't** (deferred)
- ✅ = included in stated phase · 🔜 = future phase

---

## 2. Overall Description

### 2.1 Product Perspective

The Interior Platform is a **standalone web system** that replaces or consolidates the digital presence of two reference interior company websites into one unified platform with a refreshed visual identity.

#### 2.1.1 System Context Diagram

```
┌──────────────┐     HTTPS       ┌──────────────────┐     REST API     ┌──────────────────┐
│   Visitors   │ ──────────────► │    Frontend      │ ───────────────► │     Backend      │
│  (Public)    │                 │  React + Vite    │                  │  Express + Node  │
└──────────────┘                 └──────────────────┘                  └────────┬─────────┘
                                                                                  │
┌──────────────┐     HTTPS       ┌──────────────────┐                            │
│ Admin Staff  │ ──────────────► │  Admin Dashboard │ ───────────────────────────┘
└──────────────┘                 │  (React /admin)  │
                                 └──────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    ▼                      ▼                      ▼
              ┌──────────┐          ┌──────────┐          ┌──────────────┐
              │ MongoDB  │          │Cloudinary│          │ SMTP / Email │
              │  Atlas   │          │   CDN    │          │  SendGrid    │
              └──────────┘          └──────────┘          └──────────────┘
                    │
                    ▼
              ┌──────────────┐
              │  WhatsApp    │  (wa.me link — Phase 1)
              │  Google Maps │  (embed — Phase 1)
              └──────────────┘
```

#### 2.1.2 Architecture Principle

The **frontend** and **backend** are **separate deployable applications** communicating exclusively via a versioned REST API (`/api/v1`). No direct database access from the browser.

### 2.2 Product Functions (Summary)

| # | Function Area | Description |
|---|---------------|-------------|
| F-01 | **Marketing & Branding** | Present company services, credentials, portfolio, and trust signals |
| F-02 | **Lead Generation** | Capture consultation and contact inquiries from visitors |
| F-03 | **Portfolio Showcase** | Display completed projects filterable by category |
| F-04 | **Content Management** | Admin CRUD for all public-facing content |
| F-05 | **Lead Management** | Admin workflow to track, assign, and convert leads |
| F-06 | **Quotation** | Build and send itemized project quotes (Phase 2) |
| F-07 | **Authentication** | Secure admin access with role-based permissions |
| F-08 | **Notifications** | Email alerts on new leads; client confirmation emails |
| F-09 | **Media Management** | Upload and serve images/videos via CDN |
| F-10 | **Client Portal** | Clients view quotes and project status (Phase 3) |

### 2.3 Operating Environment

#### 2.3.1 Client (Browser)

| Requirement | Specification |
|-------------|---------------|
| Supported browsers | Chrome 100+, Firefox 100+, Safari 15+, Edge 100+ |
| Mobile browsers | iOS Safari 15+, Chrome Android 100+ |
| Minimum viewport | 320px width (mobile) |
| JavaScript | Required (SPA) |
| Internet | Required |

#### 2.3.2 Server Environment

| Component | Specification |
|-----------|---------------|
| Runtime | Node.js 20 LTS |
| Database | MongoDB 7.x (Atlas recommended for production) |
| Frontend hosting | Vercel / Netlify |
| Backend hosting | Render / Railway / AWS |
| OS | Linux (production) · Windows/macOS (development) |

### 2.4 Design & Implementation Constraints

| ID | Constraint |
|----|------------|
| CON-01 | Must use MERN stack (MongoDB, Express, React, Node.js) |
| CON-02 | Frontend and backend must be separate applications |
| CON-03 | All communication via REST API versioned at `/api/v1` |
| CON-04 | UI must differ visually from reference prototypes (new color scheme and design) |
| CON-05 | Functionality must match or exceed both reference prototypes |
| CON-06 | Must be responsive (mobile-first) |
| CON-07 | Must comply with UAE PDPL for personal data handling |
| CON-08 | No hardcoded secrets in frontend code |
| CON-09 | Admin panel must not be indexed by search engines |

---

## 3. User Classes & Personas

### 3.1 User Class Summary

| User Class | Description | Access Level | Phase |
|------------|-------------|:------------:|:-----:|
| **Visitor** | Unauthenticated public user browsing the website | Public pages only | 1 |
| **Prospective Client** | Visitor who submits a consultation or contact form | Public + form submit | 1 |
| **Editor** | Internal staff managing content and leads | Admin (limited) | 1 |
| **Admin** | Senior staff with full system control | Admin (full) | 1 |
| **Job Applicant** | Person applying for a position | Public careers form | 2 |
| **Client (Portal)** | Existing customer with project access | Client portal | 3 |

### 3.2 Personas

#### Persona 1 — Sarah (Property Owner)

| Attribute | Detail |
|-----------|--------|
| Age | 35–50 |
| Location | Dubai, UAE |
| Goal | Renovate villa before moving in |
| Behavior | Researches online, reads Google reviews, compares 2–3 companies |
| Needs | Clear services, portfolio proof, easy booking, WhatsApp contact |
| Pain points | Hidden costs, unreliable contractors, no transparency on timeline |

#### Persona 2 — Ahmed (Interior Designer)

| Attribute | Detail |
|-----------|--------|
| Age | 28–40 |
| Location | Dubai, UAE |
| Goal | Partner with a fit-out company for client projects |
| Behavior | Looks for joinery quality, project gallery, credentials |
| Needs | Portfolio by category, service detail pages, direct contact |
| Pain points | Vague scope descriptions, no evidence of quality execution |

#### Persona 3 — Fatima (Sales Admin)

| Attribute | Detail |
|-----------|--------|
| Role | Editor at the interior company |
| Goal | Respond to leads quickly, update website content |
| Behavior | Checks dashboard daily, updates project photos after completion |
| Needs | Lead notifications, simple CMS, lead status tracking |
| Pain points | Leads lost in email, developer needed for content updates |

#### Persona 4 — Omar (System Admin)

| Attribute | Detail |
|-----------|--------|
| Role | Admin / business owner |
| Goal | Oversee all operations, manage quotes, control settings |
| Behavior | Reviews KPIs, assigns leads, approves quotes |
| Needs | Full CRUD, user management, site settings, quote builder |
| Pain points | No visibility into lead pipeline, manual quote creation |

---

## 4. System Features — Functional Requirements

### 4.1 Module: Public Home Page

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-001 | The system shall display a hero section with headline, sub-headline, background image/video, and two CTAs: "Book Free Consultation" and "WhatsApp Us" | Must | 1 |
| FR-002 | The system shall display a trust pillars section with minimum 5 cards (warranty, timeline, pricing guarantee, free design, authority approvals) | Must | 1 |
| FR-003 | The system shall display animated company statistics (years of experience, projects completed, employees, inspections, average rating) | Must | 1 |
| FR-004 | The system shall display a preview of 6 featured services with link to full services page | Must | 1 |
| FR-005 | The system shall display featured projects with tab filters: All, Residential, Commercial, Retail | Must | 1 |
| FR-006 | The system shall display a horizontal scroll or grid of design styles | Should | 1 |
| FR-007 | The system shall display a split section for Property Inspection and Air Quality services | Should | 1 |
| FR-008 | The system shall display an embedded or hosted video showcase section | Should | 1 |
| FR-009 | The system shall display skills/expertise progress bars (space planning, project solutions, sustainability) | Could | 1 |
| FR-010 | The system shall display a reviews carousel with aggregate star rating badge | Must | 1 |
| FR-011 | The system shall display a partners/trusted brands logo strip | Must | 1 |
| FR-012 | The system shall display a final CTA banner before the footer | Must | 1 |
| FR-013 | The header shall be sticky and transition from transparent to solid background on scroll | Must | 1 |

---

### 4.2 Module: Services

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-020 | The system shall display all active services in a categorized grid layout | Must | 1 |
| FR-021 | The system shall support minimum 18 service categories including: Villa Renovation, Bespoke Joinery, Kitchen Renovation, Bathroom Renovation, Full Home Renovation, Decorative Paints, Terrazzo, Microcement, MEP & HVAC, Property Inspection, Air Quality, Authority Approvals, Project Management, and others | Must | 1 |
| FR-022 | Each service shall have a detail page accessible via SEO-friendly slug URL (`/services/:slug`) | Must | 1 |
| FR-023 | Service detail page shall show: title, description, feature list, hero image, and CTA to book consultation | Must | 1 |
| FR-024 | Admin shall be able to create, edit, deactivate, and reorder services | Must | 1 |
| FR-025 | Services shall be filterable by category: fitout, joinery, renovation, inspection, specialty | Should | 1 |

---

### 4.3 Module: Portfolio / Projects

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-030 | The system shall display a portfolio page with all published projects | Must | 1 |
| FR-031 | Projects shall be filterable by category: All, Residential, Commercial, Retail | Must | 1 |
| FR-032 | Each project shall have a detail page with: title, description, gallery, location, scope, duration, category | Must | 1 |
| FR-033 | Project detail page shall support before/after image comparison (optional per project) | Should | 1 |
| FR-034 | Admin shall be able to create, edit, publish/unpublish, and delete projects | Must | 1 |
| FR-035 | Admin shall be able to upload multiple gallery images per project via Cloudinary | Must | 1 |
| FR-036 | Admin shall mark projects as "featured" for home page display | Must | 1 |
| FR-037 | Projects shall support pagination on listing page (default 12 per page) | Should | 1 |

---

### 4.4 Module: Design Styles

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-040 | The system shall display a design styles catalog page | Should | 1 |
| FR-041 | The system shall support minimum 11 styles: Contemporary, Minimalist, Neoclassical, Mediterranean, Japandi, Arabian, Farmhouse, Industrial, Ultra Luxury, Boho Chic, Wellness | Should | 1 |
| FR-042 | Each style shall have a detail page with description, traits, image, and related projects | Should | 2 |
| FR-043 | Admin shall be able to CRUD design styles | Should | 2 |

---

### 4.5 Module: Reviews & Testimonials

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-050 | The system shall display client reviews with author name, rating (1–5 stars), and review text | Must | 1 |
| FR-051 | Reviews shall indicate source (Google or direct) and link to external review if available | Should | 1 |
| FR-052 | The system shall calculate and display aggregate average rating | Must | 1 |
| FR-053 | Admin shall be able to add, edit, publish/unpublish, and mark reviews as featured | Must | 1 |
| FR-054 | Featured reviews shall appear in the home page carousel | Must | 1 |

---

### 4.6 Module: About Page

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-060 | The system shall display company history, mission, and credentials | Must | 1 |
| FR-061 | The system shall display company statistics (years, projects, team size, inspections) | Must | 1 |
| FR-062 | The system shall display skills/expertise progress bars with percentage values | Could | 1 |
| FR-063 | The system shall display certifications and approvals (DM, DEWA, etc.) | Should | 1 |

---

### 4.7 Module: Lead Capture & Contact

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-070 | The system shall provide a "Book Free Consultation" form with fields: full name, email, phone, property type, service required, location, message, preferred contact method | Must | 1 |
| FR-071 | Property type options shall include: Villa, Apartment, Office, Commercial, Retail, Other | Must | 1 |
| FR-072 | Service required shall be a dropdown populated from active services in the database | Must | 1 |
| FR-073 | The system shall validate all required fields client-side and server-side before submission | Must | 1 |
| FR-074 | Phone number shall accept UAE format (+971) with validation | Must | 1 |
| FR-075 | On successful submission, the system shall: save lead to database, send admin notification email, send client confirmation email, display success message | Must | 1 |
| FR-076 | The system shall capture lead source (page URL, UTM parameters if present) automatically | Should | 1 |
| FR-077 | The system shall provide a contact page with contact form, company address, phone, email, and embedded Google Map | Must | 1 |
| FR-078 | The system shall display a floating WhatsApp button (FAB) on all public pages linking to `wa.me/{number}` | Must | 1 |
| FR-079 | The system shall rate-limit lead submissions to maximum 5 per IP per hour to prevent spam | Must | 1 |

---

### 4.8 Module: Partners

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-080 | The system shall display partner/client logos in a marquee or grid on home page | Must | 1 |
| FR-081 | Admin shall be able to add, edit, reorder, and deactivate partner entries | Must | 1 |

---

### 4.9 Module: Admin Authentication

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-090 | The system shall provide an admin login page at `/admin/login` | Must | 1 |
| FR-091 | Authentication shall use email + password with JWT (access token 15 min, refresh token 7 days) | Must | 1 |
| FR-092 | Refresh token shall be stored in HTTP-only secure cookie | Must | 1 |
| FR-093 | The system shall lock out login after 5 failed attempts within 15 minutes | Should | 1 |
| FR-094 | Admin routes shall redirect unauthenticated users to login page | Must | 1 |
| FR-095 | The system shall support role-based access: Admin and Editor | Must | 1 |
| FR-096 | Admin shall have full CRUD and delete permissions on all resources | Must | 1 |
| FR-097 | Editor shall have CRUD on content and leads but cannot delete users or modify site settings | Must | 1 |

---

### 4.10 Module: Admin Dashboard

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-100 | Dashboard shall display KPIs: new leads today, total open leads, recent leads list, total published projects | Must | 1 |
| FR-101 | Dashboard shall be accessible at `/admin` after authentication | Must | 1 |
| FR-102 | Admin sidebar shall provide navigation to all management modules | Must | 1 |

---

### 4.11 Module: Lead Management (Admin)

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-110 | Admin shall view a paginated list of all leads with filters: status, date range, service, assigned user | Must | 1 |
| FR-111 | Lead status values shall be: New, Contacted, Quoted, Won, Lost | Must | 1 |
| FR-112 | Admin shall view full lead detail including all submitted fields and timestamp | Must | 1 |
| FR-113 | Admin shall update lead status, assign to staff member, and add internal notes | Must | 1 |
| FR-114 | Notes shall record author and timestamp | Must | 1 |
| FR-115 | Admin shall delete leads (Admin role only) | Must | 1 |

---

### 4.12 Module: Quote Builder (Admin)

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-120 | Admin shall create itemized quotes linked to a lead | Should | 2 |
| FR-121 | Quote shall contain line items: description, category, quantity, unit, unit price, line total | Should | 2 |
| FR-122 | System shall auto-calculate subtotal, tax, discount, and grand total | Should | 2 |
| FR-123 | Quote shall have auto-generated number format: `Q-YYYY-NNNN` | Should | 2 |
| FR-124 | Quote status shall be: Draft, Sent, Accepted, Rejected | Should | 2 |
| FR-125 | Admin shall send quote to client via email as PDF attachment | Should | 2 |
| FR-126 | Admin shall download quote as PDF | Should | 2 |
| FR-127 | Currency shall default to AED | Should | 2 |

---

### 4.13 Module: Site Settings (Admin)

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-130 | Admin shall configure: company name, tagline, phone, WhatsApp number, email, address | Must | 1 |
| FR-131 | Admin shall configure social media links (Facebook, Instagram, LinkedIn, YouTube) | Should | 1 |
| FR-132 | Admin shall configure homepage statistics values | Must | 1 |
| FR-133 | Admin shall configure default SEO title, description, and OG image | Should | 1 |
| FR-134 | Admin shall upload/configure hero video URL | Could | 1 |

---

### 4.14 Module: Media Management (Admin)

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-140 | Admin shall upload images to Cloudinary via backend API | Must | 1 |
| FR-141 | Admin shall upload videos or add video URLs | Should | 1 |
| FR-142 | Media shall be assignable to placement: home, about, global | Should | 1 |
| FR-143 | Maximum image upload size shall be 10 MB; formats: JPG, PNG, WebP | Must | 1 |
| FR-144 | Maximum video upload size shall be 100 MB; formats: MP4, WebM | Should | 1 |

---

### 4.15 Module: Careers (Public + Admin)

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-150 | The system shall provide a careers page with job application form | Could | 2 |
| FR-151 | Job application form shall collect: full name, email, phone, position, experience, cover letter, resume upload | Could | 2 |
| FR-152 | Job applications via general inquiry form shall be rejected with redirect message to careers page | Could | 2 |
| FR-153 | Admin shall view and manage job applications | Could | 2 |

---

### 4.16 Module: Client Portal

| ID | Requirement | Priority | Phase |
|----|-------------|:--------:|:-----:|
| FR-160 | Clients shall log in to a portal to view their quote and project status | Could | 3 |
| FR-161 | Client shall accept or reject quotes online | Could | 3 |
| FR-162 | Client shall view project timeline and milestone updates | Could | 3 |
| FR-163 | Client shall download project documents | Could | 3 |

---

## 5. External Interface Requirements

### 5.1 User Interface Requirements

| ID | Requirement | Priority |
|----|-------------|:--------:|
| UI-01 | UI shall follow a new visual identity distinct from reference prototypes | Must |
| UI-02 | Primary color palette: warm terracotta/copper (#C4795A) with sage green secondary (#5C7A6B) | Must |
| UI-03 | Typography: DM Sans (body), Playfair Display (headings) | Must |
| UI-04 | All pages shall be responsive: mobile (320px+), tablet (768px+), desktop (1024px+) | Must |
| UI-05 | Touch targets shall be minimum 44×44px on mobile | Must |
| UI-06 | Loading states (skeletons/spinners) shall be shown during API fetches | Must |
| UI-07 | Form validation errors shall display inline below relevant fields | Must |
| UI-08 | Success/error toast notifications shall appear for user actions | Must |
| UI-09 | Admin panel shall use a distinct layout (sidebar navigation) separate from public site | Must |
| UI-10 | Public site shall include SEO meta tags per page (title, description, OG tags) | Must |
| UI-11 | All interactive elements shall have visible focus states for keyboard navigation | Should |
| UI-12 | Color contrast shall meet WCAG 2.1 AA minimum (4.5:1 for normal text) | Should |

#### 5.1.1 Public Page Map

| Page | Route | Priority |
|------|-------|:--------:|
| Home | `/` | Must |
| About | `/about` | Must |
| Services | `/services` | Must |
| Service Detail | `/services/:slug` | Must |
| Projects | `/projects` | Must |
| Project Detail | `/projects/:slug` | Must |
| Design Styles | `/design-styles` | Should |
| Design Style Detail | `/design-styles/:slug` | Should |
| Reviews | `/reviews` | Must |
| Contact | `/contact` | Must |
| Book Consultation | `/book-consultation` | Must |
| Careers | `/careers` | Could |
| 404 Not Found | `*` | Must |

#### 5.1.2 Admin Page Map

| Page | Route | Priority |
|------|-------|:--------:|
| Login | `/admin/login` | Must |
| Dashboard | `/admin` | Must |
| Leads | `/admin/leads` | Must |
| Lead Detail | `/admin/leads/:id` | Must |
| Services | `/admin/services` | Must |
| Projects | `/admin/projects` | Must |
| Reviews | `/admin/reviews` | Must |
| Partners | `/admin/partners` | Must |
| Design Styles | `/admin/design-styles` | Should |
| Quotes | `/admin/quotes` | Should |
| Media | `/admin/media` | Should |
| Settings | `/admin/settings` | Must |

---

### 5.2 Software Interface Requirements

| Interface | Protocol | Direction | Description |
|-----------|----------|-----------|-------------|
| Frontend ↔ Backend | HTTPS REST JSON | Bidirectional | All data operations |
| Backend ↔ MongoDB | MongoDB Wire Protocol | Backend → DB | Data persistence |
| Backend ↔ Cloudinary | HTTPS REST | Backend → CDN | Media upload/storage |
| Backend ↔ SMTP/SendGrid | SMTP / HTTPS API | Backend → Email | Notifications |
| Frontend ↔ Google Maps | iframe embed | Frontend → Maps | Contact page map |
| Frontend ↔ WhatsApp | HTTPS redirect | Frontend → WhatsApp | wa.me deep link |

#### 5.2.1 API Contract

- Base URL: `/api/v1`
- Format: JSON request/response
- Auth header: `Authorization: Bearer {accessToken}`
- Standard response envelope:

```json
{
  "success": true,
  "message": "Description",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 100 }
}
```

See [SRC_DOCUMENTATION.md §9](./SRC_DOCUMENTATION.md#9-api-specification) for full endpoint list.

---

### 5.3 Communications Interface

| ID | Requirement | Priority |
|----|-------------|:--------:|
| COM-01 | All production traffic shall use HTTPS/TLS 1.2+ | Must |
| COM-02 | Backend shall configure CORS to allow only the configured `FRONTEND_URL` | Must |
| COM-03 | Admin notification email shall be sent within 60 seconds of lead submission | Must |
| COM-04 | Client confirmation email shall include submitted details and next steps | Must |
| COM-05 | WhatsApp FAB shall open WhatsApp with pre-filled message template | Should |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-001 | Home page First Contentful Paint (FCP) | ≤ 2.0 seconds (3G) |
| NFR-002 | Home page Largest Contentful Paint (LCP) | ≤ 2.5 seconds |
| NFR-003 | API response time for public GET endpoints | ≤ 500ms (p95) |
| NFR-004 | API response time for form submissions | ≤ 1000ms (p95) |
| NFR-005 | Admin dashboard initial load | ≤ 3.0 seconds |
| NFR-006 | Image delivery via CDN with automatic optimization | Must |
| NFR-007 | Frontend bundle size (gzipped, initial load) | ≤ 300KB |
| NFR-008 | System shall support 100 concurrent users without degradation | Must |

### 6.2 Security

| ID | Requirement | Priority |
|----|-------------|:--------:|
| NFR-010 | All passwords shall be hashed with bcrypt (cost factor ≥ 10) | Must |
| NFR-011 | JWT secrets shall be stored in environment variables only | Must |
| NFR-012 | API shall use helmet.js for HTTP security headers | Must |
| NFR-013 | Input shall be sanitized to prevent NoSQL injection | Must |
| NFR-014 | Input shall be validated on both client and server | Must |
| NFR-015 | Admin panel shall not be indexed (`robots.txt` + `noindex` meta) | Must |
| NFR-016 | File uploads shall validate MIME type and file size server-side | Must |
| NFR-017 | Rate limiting shall be applied to auth and lead endpoints | Must |
| NFR-018 | CORS shall restrict origins to configured frontend URL only | Must |
| NFR-019 | Personal data shall be handled per UAE PDPL requirements | Must |
| NFR-020 | Access tokens shall expire after 15 minutes | Must |
| NFR-021 | Refresh tokens shall be HTTP-only, Secure, SameSite=Strict cookies | Must |

### 6.3 Reliability & Availability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-030 | System uptime (production) | ≥ 99.5% monthly |
| NFR-031 | Database backups (MongoDB Atlas) | Daily automated |
| NFR-032 | Graceful error handling — no unhandled server crashes | Must |
| NFR-033 | User-facing error messages shall not expose stack traces or internal details | Must |
| NFR-034 | Form submission shall not lose data on network failure (retry or clear error) | Must |

### 6.4 Maintainability

| ID | Requirement | Priority |
|----|-------------|:--------:|
| NFR-040 | Code shall follow consistent ESLint/Prettier configuration | Must |
| NFR-041 | Backend shall use modular structure: routes → controllers → models | Must |
| NFR-042 | Frontend shall use component-based architecture with separation of pages, components, services | Must |
| NFR-043 | API shall be versioned (`/api/v1`) to support future breaking changes | Must |
| NFR-044 | Environment-specific config shall use `.env` files (never committed) | Must |
| NFR-045 | Seed script shall populate demo data for development/testing | Must |

### 6.5 Usability

| ID | Requirement | Priority |
|----|-------------|:--------:|
| NFR-050 | New visitor shall reach consultation form within 2 clicks from any page | Must |
| NFR-051 | Consultation form shall be completable in under 3 minutes | Must |
| NFR-052 | Admin shall add a new project (with images) in under 5 minutes | Should |
| NFR-053 | All public pages shall be navigable without JavaScript errors | Must |
| NFR-054 | 404 page shall provide navigation back to home and key pages | Must |

### 6.6 Scalability

| ID | Requirement | Priority |
|----|-------------|:--------:|
| NFR-060 | Frontend and backend shall deploy independently without downtime for the other | Must |
| NFR-061 | Database shall support horizontal scaling via MongoDB Atlas | Should |
| NFR-062 | Media storage shall offload to CDN (not server disk) | Must |
| NFR-063 | API shall support pagination on all list endpoints | Must |

### 6.7 Compatibility & SEO

| ID | Requirement | Priority |
|----|-------------|:--------:|
| NFR-070 | Each public page shall have unique `<title>` and `<meta description>` | Must |
| NFR-071 | Open Graph tags shall be present for social sharing | Must |
| NFR-072 | Semantic HTML shall be used (headings, landmarks, alt text on images) | Must |
| NFR-073 | `sitemap.xml` and `robots.txt` shall be generated/served | Should |
| NFR-074 | URL structure shall be human-readable slugs (no IDs in public URLs) | Must |

---

## 7. Data Requirements

### 7.1 Data Entities

| Entity | Description | Retention |
|--------|-------------|-----------|
| User | Admin/editor accounts | Until account deleted |
| Lead | Customer inquiry records | Minimum 3 years |
| Service | Service catalog entries | Until deactivated |
| Project | Portfolio project records | Indefinite (published) |
| Review | Client testimonial records | Until deleted |
| Partner | Partner logo/brand records | Until deactivated |
| DesignStyle | Interior design style catalog | Until deactivated |
| TrustPillar | Trust/value proposition cards | Until deleted |
| Quote | Itemized price quotations | Minimum 7 years (financial) |
| Media | Video/image metadata | Until deleted |
| SiteSetting | Global site configuration (singleton) | Indefinite |
| JobApplication | Career form submissions | 1 year |

### 7.2 Data Validation Rules

| Field | Rule |
|-------|------|
| Email | Valid RFC 5322 format; lowercase stored |
| Phone | UAE format preferred: `+971XXXXXXXXX`; min 8 digits |
| Full name | 2–100 characters; required on all forms |
| Slug | Lowercase alphanumeric + hyphens; unique per entity type |
| Rating | Integer 1–5 |
| Lead status | Enum: new, contacted, quoted, won, lost |
| Quote currency | Default AED; ISO 4217 |
| Image URL | Valid HTTPS URL from Cloudinary |
| Password | Minimum 8 characters; at least 1 uppercase, 1 number |

### 7.3 Data Privacy (UAE PDPL)

| Requirement | Implementation |
|-------------|----------------|
| Collect only necessary personal data | Forms collect name, email, phone only |
| Inform users of data use | Privacy notice on forms |
| Secure storage | MongoDB Atlas encrypted at rest; HTTPS in transit |
| Right to deletion | Admin can delete lead records on request |
| No sale of personal data | Not applicable — internal use only |
| Admin access logging | Lead view/edit tracked via notes with author + timestamp |

### 7.4 Backup & Recovery

| Item | Policy |
|------|--------|
| Database backup frequency | Daily (MongoDB Atlas automated) |
| Backup retention | 30 days minimum |
| Recovery Time Objective (RTO) | ≤ 4 hours |
| Recovery Point Objective (RPO) | ≤ 24 hours |
| Media (Cloudinary) | Managed by CDN provider |

---

## 8. Use Cases

### UC-01: Visitor Books Free Consultation

| Item | Detail |
|------|--------|
| **Actor** | Visitor (Prospective Client) |
| **Precondition** | Website is accessible; services exist in database |
| **Trigger** | Visitor clicks "Book Free Consultation" |
| **Main Flow** | 1. Visitor navigates to `/book-consultation` · 2. Fills form (name, email, phone, property type, service, location, message) · 3. Submits form · 4. System validates input · 5. System saves lead with status "New" · 6. System sends admin alert email · 7. System sends client confirmation email · 8. Success message displayed |
| **Alternate Flow** | 4a. Validation fails → inline errors shown, form not submitted |
| **Postcondition** | Lead record created; admin notified |
| **Requirements** | FR-070 – FR-079 |

---

### UC-02: Visitor Browses Portfolio

| Item | Detail |
|------|--------|
| **Actor** | Visitor |
| **Precondition** | Published projects exist |
| **Trigger** | Visitor navigates to Projects page or home page featured section |
| **Main Flow** | 1. Visitor views project grid · 2. Selects category filter (Residential/Commercial/Retail) · 3. Grid updates · 4. Visitor clicks project card · 5. Project detail page loads with gallery and details |
| **Postcondition** | None (read-only) |
| **Requirements** | FR-030 – FR-037 |

---

### UC-03: Admin Manages Lead

| Item | Detail |
|------|--------|
| **Actor** | Editor / Admin |
| **Precondition** | Admin is authenticated; leads exist |
| **Trigger** | Admin opens Leads section |
| **Main Flow** | 1. Admin views lead list · 2. Filters by status "New" · 3. Opens lead detail · 4. Updates status to "Contacted" · 5. Adds internal note · 6. Assigns to team member |
| **Alternate Flow** | 4a. Admin creates quote from lead (Phase 2) |
| **Postcondition** | Lead status updated; note recorded with timestamp |
| **Requirements** | FR-110 – FR-115 |

---

### UC-04: Admin Adds New Project

| Item | Detail |
|------|--------|
| **Actor** | Editor / Admin |
| **Precondition** | Admin authenticated |
| **Trigger** | Admin clicks "Add Project" |
| **Main Flow** | 1. Admin fills project form (title, description, category, location, scope, duration) · 2. Uploads cover image · 3. Uploads gallery images · 4. Marks as featured (optional) · 5. Publishes · 6. Project appears on public portfolio |
| **Postcondition** | Published project visible on public site |
| **Requirements** | FR-034 – FR-036, FR-140 |

---

### UC-05: Admin Logs In

| Item | Detail |
|------|--------|
| **Actor** | Admin / Editor |
| **Precondition** | User account exists and is active |
| **Trigger** | User navigates to `/admin/login` |
| **Main Flow** | 1. Enters email and password · 2. System validates credentials · 3. Returns access token + sets refresh cookie · 4. Redirects to dashboard |
| **Alternate Flow** | 2a. Invalid credentials → error message; 5 failed attempts → temporary lockout |
| **Postcondition** | Authenticated session established |
| **Requirements** | FR-090 – FR-097 |

---

### UC-06: Admin Creates Quote (Phase 2)

| Item | Detail |
|------|--------|
| **Actor** | Admin |
| **Precondition** | Lead exists; admin authenticated |
| **Trigger** | Admin clicks "Create Quote" on lead detail |
| **Main Flow** | 1. Admin adds line items · 2. System calculates totals · 3. Admin saves as Draft · 4. Admin reviews and sends to client email · 5. Quote status → Sent |
| **Postcondition** | Quote emailed to client; lead status updated to "Quoted" |
| **Requirements** | FR-120 – FR-127 |

---

## 9. Business Rules

| ID | Rule |
|----|------|
| BR-01 | A lead must be assigned a status of "New" upon creation |
| BR-02 | Only authenticated admin users may access `/admin/*` routes |
| BR-03 | Only Admin role may delete records and manage user accounts |
| BR-04 | Deactivated services shall not appear in public listings or form dropdowns |
| BR-05 | Unpublished projects shall not appear on the public website |
| BR-06 | Featured projects limit: maximum 6 displayed on home page |
| BR-07 | Quote numbers must be unique and sequential per year |
| BR-08 | Lead submission requires valid email and phone |
| BR-09 | All prices in quotes shall be in AED unless explicitly changed |
| BR-10 | Job applications must be submitted through the careers page only |
| BR-11 | WhatsApp number shall be configurable via site settings (not hardcoded) |
| BR-12 | Company statistics on public pages shall reflect values from site settings |

---

## 10. Constraints & Assumptions

### 10.1 Assumptions

| ID | Assumption |
|----|------------|
| ASM-01 | Client will provide final brand name, logo, and company contact details before launch |
| ASM-02 | Client will provide professional photography for portfolio projects |
| ASM-03 | MongoDB Atlas account and Cloudinary account will be provisioned for production |
| ASM-04 | Client has a domain name for deployment |
| ASM-05 | SMTP or SendGrid credentials will be provided for email notifications |
| ASM-06 | Google reviews content will be manually entered initially (auto-sync in Phase 3) |
| ASM-07 | Initial admin user will be created via seed script |
| ASM-08 | English is the sole language for Phase 1 |

### 10.2 Dependencies

| Dependency | Required For | Owner |
|------------|--------------|-------|
| MongoDB Atlas | Data persistence | DevOps |
| Cloudinary | Media storage | DevOps |
| Vercel/Netlify | Frontend hosting | DevOps |
| Render/Railway | Backend hosting | DevOps |
| SMTP/SendGrid | Email notifications | Client |
| Domain + SSL | Production URLs | Client |
| Google Maps embed URL | Contact page map | Client |

---

## 11. Acceptance Criteria

### 11.1 Phase 1 MVP — Sign-Off Checklist

#### Public Website

- [ ] Home page renders all 14 sections per UI spec
- [ ] All public pages accessible and responsive on mobile, tablet, desktop
- [ ] Services page shows all active services with working detail pages
- [ ] Projects page filters correctly by category
- [ ] Consultation form submits successfully and shows confirmation
- [ ] Contact form submits successfully
- [ ] WhatsApp FAB opens correct number on all pages
- [ ] Reviews display with correct ratings and aggregate score
- [ ] Partners logo strip displays
- [ ] 404 page works for invalid URLs
- [ ] Page load meets NFR-001 and NFR-002 targets

#### Admin Panel

- [ ] Admin can log in and log out securely
- [ ] Editor role restrictions enforced (cannot delete users/settings)
- [ ] Dashboard shows accurate lead and project counts
- [ ] Full CRUD works for: services, projects, reviews, partners
- [ ] Lead list with filter, status update, notes, and assign works
- [ ] Image upload to Cloudinary works from admin
- [ ] Site settings update reflects on public site immediately

#### Backend & Integration

- [ ] All Phase 1 API endpoints return correct responses
- [ ] CORS configured correctly (frontend can call backend)
- [ ] Lead submission triggers admin + client emails within 60 seconds
- [ ] Rate limiting blocks spam submissions
- [ ] No secrets exposed in frontend bundle
- [ ] API returns proper error messages for invalid input

#### Security

- [ ] JWT auth flow works (login, refresh, logout)
- [ ] Protected routes reject unauthenticated requests
- [ ] Passwords stored as bcrypt hashes
- [ ] Admin panel excluded from search engine indexing

### 11.2 Phase 2 — Sign-Off Checklist

- [ ] Design styles pages and admin CRUD complete
- [ ] Quote builder creates, calculates, saves, and emails PDF
- [ ] Trust pillars manageable from admin
- [ ] Careers page and job application flow complete
- [ ] Site settings admin fully functional

### 11.3 Phase 3 — Sign-Off Checklist

- [ ] Client portal login and quote view functional
- [ ] Online quote accept/reject works
- [ ] Google Reviews auto-sync operational
- [ ] Payment integration on quote acceptance (if scoped)

---

## 12. Release Plan

### 12.1 Phase Overview

| Phase | Duration | Deliverables | Success Metric |
|-------|----------|--------------|----------------|
| **Phase 1 — MVP** | 4–6 weeks | Public site + admin CMS + lead capture | Live site accepting leads; admin managing content |
| **Phase 2 — Enhanced CMS** | 2–3 weeks | Quotes, design styles, careers, settings | Admin creating quotes; all content self-managed |
| **Phase 3 — Portal & Automation** | 3–4 weeks | Client portal, review sync, payments | Clients viewing quotes; automated review import |

### 12.2 Phase 1 Sprint Breakdown (Suggested)

| Sprint | Focus | Key Deliverables |
|--------|-------|-----------------|
| Sprint 1 | Foundation | Repo scaffold, DB models, seed, auth API, admin login |
| Sprint 2 | Public core | Home, About, Services pages, API integration |
| Sprint 3 | Portfolio & leads | Projects pages, consultation form, email notifications |
| Sprint 4 | Admin CMS | Admin CRUD for all content, lead management, image upload |
| Sprint 5 | Polish & QA | UI refinement, responsive testing, security audit, UAT |

---

## 13. Requirements Traceability Matrix

| Requirement | Use Case | Module | Phase | Test Priority |
|-------------|----------|--------|:-----:|:-------------:|
| FR-001 – FR-013 | UC-02 | Home | 1 | High |
| FR-020 – FR-025 | UC-02 | Services | 1 | High |
| FR-030 – FR-037 | UC-02 | Projects | 1 | High |
| FR-040 – FR-043 | UC-02 | Design Styles | 2 | Medium |
| FR-050 – FR-054 | UC-02 | Reviews | 1 | High |
| FR-060 – FR-063 | UC-02 | About | 1 | Medium |
| FR-070 – FR-079 | UC-01 | Leads | 1 | Critical |
| FR-080 – FR-081 | UC-02 | Partners | 1 | Medium |
| FR-090 – FR-097 | UC-05 | Auth | 1 | Critical |
| FR-100 – FR-102 | UC-03 | Dashboard | 1 | High |
| FR-110 – FR-115 | UC-03 | Lead Admin | 1 | Critical |
| FR-120 – FR-127 | UC-06 | Quotes | 2 | High |
| FR-130 – FR-134 | — | Settings | 1 | High |
| FR-140 – FR-144 | UC-04 | Media | 1 | High |
| FR-150 – FR-153 | — | Careers | 2 | Low |
| FR-160 – FR-163 | — | Client Portal | 3 | Medium |
| NFR-001 – NFR-008 | — | Performance | 1 | High |
| NFR-010 – NFR-021 | UC-05 | Security | 1 | Critical |

---

## 14. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| Fit-out | The process of making an interior space ready for occupation — includes all construction, finishing, MEP |
| Joinery | Custom-made woodwork including kitchens, wardrobes, doors, and cabinetry |
| Snagging | Detailed inspection of a property to identify defects before final handover |
| Turnkey | Complete end-to-end project delivery from design to final handover |
| MEP | Mechanical, Electrical, and Plumbing works |
| DEWA | Dubai Electricity and Water Authority |
| DM | Dubai Municipality |
| Microcement | Continuous cement-based decorative coating for floors and walls |
| Terrazzo | Composite material for floor and wall treatments |
| Japandi | Design style blending Japanese minimalism with Scandinavian functionality |

### Appendix B: Initial Service Seed List

1. Villa Renovation  
2. Full Home Renovation  
3. Kitchen Renovation  
4. Bathroom Renovation  
5. Bespoke Joinery  
6. Custom Furniture  
7. Decorative Paints  
8. Terrazzo  
9. Microcement  
10. Stretch Ceiling  
11. Gypsum Works  
12. Tile Installation  
13. Marble Installation  
14. MEP & HVAC  
15. Automation  
16. Window Glazing  
17. Contracting  
18. Property Inspection  
19. Air Quality / Halo Shield  
20. Authority Approvals  
21. Project Management  

### Appendix C: Initial Trust Pillars

1. **Experienced Planners** — Custom proposal with detailed scope of work  
2. **Planned Installation** — 8–10 weeks average for full renovation  
3. **Warranty** — Up to 10 years on kitchens, wardrobes, and cabinets  
4. **Best Price Guarantee** — No hidden costs on materials  
5. **Free Design Services** — Basic 2D/3D designs included  
6. **Authority Approvals** — In-house NOC and approval handling  

### Appendix D: Related Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Source Documentation | [SRC_DOCUMENTATION.md](./SRC_DOCUMENTATION.md) | Technical architecture, folder structure, API spec, DB schemas |
| SRS (this document) | [SRS_DOCUMENTATION.md](./SRS_DOCUMENTATION.md) | Business & software requirements |

### Appendix E: Approval Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Client / Product Owner | | | |
| Project Manager | | | |
| Lead Developer | | | |
| QA Lead | | | |

---

## Document Control

| Field | Value |
|-------|-------|
| Document ID | SRS-INT-001 |
| Version | 1.0.0 |
| Status | Approved for Development |
| Last Updated | 2026-08-10 |
| Next Review | Before Phase 2 kickoff |

---

*This SRS is the authoritative requirements baseline for the Interior Platform. All design, development, and testing activities shall trace back to requirements identified in this document. For technical implementation details, refer to [SRC_DOCUMENTATION.md](./SRC_DOCUMENTATION.md).*
