# AnajakSMP.xyz — Complete Installation & Setup Guide

Welcome to **AnajakSMP.xyz**, the official Minecraft server store and ecommerce platform.

## 1. Architecture Overview

The repository is organized as a clean npm workspaces monorepo:

```
AnajakSMP/
├── apps/
│   ├── web/          # React + Vite + TypeScript + Tailwind CSS Frontend
│   └── api/          # Node.js + Express + TypeScript Backend REST API
├── packages/
│   └── shared/       # Shared TypeScript types, enums, and Zod validation schemas
├── supabase/
│   ├── migrations/   # PostgreSQL schema, RLS security policies, and seed data
│   └── seed.sql      # Master migration script for Supabase SQL Editor
└── docs/             # Technical documentation & integration guides
```

## 2. Prerequisites

Ensure you have the following installed on your machine or deployment server:

- **Node.js**: v18.0.0 or higher (v20+ or v22+ recommended)
- **npm**: v9.0.0 or higher
- **Supabase Account**: (Free tier or self-hosted PostgreSQL database)
- **Minecraft Java Edition Server**: with RCON enabled in `server.properties`

---

## 3. Quick Start (Local Development)

### Step 1: Install Dependencies

From the workspace root directory, run:

```bash
npm install
```

This installs all dependencies across `packages/shared`, `apps/api`, and `apps/web` concurrently via npm workspaces.

### Step 2: Configure Environment Variables

1. Copy the example environment file for the API:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```
2. Edit `apps/api/.env`:
   - Set your `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (if you haven't set up Supabase yet, the API will automatically run in fallback seeded in-memory mode so you can test immediately).
   - Set `JWT_SECRET` to a random string (minimum 32 characters).
   - Configure your ABA PayWay or Bakong KHQR credentials, or leave them empty to use the built-in Sandbox Simulation mode.

### Step 3: Run the Development Servers

You can launch both the frontend and backend with one command from the project root:

```bash
npm run dev:all
```

Or start them individually in separate terminals:

- **Backend API**:
  ```bash
  npm run dev:api
  ```
  Runs on `http://localhost:5000` (API endpoint: `http://localhost:5000/api`)

- **Frontend Storefront**:
  ```bash
  npm run dev:web
  ```
  Runs on `http://localhost:5173`

Open your browser at `http://localhost:5173` to browse the store!

---

## 4. Default Admin Credentials (Staging / Development)

- **Portal URL**: `http://localhost:5173/control-panel/login`
- **Username**: `admin` or `admin@anajaksmp.xyz`
- **Password**: `AdminAnajak2026!`
- **Role**: `OWNER`

> [!IMPORTANT]
> Change the default admin password immediately in production!

---

## 5. Running Automated Tests

Run the test suite covering cart calculations, coupon validations, guest checkout security, and privacy access tokens:

```bash
npm run test
```

---

## 6. Production Build & Deployment

### Building the Project

Run from root:

```bash
npm run build
```

This compiles:
- `apps/api` TypeScript to `apps/api/dist`
- `apps/web` React app to optimized static assets in `apps/web/dist`

### Starting the Production Backend

```bash
cd apps/api
npm start
```

### Hosting Static Frontend

Deploy `apps/web/dist` to Cloudflare Pages, Vercel, or Nginx.
Ensure your reverse proxy routes `/api` requests to your Node.js backend port.
