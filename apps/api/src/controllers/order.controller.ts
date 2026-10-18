import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';

export class OrderController {
  static async getOrderStatus(req: Request, res: Response): Promise<void> {
    try {
      const orderNumber = (req.query.orderNumber as string) || req.params.orderNumber;
      const token = (req.query.token as string) || (req.headers['x-order-token'] as string);

      if (!orderNumber || !token) {
        res.status(400).json({
          error: 'Both Order Number and Order Access Token are required to view order status',
        });
        return;
      }

      const order = await OrderService.getOrderByNumberAndToken(orderNumber, token);
      if (!order) {
        res.status(404).json({
          error: 'Order not found or the provided access token is invalid',
        });
        return;
      }

      // Safe customer-facing view
      res.json({
        orderNumber: order.order_number,
        minecraftUsername: order.minecraft_username,
        customerEmail: order.customer_email,
        subtotalUsd: order.subtotal_usd,
        discountUsd: order.discount_usd,
        totalUsd: order.total_usd,
        totalKhr: order.total_khr,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment?.status,
        paymentPaidAt: order.payment?.paid_at,
        items: order.items.map((i) => ({
          productName: i.product_name,
          quantity: i.quantity,
          unitPriceUsd: i.unit_price_usd,
          lineTotalUsd: i.line_total_usd,
          perks: i.perks_snapshot,
        })),
        fulfillment: order.fulfillment_jobs?.[0]
          ? {
              status: order.fulfillment_jobs[0].status,
              executedAt: order.fulfillment_jobs[0].executed_at,
              attempts: order.fulfillment_jobs[0].attempts,
              errorMessage: order.fulfillment_jobs[0].error_message,
            }
          : null,
        createdAt: order.created_at,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
