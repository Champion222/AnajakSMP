# AnajakSMP.xyz — Minecraft Survival Store & Ecommerce Platform

![AnajakSMP Store](https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&auto=format&fit=crop&q=80)

> **"YOUR ADVENTURE. YOUR LEGEND."**  
> Premium, production-ready Minecraft server store built for **AnajakSMP.xyz** with gold-yellow luxury styling, instant automated in-game delivery, ABA PayWay, and Bakong KHQR payment processing.

---

## 🌟 Key Features

- **Luxury Gaming Brand Design**: Crafted with dark charcoal `#0B0B0F` backgrounds, gold yellow `#F5C542` accents, glowing borders, and responsive design.
- **Guest Checkout**: Zero forced registration or passwords for players. Requires only in-game Minecraft Java username (with live 3D skin avatar preview) and receipt email.
- **Cambodian Payment Processing**:
  - **Bakong KHQR**: EMVCo compliant dynamic QR code generation with amount, currency, order reference, and live status polling.
  - **ABA PayWay**: Official merchant session creation with SHA512 HMAC signatures and idempotent webhook callbacks.
  - **Sandbox Simulation Mode**: Built-in test simulation mode for instant staging test purchases.
- **Automated Minecraft RCON Delivery**:
  - Configurable command templates (`{username}`, `{order_number}`, `{amount}`).
  - Works with LuckPerms, EssentialsX, ExcellentCrates, UltraCosmetics, and custom server plugins.
  - Idempotent queue preventing duplicate rank grants.
  - Safe error recovery and manual admin retry.
- **Private Order Status Tracking**: Orders are protected by a random 64-character secret access token to prevent enumeration of customer records.
- **Staff Control Panel (`/control-panel`)**:
  - Real database analytics (verified revenue, orders today, orders month, delivery health).
  - Full Product Catalog CRUD with command templates.
  - Order review with manual payment verification and RCON retry.
  - Promotional coupon code management.
  - Immutable administrative audit logs.
  - Customer support ticket triage.
- **Supabase PostgreSQL & Row Level Security (RLS)**:
  - Complete schema with foreign keys, checks, and indexes.
  - Strict RLS policies protecting customer orders and staff tables.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, QR code rendering.
- **Backend**: Node.js, Express, TypeScript, Helmet, CORS, Rate Limiting, bcrypt, jsonwebtoken.
- **Database**: Supabase PostgreSQL.
- **Integration**: Minecraft Java RCON Protocol (`rcon-client`).
- **Monorepo**: npm workspaces.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp apps/api/.env.example apps/api/.env
```

### 3. Run Development Servers
```bash
# Start both Web and API concurrently:
npm run dev:all

# Or start individually:
npm run dev:web  # http://localhost:5173
npm run dev:api  # http://localhost:5000
```

### 4. Run Automated Tests
```bash
npm run test
```

---

## 🔐 Default Admin Portal Credentials

- **URL**: `http://localhost:5173/control-panel/login`
- **Username**: `admin` or `admin@anajaksmp.xyz`
- **Password**: `AdminAnajak2026!`
- **Role**: `OWNER`

---

## 📚 Technical Documentation

- 📖 [Setup & Installation Guide](docs/SETUP.md)
- 🗄️ [Supabase Database & Migrations Guide](docs/DATABASE_SETUP.md)
- 💳 [ABA PayWay & KHQR Integration Guide](docs/PAYMENTS_GUIDE.md)
- ⚔️ [Minecraft RCON & Delivery Guide](docs/MINECRAFT_INTEGRATION.md)
- 🛡️ [Staff Administrator Guide](docs/ADMIN_GUIDE.md)

---

## ⚖️ License & Disclaimer

AnajakSMP is not an official Minecraft product. We are neither affiliated with nor endorsed by Mojang Studios or Microsoft Corporation.
