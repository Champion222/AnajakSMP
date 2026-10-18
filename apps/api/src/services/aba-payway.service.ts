import crypto from 'crypto';
import { ENV } from '../config/env.js';
import { Order, Payment } from '@anajaksmp/shared';

export interface AbaPaywaySession {
  paymentUrl: string;
  transactionId: string;
  payload: Record<string, any>;
  isSandboxMode: boolean;
  isConfigured: boolean;
}

export class AbaPaywayService {
  /**
   * Check if merchant credentials have been configured
   */
  static isConfigured(): boolean {
    return Boolean(
      ENV.ABA_PAYWAY_MERCHANT_ID &&
        ENV.ABA_PAYWAY_API_KEY &&
        !ENV.ABA_PAYWAY_MERCHANT_ID.includes('placeholder')
    );
  }

  /**
   * Create an authorized ABA PayWay checkout session
   */
  static async createPaymentSession(order: Order, returnUrl?: string): Promise<AbaPaywaySession> {
    const isConfigured = this.isConfigured();
    const tranId = `ASMP_${order.order_number.replace(/-/g, '_')}`;
    const reqTime = Math.floor(Date.now() / 1000).toString();
    const amount = order.total_usd.toFixed(2);

    // Items array encoded as base64 JSON
    const itemsJson = JSON.stringify(
      order.items.map((i) => ({
        name: i.product_name,
        quantity: i.quantity,
        price: i.unit_price_usd.toFixed(2),
      }))
    );
    const itemsBase64 = Buffer.from(itemsJson).toString('base64');

    if (!isConfigured) {
      // In sandbox/unconfigured mode, return simulated test URL
      return {
        paymentUrl: `${ENV.FRONTEND_URL}/checkout/payment/${order.order_number}?token=${order.access_token}&method=ABA_PAYWAY&sandbox=true`,
        transactionId: tranId,
        payload: {
          tran_id: tranId,
          req_time: reqTime,
          amount,
          currency: 'USD',
          merchant_id: 'DEMO_SANDBOX_MERCHANT',
          status: 'UNCONFIGURED_MERCHANT',
        },
        isSandboxMode: true,
        isConfigured: false,
      };
    }

    // Generate HMAC SHA512 hash as required by ABA PayWay specifications
    // Hash string: req_time + merchant_id + tran_id + amount + items + ...
    const hashString = `${reqTime}${ENV.ABA_PAYWAY_MERCHANT_ID}${tranId}${amount}${itemsBase64}`;
    const hash = crypto
      .createHmac('sha512', ENV.ABA_PAYWAY_API_KEY)
      .update(hashString)
      .digest('base64');

    const payload = {
      req_time: reqTime,
      merchant_id: ENV.ABA_PAYWAY_MERCHANT_ID,
      tran_id: tranId,
      amount,
      items: itemsBase64,
      hash,
      firstname: 'Player',
      lastname: order.minecraft_username,
      email: order.customer_email,
      return_url: returnUrl || `${ENV.FRONTEND_URL}/orders/${order.order_number}?token=${order.access_token}`,
      type: 'purchase',
      payment_option: 'abapay',
    };

    return {
      paymentUrl: ENV.ABA_PAYWAY_API_URL,
      transactionId: tranId,
      payload,
      isSandboxMode: ENV.ABA_PAYWAY_SANDBOX,
      isConfigured: true,
    };
  }

  /**
   * Verify signature of an incoming ABA PayWay callback / webhook
   */
  static verifyCallbackSignature(body: Record<string, any>): boolean {
    if (!this.isConfigured()) {
      return true; // allow testing in sandbox
    }

    const { tran_id, status, apv, hash } = body;
    if (!hash || !tran_id) return false;

    // Verify HMAC
    const expected = crypto
      .createHmac('sha512', ENV.ABA_PAYWAY_API_KEY)
      .update(`${tran_id}${status || ''}${apv || ''}`)
      .digest('base64');

    return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expected));
  }
}
