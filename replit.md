# Impero Luxury Jewelry App

## Overview
A luxury gold and jewelry e-commerce application built with React + Express. Features product catalog, gold rate tracking, virtual try-on, and admin dashboard. Packaged as native iOS/Android apps via Capacitor.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Wouter (routing), Framer Motion, Three.js
- **Backend**: Express.js on port 3000
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Session-based with bcrypt password hashing
- **Mobile**: Capacitor v6 (iOS & Android native wrappers)

## Project Structure
- `client/` - React frontend (Vite dev server on port 5000)
- `api/` - Express backend API
- `api/_lib/` - Database connection
- `shared/` - Shared schema definitions (Drizzle ORM)
- `attached_assets/` - Static image assets
- `ios/` - Native iOS project (Xcode)
- `android/` - Native Android project (Android Studio)

## Workflows
- **Frontend**: `npm run dev` (port 5000, webview)
- **Backend API**: `npx tsx api/index.ts` (port 3000, console)

## Mobile App (Capacitor)
- **Bundle ID**: `com.imperodigold.app`
- **App Name**: Impero Di Golds & Diamonds
- **Build**: `npm run build:mobile` (builds web + syncs to native)
- **Build Android AAB**: `npm run build:android` (builds signed AAB directly on Replit)
- **Sync**: `npm run cap:sync` (syncs web assets to native projects)
- **Open iOS**: `npm run cap:open:ios` (opens Xcode project)
- **Android Signing**: Keystore at ~/impero-release-key.jks, credentials in android/keystore.properties (gitignored)
- **Android SDK**: Installed at ~/android-sdk (platform 34, build-tools 34.0.0)
- **iOS**: Download ios/ folder, open in Xcode on Mac, build and submit
- **Android**: Run `npm run build:android`, download the `impero-di-golds-release.aab` file, upload to Google Play Console

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
- 2026-02-07: Added Capacitor v6 for iOS/Android native app packaging
- 2026-02-07: Added PWA manifest and native meta tags
- 2026-02-07: Set up Android build toolchain (JDK 17, Android SDK 34) for building AAB directly on Replit
- 2026-02-07: Created signing keystore and secured credentials via keystore.properties
