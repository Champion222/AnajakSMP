# AnajakSMP.xyz — Minecraft Server RCON & Delivery Guide

AnajakSMP connects directly to your Minecraft Java Edition server via **RCON (Remote Console)** to instantly execute commands when orders are verified.

---

## 1. Enabling RCON on Your Minecraft Server

Open your Minecraft server's root folder and locate `server.properties`.

Configure the following lines:

```properties
enable-rcon=true
rcon.port=25575
rcon.password=YourUltraSecurePasswordHere123!
broadcast-rcon-to-ops=true
```

> [!WARNING]
> Choose a strong, random password. Never share this password publicly.

Restart your Minecraft server to apply the changes.

---

## 2. Configuring the Backend Adapter

In `apps/api/.env`, configure:

```ini
MINECRAFT_RCON_HOST=127.0.0.1
MINECRAFT_RCON_PORT=25575
MINECRAFT_RCON_PASSWORD=YourUltraSecurePasswordHere123!
MINECRAFT_RCON_TIMEOUT=5000
MINECRAFT_SERVER_STATUS_HOST=play.anajaksmp.xyz
```

If your Minecraft server is hosted on a separate VPS or dedicated box, set `MINECRAFT_RCON_HOST` to the public IP of your Minecraft server and ensure firewall port `25575` (TCP) is open to the API server IP.

---

## 3. Product Command Templates

When configuring products in the Admin Control Panel (`/control-panel/products`), you can define one or more commands per item.

The backend replaces the following placeholders dynamically:
- `{username}`: Customer's in-game Minecraft Java username.
- `{order_number}`: The unique order reference (e.g. `ASMP-2026-X8F4K`).
- `{amount}`: The total purchase price in USD.

### Examples for Common Minecraft Plugins:

#### LuckPerms (Ranks & Permissions):
```
lp user {username} parent add vip
lp user {username} parent add titan
```

#### EssentialsX / Vault (Currency):
```
eco give {username} 100000
msg {username} &6[Bank] 100,000 Coins deposited into your account!
```

#### ExcellentCrates / CrazyCrates (Keys):
```
crate key give {username} spawner 5
crate key give {username} mythic 3
```

#### UltraCosmetics / CosmeticsCore:
```
cosmetics give {username} golden_wings
pet give {username} baby_phoenix
```

#### Global Broadcast Announcements:
```
broadcast &6&l[STORE] &e{username} &fhas purchased &6&lTITAN RANK&f! Thank you for supporting AnajakSMP!
```

---

## 4. Idempotency & Safe Delivery Workflow

1. Order payment is verified by ABA PayWay or Bakong KHQR.
2. Order status updates to `PAID`.
3. A `fulfillment_job` is created **only once** (`idx_fulfillment_jobs_order_id`).
4. The background delivery worker connects via RCON and dispatches the configured commands in sequence.
5. If the server is offline or RCON disconnects:
   - The job is marked as `FAILED`.
   - The error reason is logged in `fulfillment_attempts`.
   - Order remains in `PROCESSING` state (never lost).
   - Staff can safely click **Execute RCON** in `/control-panel/orders` once the server is back online.
