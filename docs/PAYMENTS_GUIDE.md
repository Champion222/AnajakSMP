# AnajakSMP.xyz — Payment Gateway Integration Guide

AnajakSMP supports two primary Cambodian payment methods:
1. **Bakong KHQR (National Bank of Cambodia)**: Compatible with all major Cambodian banking apps (ABA Mobile, Wing Bank, Acleda, Sathapana, Canadia, TrueMoney, etc.).
2. **ABA PayWay**: Official merchant checkout with card processing and in-app authorization.

---

## 1. Bakong KHQR Integration

The backend implements the official EMVCo Tag-Length-Value (TLV) specification used by the National Bank of Cambodia (NBC) and Bakong:

- **Point of Initiation Method (Tag 01)**: Dynamic QR (`12`)
- **Merchant Account Information (Tag 29)**: Bakong Account ID (`your_account@aba`)
- **Currency Code (Tag 53)**: `840` for USD, `116` for KHR
- **Country Code (Tag 58)**: `KH`
- **Merchant Category Code (Tag 52)**: `5999` (Gaming / Digital Goods)
- **Additional Data (Tag 62)**: Reference to unique `order_number` (e.g. `ASMP-2026-X8F4K`)
- **CRC16 Checksum (Tag 63)**: CCITT-FALSE 16-bit polynomial checksum

### Setting Your Live Bakong Credentials

In `apps/api/.env`:
```ini
KHQR_MERCHANT_ID=your_merchant_id
KHQR_BAKONG_ACCOUNT=your_bakong_account@aba
KHQR_MERCHANT_NAME=AnajakSMP Store
KHQR_MERCHANT_CITY=Phnom Penh
```

When customers scan the generated QR code in any banking app, the bank transfers the funds directly to your Bakong account with the Order ID as the memo/reference.

---

## 2. ABA PayWay Merchant Integration

ABA PayWay requires an authorized merchant contract with ABA Bank.

### Setting Your ABA PayWay Credentials

In `apps/api/.env`:
```ini
ABA_PAYWAY_MERCHANT_ID=your_aba_merchant_id
ABA_PAYWAY_API_KEY=your_aba_api_key_secret
ABA_PAYWAY_API_URL=https://checkout.payway.com.kh/api/payment-gateway/v1/payments/purchase
ABA_PAYWAY_SANDBOX=false
```

### Security & HMAC Hashing

All payment sessions created by `apps/api/src/services/aba-payway.service.ts` calculate an HMAC SHA512 hash using your `ABA_PAYWAY_API_KEY`. The raw API key is never exposed to the frontend browser.

### Webhook & Callback Verification

When a payment completes, ABA Bank sends a POST request to:
`POST https://api.anajaksmp.xyz/api/payments/webhook/aba`

The server validates:
1. The HMAC signature using constant-time comparison to prevent timing attacks.
2. The transaction amount against the verified database order total.
3. Idempotency: Duplicate callbacks for the same order are processed only once.

---

## 3. Testing in Sandbox / Development Mode

If merchant credentials have not been configured yet, AnajakSMP will automatically run in **Sandbox Mode**:

1. Add any item to your cart and proceed to Guest Checkout.
2. Enter a test Minecraft username (e.g. `Alex_Tester`) and email.
3. Select **KHQR (Bakong)** or **ABA PayWay**.
4. On the payment page, a **Simulate Verified Payment ($0.00 charged)** button is available.
5. Clicking it verifies the transaction, triggers celebratory confetti, dispatches Minecraft fulfillment commands, and redirects to the Order Status page.

This allows full end-to-end testing of customer purchase, order tracking, and in-game command delivery without requiring real merchant credentials!
