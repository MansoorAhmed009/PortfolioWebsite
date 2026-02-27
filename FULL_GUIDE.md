# Full Guide: Run, Explore, Configure CMS, and Push to GitHub

This guide is the complete operational workflow for this project.

## 1) Prerequisites

Install:

- Node.js 24.x (recommended)
- npm
- Git
- GitHub account

Optional accounts:

- Sanity (CMS)
- Formspree (contact form)
- Giscus + GitHub Discussions (comments)
- Google Analytics 4
- Vercel

Verify:

```powershell
node -v
npm -v
git --version
```

Project expects Node: `>=24 <25`.

## 2) Open Project Folder

```powershell
cd "C:\PortfolioWebsite"
```

## 3) Install Dependencies

```powershell
npm install --include=dev
```

If you see `EBADENGINE`, switch to Node 24.14.0.

## 4) Configure Environment Variables

Copy template:

```powershell
Copy-Item .env.example .env.local
```

Open:

```powershell
notepad .env.local
```

Minimum required:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_SESSION_SECRET=your_long_random_secret_32_plus_chars
```

For full features, also configure:

- Sanity: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_WRITE_TOKEN`
- Formspree: `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
- Giscus: all `NEXT_PUBLIC_GISCUS_*`
- GA4: `NEXT_PUBLIC_GA_ID`

## 5) Run Locally

```powershell
npm run dev
```

Open:

- http://localhost:3000

## 6) Explore Features (Checklist)

### Public site

- `/` Home: hero, animated background, featured content
- `/about`: technical profile and skill radial indicators
- `/projects`: project grid
- `/projects/[slug]`: project detail page
- `/blog`: post grid
- `/blog/[slug]`: full article + Giscus comments
- `/contact`: hire/inquiry form

### Private admin

- `/admin/login`: sign in
- `/admin`: dynamic quick-link dashboard (CMS-backed)
- `/studio`: Sanity Studio (private route)

## 7) Sanity CMS Setup

### A) Create Sanity project

In a separate terminal:

```powershell
npx sanity@latest init
```

Follow prompts and note:

- Project ID
- Dataset (use `production`)

### B) Add env vars

Set in `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
```

### C) Create write token

In Sanity manage UI, create token with write permissions.
Set:

```env
SANITY_API_WRITE_TOKEN=your_write_token
```

### D) Open Studio

1. Login at `/admin/login`
2. Open `/studio`
3. Create content types:
   - `post`
   - `project`
   - `siteSettings`
   - `adminSettings`

## 8) Admin Quick Links (Dynamic)

Admin dashboard cards are no longer hardcoded.

Manage them in Sanity:

- Document type: `adminSettings`
- Field: `quickLinks[]`

Each link supports:

- title
- description
- href
- category
- order
- enabled
- external/internal switch

## 9) CRUD API Endpoints (Protected)

All write operations require admin session cookie + Sanity write token.

### Posts

- `GET /api/posts`
- `POST /api/posts`
- `PATCH /api/posts/:id`
- `DELETE /api/posts/:id`

### Projects

- `GET /api/projects`
- `POST /api/projects`
- `PATCH /api/projects/:id`
- `DELETE /api/projects/:id`

### Admin quick links

- `GET /api/admin/quick-links`
- `PUT /api/admin/quick-links`

## 10) Build and Production Test

```powershell
npm run typecheck
npm run lint
npm run build
npm run start
```

If build fails with `TypeError: generate is not a function`, confirm Node is 24.14.0 and reinstall dependencies.

## 11) Push to GitHub

### A) Create repository on GitHub

Create new repo (without initializing files if possible).

### B) Push from terminal

```powershell
git init
git add .
git commit -m "Refactor: performance, security, API CRUD, dynamic admin CMS"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

If remote exists:

```powershell
git remote remove origin
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## 12) Deploy to Vercel

1. Import GitHub repository in Vercel
2. Add all env vars from `.env.local`
3. Deploy
4. Set `NEXT_PUBLIC_SITE_URL` to production URL
5. Redeploy

## 13) Performance + Quality Targets

Use Lighthouse and Core Web Vitals targets:

- Lighthouse performance: 90+
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1
- TTFB: < 800ms

Command suggestions:

- Chrome Lighthouse (desktop + mobile)
- Vercel Analytics + Web Vitals dashboard

## 14) Troubleshooting

- `EBUSY unlink`: close editors + stop node processes + retry install
- `EBADENGINE`: switch to Node 24.14.0
- `/studio` issues: verify project ID and write token
- API returns 401: login again at `/admin/login`
- API returns 503: missing Sanity write configuration
- Comments missing: verify all `NEXT_PUBLIC_GISCUS_*` variables
- Contact form failing: verify Formspree endpoint
