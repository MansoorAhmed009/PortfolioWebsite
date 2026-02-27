# Quick Start (Beginner)

Use this for the fastest setup.

## 1) Use Node 24.x

This project is configured for Node `>=24 <25`.

```powershell
node -v
```

If you are not on Node 24, install `nvm-windows` and switch:

```powershell
nvm install 24.14.0
nvm use 24.14.0
node -v
```

## 2) Open Project

```powershell
cd "C:\PortfolioWebsite"
```

## 3) Install Dependencies

```powershell
npm install --include=dev
```

## 4) Create `.env.local`

```powershell
Copy-Item .env.example .env.local
notepad .env.local
```

Set minimum values:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000

ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourStrongPassword123!
ADMIN_SESSION_SECRET=put_a_long_random_secret_here
```

## 5) Run App

```powershell
npm run dev
```

Open `http://localhost:3000`

## 6) Explore

- `/`
- `/about`
- `/projects`
- `/blog`
- `/contact`
- `/admin/login`

## 7) Push to GitHub

```powershell
git init
git add .
git commit -m "Initial website setup"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```
