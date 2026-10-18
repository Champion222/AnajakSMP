# 🚀 Deploying AnajakSMP to Vercel

This guide explains how to deploy the **AnajakSMP Minecraft Store** to [Vercel](https://vercel.com).

The repository has been pre-configured with:
- **Full-stack support**: Both the React frontend and Express REST API run seamlessly on Vercel under a single domain.
- **Serverless API wrapper** (`api/index.js`): Maps incoming `/api/*` requests to the Express server.
- **Client-Side SPA Routing** (`vercel.json`): Rewrites paths like `/store`, `/admin`, `/payment/...` to `index.html` (no 404s on page refresh).
- **Flexible API targeting**: Supports running API serverless on Vercel, or proxying to an external Node server via `VITE_API_URL`.

---

## ⚡ Option 1: Deploy with Git (Recommended)

### Step 1: Push your project to GitHub
1. Create a new repository on [GitHub](https://github.com/new) (e.g., `anajaksmp-store`).
2. Link your local repository and push:
```bash
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/anajaksmp-store.git
git branch -M main
git push -u origin main
```

### Step 2: Import into Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New..."** -> **"Project"**.
3. Select your GitHub repository (`anajaksmp-store`).
4. **Project Settings**:
   - **Framework Preset**: Leave as `Other` or `Vite`.
   - **Root Directory**: `./` (leave default root).
   - **Build Command**: `npm run build` (automatic).
   - **Output Directory**: `apps/web/dist` (automatic via `vercel.json`).

### Step 3: Add Environment Variables in Vercel
In the Vercel project configuration page, expand **Environment Variables** and add:

| Key | Description | Example / Recommended |
|---|---|---|
| `NODE_ENV` | Production environment | `production` |
| `FRONTEND_URL` | Your public Vercel URL or custom domain | `https://your-store.vercel.app` |
| `SUPABASE_URL` | Supabase project URL | `https://ujjbczndunyyyteyuvtw.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Anon Key | `sb_publishable_...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Secret Key | `your_service_role_secret` |
| `JWT_SECRET` | Secret for admin authentication tokens | `any_secure_random_string_32_chars` |
| `ADMIN_PANEL_PATH` | Secret URL path for admin panel | `/control-panel` |
| `ABA_PAYWAY_MERCHANT_ID` | ABA PayWay Merchant ID | *(Your merchant ID)* |
| `ABA_PAYWAY_API_KEY` | ABA PayWay API Key | *(Your API key)* |
| `ABA_PAYWAY_SANDBOX` | Use PayWay sandbox mode | `true` (or `false` for live) |
| `KHQR_MERCHANT_ID` | Bakong Merchant ID | *(Your Bakong ID)* |
| `KHQR_BAKONG_ACCOUNT` | Bakong Account ID | *(Your Bakong account)* |
| `KHQR_MERCHANT_NAME` | Merchant display name for KHQR | `AnajakSMP Store` |
| `MINECRAFT_RCON_HOST` | Minecraft Java Server IP / Hostname | `play.anajaksmp.xyz` |
| `MINECRAFT_RCON_PORT` | Minecraft RCON Port | `25575` |
| `MINECRAFT_RCON_PASSWORD` | Minecraft RCON Password | *(Configured in server.properties)* |
| `MINECRAFT_SERVER_STATUS_HOST` | Hostname to check player count | `play.anajaksmp.xyz` |

> 💡 **Note**: If `SUPABASE_URL` is omitted during testing, the API automatically falls back to its built-in in-memory store pre-populated with categories, ranks, and crate keys.

### Step 4: Click "Deploy"
Vercel will install dependencies, build both the frontend and backend, and deploy your site to a `*.vercel.app` URL!

---

## 💻 Option 2: Deploy using Vercel CLI

You can also deploy directly from your local terminal:

```bash
# 1. Login to Vercel
npx vercel login

# 2. Deploy a preview build
npx vercel

# 3. Deploy to production
npx vercel --prod
```

---

## 🌐 Custom Domain Setup (e.g., store.anajaksmp.xyz)

1. In your Vercel project dashboard, go to **Settings** > **Domains**.
2. Enter your domain: `store.anajaksmp.xyz` (or `anajaksmp.xyz`).
3. Add the DNS records shown by Vercel in your Cloudflare or domain registrar:
   - **Type**: `CNAME`
   - **Name**: `store`
   - **Value**: `cname.vercel-dns.com`
4. SSL certificates are provisioned automatically by Vercel.

---

## 🔧 Architecture & Routing Reference

- **Static Assets & Pages**: Requests for `/`, `/store`, `/admin`, `/payment/:orderNumber` are routed to `apps/web/dist/index.html`.
- **API Serverless Handler**: Requests to `/api/*` and `/health` are routed to `api/index.js` which executes the Express app as a Vercel Serverless Function.
- **External API Option**: If you ever prefer running the API server on a dedicated host (e.g. Render, Railway, or VPS), simply add `VITE_API_URL=https://api.yourdomain.com/api` to Vercel environment variables.
