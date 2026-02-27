# Performance + Architecture Refactor

This document captures the refactor patterns applied to the project and the expected performance/scalability behavior.

## 1) Refactored Structure

```text
app/
  api/
    admin/quick-links/route.ts
    posts/route.ts
    posts/[id]/route.ts
    projects/route.ts
    projects/[id]/route.ts
  admin/
  blog/
  projects/
  studio/
  error.tsx
  loading.tsx
  robots.ts
  sitemap.ts
components/
  admin/
  blog/
  comments/
  forms/
  layout/
  sections/
  studio/
  ui/
lib/
  api/
    admin-auth.ts
    http.ts
    schemas.ts
  sanity/
    client.ts
    data.ts
    env.ts
    image.ts
    queries.ts
  auth.ts
  cache.ts
  mock-data.ts
  types.ts
sanity/
  schemaTypes/
    adminSettingsType.ts
    postType.ts
    projectType.ts
    siteSettingsType.ts
```

## 2) Performance Improvements Applied

- Removed non-essential global client-side animation runtime
- Replaced Framer-heavy wrappers with CSS animation classes for lightweight motion
- Eliminated global route transition client wrapper from root layout
- Added Next Image optimization for blog and project cards/detail pages
- Added lazy loading for Giscus comments via dynamic import
- Introduced cache tags + revalidation strategy for CMS-backed content

## 3) Rendering Strategy

- Server Components by default for pages and most sections
- Client Components only where interaction is required:
  - header mobile menu
  - contact form
  - login form
  - giscus comments
  - sanity studio client wrapper

## 4) Caching + ISR Strategy

- `lib/cache.ts` centralizes:
  - `cacheTags.posts`
  - `cacheTags.projects`
  - `cacheTags.adminQuickLinks`
  - revalidate intervals
- Sanity fetches use `next: { revalidate, tags }`
- CRUD handlers trigger `revalidateTag` and `revalidatePath`

## 5) Security Hardening

- Replaced plain shared-secret cookie with signed JWT session cookie (`jose`)
- Middleware verifies signed token before `/admin` and `/studio`
- API write routes require valid admin session
- Payload validation with Zod for all write endpoints
- Path sanitization for post-login redirects

## 6) Admin Scalability

- Admin dashboard quick links moved from static constants to CMS model (`adminSettings`)
- Dashboard content can now scale without code deploys
- Added API route to read/update quick links

## 7) API Design

- `lib/api/http.ts` for consistent JSON success/error envelopes
- `lib/api/admin-auth.ts` for auth guard reuse
- `lib/api/schemas.ts` for payload schema validation

## 8) Error + Loading UX

- Added global and route-level boundaries:
  - `app/error.tsx`
  - `app/blog/error.tsx`
  - `app/projects/error.tsx`
  - `app/admin/error.tsx`
- Added route loading skeletons:
  - `app/blog/loading.tsx`
  - `app/projects/loading.tsx`
  - `app/admin/loading.tsx`

## 9) Suggested Metrics and Targets

### Lighthouse targets

- Performance >= 90
- Accessibility >= 95
- Best Practices >= 95
- SEO >= 95

### Core Web Vitals targets

- LCP < 2.5s
- INP < 200ms
- CLS < 0.1

### Operational metrics

- API error rate < 1%
- Admin API p95 latency < 500ms
- Cache hit ratio > 80% for content fetches

## 10) Functional and Non-Functional Improvement Suggestions

### Functional

- Add rich admin UI for CRUD inside app (currently API + Sanity Studio available)
- Add draft/preview workflow for blog and projects
- Add role-based access (editor/admin) if multi-user team grows

### Non-functional

- Add request-level rate limiting on write APIs
- Add audit logging for admin write operations
- Add E2E tests (Playwright) for auth, CRUD, and content rendering
- Add bundle analyzer in CI to prevent JS regressions
- Add uptime and error monitoring (Sentry/Datadog)