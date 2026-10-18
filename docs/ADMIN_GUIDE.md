# AnajakSMP.xyz — Staff Administrator Guide

This guide describes how to operate the administrative control panel, audit order deliveries, manage catalog items, and resolve player inquiries.

---

## 1. Accessing the Portal

The staff portal is located at:
`https://anajaksmp.xyz/control-panel/login` (or `http://localhost:5173/control-panel/login` in development)

### Default Initial Credentials:
- **Email**: `admin@anajaksmp.xyz`
- **Username**: `admin`
- **Password**: `AdminAnajak2026!`
- **Role**: `OWNER`

---

## 2. Roles & Permissions (RBAC)

The system enforces 3 permission tiers:

| Role | Permissions |
| :--- | :--- |
| **OWNER** | Full system access: store settings, exchange rates, payment gateway modes, product management, order overrides, and audit trails. |
| **ADMIN** | Product catalog management, coupon creation, manual order verification, fulfillment retries, and audit reviews. |
| **SUPPORT** | Read-only order lookup, customer ticket triage, and support note updates. |

---

## 3. Order Operations & Troubleshooting

### Order Inspection
Navigate to **Orders** from the sidebar. You can search by:
- Order Number (e.g. `ASMP-2026-X8F4K`)
- Minecraft Username
- Customer Email Address

Click **Inspect** to see line items, payment status, access token, and delivery attempt logs.

### Retrying Failed Deliveries
If a player purchased while the Minecraft server was restarting:
1. Open the order in **Inspect**.
2. Click **Execute RCON**.
3. The delivery worker will re-execute the configured commands directly into the Minecraft server console.

### Audited Manual Payment Verification
If a player made an offline bank transfer or the bank callback was delayed:
1. Confirm the transaction in your ABA Mobile or Bakong app.
2. In the order details modal, enter a mandatory **Audit Reason** (e.g. `Confirmed in ABA Mobile ref #TX-89214`).
3. Click **Verify Payment**.
4. The system will mark the order as `PAID`, record an entry in the **Audit Logs**, and immediately dispatch the items via RCON.

---

## 4. Product Catalog Management

Go to **Products** in the sidebar:
- Click **Add New Product** to list ranks, crate keys, or bundles.
- Fill in the item name, URL slug, price in USD, optional sale price, and image URL.
- Enter in-game perks (1 perk per line).
- Enter delivery commands (e.g. `lp user {username} parent add mvp`).
- Check **Feature on Home Page** to highlight the product on the storefront.
- Toggle **Active in Store** to publish or unpublish without deleting.

---

## 5. Coupon Codes

Go to **Coupons** in the sidebar:
- Enter a coupon code (e.g. `ANAJAK10`, `WEEKEND5`).
- Select discount type: **Percentage (%)** or **Fixed ($)**.
- Set minimum spend requirements and max discount caps.
- Configure an optional usage limit (e.g. first 100 players).
- Real-time server validation prevents abuse during checkout.
