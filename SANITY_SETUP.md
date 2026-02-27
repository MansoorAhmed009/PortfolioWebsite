# Sanity Setup (Step-by-Step)

This project already includes Sanity schema + Studio integration. Follow these steps to connect your own Sanity project.

## 1) Create a Sanity Project

From project root:

```powershell
cd "C:\PortfolioWebsite"
npx sanity@latest init
```

Pick:

- Project type: new project (or existing)
- Dataset: `production`

Save the generated Project ID.

## 2) Configure `.env.local`

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01
SANITY_STUDIO_PROJECT_TITLE=Material Informatics Authority
```

## 3) Create a Write Token

1. Open Sanity Manage dashboard
2. Go to API -> Tokens
3. Create token with write permissions
4. Set in `.env.local`:

```env
SANITY_API_WRITE_TOKEN=your_write_token
```

Optional read token:

```env
SANITY_API_READ_TOKEN=your_read_token
```

## 4) Run and Open Studio

```powershell
npm run dev
```

Open:

- `http://localhost:3000/admin/login`
- `http://localhost:3000/studio`

## 5) Create Documents

Create and publish these types:

- `post`
- `project`
- `siteSettings`
- `adminSettings`

## 6) Verify Dynamic Rendering

- `/blog` should show `post` content
- `/projects` should show `project` content
- `/admin` quick links should reflect `adminSettings.quickLinks`

## 7) Troubleshooting

- `Sanity is not configured` page:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` missing or invalid
- Write API returns 503:
  - `SANITY_API_WRITE_TOKEN` missing
- No content rendered:
  - Documents not published in Sanity
- `/studio` errors:
  - confirm Node is 24.14.0
