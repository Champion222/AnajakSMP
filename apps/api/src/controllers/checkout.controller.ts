import { Request, Response } from 'express';
import { CouponService } from '../services/coupon.service.js';
import { OrderService } from '../services/order.service.js';
import { ProductService } from '../services/product.service.js';
import { CheckoutRequest } from '@anajaksmp/shared';

export class CheckoutController {
  static async validateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { code, items } = req.body;
      if (!code || !items || !Array.isArray(items)) {
        res.status(400).json({ error: 'Code and items are required' });
        return;
      }

      // Re-calculate subtotal securely from server DB
      let subtotalUsd = 0;
      for (const item of items) {
        const product = await ProductService.getProductById(item.productId);
        if (product && product.is_active) {
          const price = product.sale_price_usd ?? product.price_usd;
          subtotalUsd += price * (item.quantity || 1);
        }
      }

      const result = await CouponService.validateCoupon(code, subtotalUsd);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCheckoutOrder(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CheckoutRequest;
      const result = await OrderService.createOrder(input);

      res.status(201).json({
        success: true,
        orderNumber: result.order.order_number,
        accessToken: result.order.access_token,
        totalUsd: result.order.total_usd,
        totalKhr: result.order.total_khr,
        paymentMethod: result.order.payment_method,
        paymentUrl: result.payment.payment_url,
        qrPayload: result.payment.qr_payload,
        paymentDetails: result.paymentDetails,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
