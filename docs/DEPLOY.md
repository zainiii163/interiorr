# Free Production Deployment

Deploy the Interior platform for **$0/month** using:

| Service | Role | Cost |
|---------|------|------|
| [Vercel](https://vercel.com) | Frontend (React) | Free |
| [Render](https://render.com) | Backend (Express API) | Free |
| [MongoDB Atlas](https://mongodb.com/atlas) | Database | Free (M0) |
| [Cloudinary](https://cloudinary.com) | Admin image uploads | Free tier (optional) |

---

## Overview

```
Browser  →  your-app.vercel.app          (frontend)
              └─ /api/* proxied to  →  interior-api.onrender.com  (backend)
                                              └─  MongoDB Atlas
```

The frontend calls `/api/v1` on the same domain. Vercel rewrites those requests to Render, so no CORS or cookie issues.

---

## Step 1 — MongoDB Atlas (database)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. **Create** → **Shared (M0 FREE)** cluster
3. **Database Access** → Add user (save username + password)
4. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)
   - Required so Render can connect
5. **Connect** → **Drivers** → copy connection string  
   Example: `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/interior_platform`

---

## Step 2 — Render (backend API)

### Option A — Blueprint (easier)

1. Push this repo to GitHub
2. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
3. Connect the `Interior` repository
4. When prompted, set:
   - `MONGODB_URI` — Atlas connection string from Step 1
   - `FRONTEND_URL` — use a placeholder for now: `https://your-app.vercel.app` (update after Step 3)
5. Deploy and wait for **Live** status
6. Copy your service URL, e.g. `https://interior-api.onrender.com`

### Option B — Manual web service

1. **New** → **Web Service** → connect GitHub repo
2. Settings:

   | Field | Value |
   |-------|-------|
   | Root Directory | `backend` |
   | Build Command | `npm install` |
   | Start Command | `npm start` |
   | Instance Type | **Free** |

3. Environment variables:

   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/interior_platform
   JWT_ACCESS_SECRET=<run: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
   JWT_REFRESH_SECRET=<another random 32+ char string>
   JWT_ACCESS_EXPIRES=15m
   JWT_REFRESH_EXPIRES=7d
   FRONTEND_URL=https://your-app.vercel.app
   ADMIN_EMAIL=admin@interior.com
   ```

4. Deploy → copy URL (e.g. `https://interior-api.onrender.com`)

### Seed the database (once)

1. Render dashboard → your service → **Shell**
2. Run:

   ```bash
   npm run seed
   ```

3. Verify: open `https://YOUR-RENDER-URL.onrender.com/api/v1/services` — should return JSON

**Default admin:** `admin@interior.com` / `Admin@123` — change after first login.

---

## Step 3 — Update Vercel proxy config

Before deploying the frontend, edit `frontend/vercel.json` and replace the placeholder:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://interior-api.onrender.com/api/:path*"
    }
  ]
}
```

Use your actual Render URL. Commit and push.

---

## Step 4 — Vercel (frontend)

1. [vercel.com](https://vercel.com) → sign up with GitHub
2. **Add New** → **Project** → import `Interior` repo
3. Settings:

   | Field | Value |
   |-------|-------|
   | Root Directory | `frontend` |
   | Framework Preset | Vite |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |

4. **Deploy**
5. Copy your live URL, e.g. `https://interior-platform.vercel.app`

---

## Step 5 — Link frontend ↔ backend

1. Render dashboard → **Environment** → set:

   ```env
   FRONTEND_URL=https://interior-platform.vercel.app
   ```

   Use your exact Vercel URL (no trailing slash).

2. **Save Changes** → Render redeploys automatically

---

## Step 6 — Test

| Check | URL |
|-------|-----|
| Homepage | `https://your-app.vercel.app` |
| API via proxy | `https://your-app.vercel.app/api/v1/services` |
| Admin login | `https://your-app.vercel.app/admin/login` |
| Submit a lead | Contact / Consultation form |

---

## Optional — Cloudinary (admin uploads)

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Add to Render environment:

   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

Without Cloudinary, uploads fall back to a base64 stub (works for testing, not ideal for production).

---

## Optional — Email notifications (leads)

Add to Render environment:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
```

Use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular password.

---

## Free tier limits

| Limit | Note |
|-------|------|
| Render sleeps after ~15 min idle | First request may take 30–60 seconds to wake |
| Atlas M0 = 512 MB storage | Enough for CMS content + leads to start |
| Render 750 hours/month | One free service is always within limit |

Upgrade Render to **Starter ($7/mo)** when you need no sleep / faster response.

---

## Custom domain (optional, free on Vercel)

1. Vercel → Project → **Domains** → add `yourcompany.com`
2. Update DNS as Vercel instructs
3. Update Render `FRONTEND_URL` to `https://yourcompany.com`
4. No change needed in `vercel.json` — API proxy stays on same domain

---

## Updating after code changes

Push to GitHub — Vercel and Render auto-redeploy.

To re-seed (⚠️ wipes data):

```bash
# Render Shell
npm run seed
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| API 404 on Vercel | Check `frontend/vercel.json` Render URL is correct |
| CORS error | Set `FRONTEND_URL` on Render to exact Vercel URL (https, no slash) |
| Admin login fails | Run `npm run seed` in Render Shell; check JWT secrets are set |
| Empty homepage | Backend sleeping — wait 60s and refresh; or upgrade Render |
| MongoDB connection failed | Atlas → Network Access → allow `0.0.0.0/0` |
| Images not uploading | Add Cloudinary env vars on Render |
