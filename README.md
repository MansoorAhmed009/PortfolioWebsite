# Material Informatics Authority Website

Production-grade personal authority platform built with Next.js App Router, TypeScript, Tailwind, Sanity CMS, Giscus, and Formspree.

## Highlights

- High-performance public site (`/`, `/about`, `/projects`, `/blog`, `/contact`)
- Dynamic CMS content via Sanity (posts, projects, settings, admin quick links)
- Private admin routes (`/admin`, `/studio`) protected by signed session cookie
- Protected API CRUD routes for posts/projects/admin quick links
- ISR + cache tags + targeted revalidation
- Optimized media rendering with Next Image + Sanity image URLs
- Global and route-level loading/error boundaries
- SEO + Open Graph + JSON-LD + `sitemap.xml` + `robots.txt`

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Sanity + next-sanity
- Giscus comments
- Formspree contact delivery
- Google Analytics 4

## Requirements

- Node `>=24 <25` (Node 24.x recommended)

## Quick Setup

```powershell
cd "C:\PortfolioWebsite"
npm install --include=dev
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

See [`.env.example`](C:/PortfolioWebsite/.env.example) for the full list.

Core:

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

Integrations:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_WRITE_TOKEN`
- `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
- `NEXT_PUBLIC_GISCUS_*`
- `NEXT_PUBLIC_GA_ID`

## API Endpoints

Protected write APIs (admin session required):

- `GET/POST /api/posts`
- `PATCH/DELETE /api/posts/:id`
- `GET/POST /api/projects`
- `PATCH/DELETE /api/projects/:id`
- `GET/PUT /api/admin/quick-links`

## Documentation

- Quick start: [QUICK_START.md](C:/PortfolioWebsite/QUICK_START.md)
- Full setup and deployment: [FULL_GUIDE.md](C:/PortfolioWebsite/FULL_GUIDE.md)
- Architecture/performance guide: [PERFORMANCE_ARCHITECTURE.md](C:/PortfolioWebsite/PERFORMANCE_ARCHITECTURE.md)
- Sanity setup flow: [SANITY_SETUP.md](C:/PortfolioWebsite/SANITY_SETUP.md)
