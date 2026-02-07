# Impero Luxury Jewelry App

## Overview
A luxury gold and jewelry e-commerce application built with React + Express. Features product catalog, gold rate tracking, virtual try-on, and admin dashboard.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Wouter (routing), Framer Motion, Three.js
- **Backend**: Express.js on port 3000
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Session-based with bcrypt password hashing

## Project Structure
- `client/` - React frontend (Vite dev server on port 5000)
- `api/` - Express backend API
- `api/_lib/` - Database connection
- `shared/` - Shared schema definitions (Drizzle ORM)
- `attached_assets/` - Static image assets

## Workflows
- **Frontend**: `npm run dev` (port 5000, webview)
- **Backend API**: `npx tsx api/index.ts` (port 3000, console)

## Authentication
- Session-based auth with express-session
- Passwords hashed with bcrypt (12 salt rounds)
- Endpoints: `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- Frontend auth hook: `client/src/hooks/use-auth.tsx`
- Auth page: `client/src/pages/auth.tsx`

## Key APIs
- `/api/gold-rates` - Live gold rates (GoldAPI -> CoinGecko -> fallback)
- `/api/products` - Product CRUD
- `/api/analytics/*` - Activity logging and stats (admin only)

## Recent Changes
- 2026-02-07: Set up PostgreSQL database and pushed schema
- 2026-02-07: Configured Vite on port 5000 with proxy to backend on port 3000
- 2026-02-07: Upgraded password hashing from SHA-256 to bcrypt
- 2026-02-07: Restricted CORS to known origins (localhost + Replit domain)
