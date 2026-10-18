import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { AbaPaywayService } from '../services/aba-payway.service.js';
import { SettingsService } from '../services/settings.service.js';

export class PaymentController {
  /**
   * Check status of a payment for an order (requires orderNumber + token)
   */
  static async getPaymentStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber } = req.params;
      const token = (req.query.token as string) || (req.headers['x-order-token'] as string);

      if (!token) {
        res.status(403).json({ error: 'Order verification token required' });
        return;
      }

      const order = await OrderService.getOrderByNumberAndToken(orderNumber, token);
      if (!order) {
        res.status(404).json({ error: 'Order not found or invalid token' });
        return;
      }

      res.json({
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment?.status || 'PENDING',
        paidAt: order.payment?.paid_at,
        isDelivered: order.status === 'DELIVERED',
        totalUsd: order.total_usd,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Official ABA PayWay Webhook Callback
   */
  static async handleAbaWebhook(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔔 [ABA Webhook] Received callback:', req.body);
      const isValid = AbaPaywayService.verifyCallbackSignature(req.body);
      if (!isValid) {
        console.warn('❌ [ABA Webhook] Invalid signature verification');
        res.status(400).json({ status: 1, message: 'Invalid hash signature' });
        return;
      }

      const { tran_id, status } = req.body;
      if (status === '0' || status === 0 || status === 'APPROVED') {
        // Find matching order by transaction ID
        const orderNumberPart = tran_id.replace(/^ASMP_/, '').replace(/_/g, '-');
        const { orders } = await OrderService.listOrders({ search: orderNumberPart, limit: 1 });
        const targetOrder = orders[0];

        if (targetOrder) {
          await OrderService.markOrderAsPaid(targetOrder.id, tran_id, req.body);
          console.log(`✅ [ABA Webhook] Successfully marked order ${targetOrder.order_number} as PAID`);
        }
      }

      // Return ABA PayWay standard response: 0 means success
      res.json({ status: 0, message: 'Callback processed' });
    } catch (error: any) {
      console.error('❌ [ABA Webhook Error]', error);
      res.status(500).json({ status: 1, message: error.message });
    }
  }

  /**
   * Sandbox payment simulation for testing checkout & Minecraft fulfillment workflow
   */
  static async simulateSandboxPayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderNumber, token } = req.body;
      if (!orderNumber || !token) {
        res.status(400).json({ error: 'orderNumber and token are required' });
        return;
      }

      const settings = await SettingsService.getSettings();
      // Allow simulation if in sandbox mode or credentials not yet configured
      if (!settings.payment_sandbox_mode && AbaPaywayService.isConfigured()) {
        res.status(403).json({ error: 'Sandbox payment simulation is disabled in live production mode' });
        return;
      }

      const order = await OrderService.getOrderByNumberAndToken(orderNumber, token);
      if (!order) {
        res.status(404).json({ error: 'Order not found or invalid token' });
        return;
      }

      const simulatedTxId = `SIM_PAY_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const updatedOrder = await OrderService.markOrderAsPaid(order.id, simulatedTxId, {
        simulation: true,
        method: order.payment_method,
        simulatedAt: new Date().toISOString(),
      });

      res.json({
        success: true,
        message: 'Sandbox payment simulated successfully. Delivery dispatched to Minecraft server.',
        order: {
          orderNumber: updatedOrder.order_number,
          status: updatedOrder.status,
          paymentStatus: updatedOrder.payment?.status,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
