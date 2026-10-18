import { Request, Response } from 'express';
import { AdminAuthService } from '../services/admin-auth.service.js';
import { OrderService } from '../services/order.service.js';
import { ProductService } from '../services/product.service.js';
import { CouponService } from '../services/coupon.service.js';
import { SettingsService } from '../services/settings.service.js';
import { SupportService } from '../services/support.service.js';
import { TeamService } from '../services/team.service.js';
import { MinecraftDeliveryService } from '../services/minecraft-delivery.service.js';
import { ProductCreateInput, CouponCreateInput, StoreSettingsUpdateInput } from '@anajaksmp/shared';

export class AdminController {
  /**
   * Admin Login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { usernameOrEmail, password } = req.body;
      const ip = req.ip || req.socket.remoteAddress;

      const result = await AdminAuthService.login(usernameOrEmail, password, ip);
      if (!result) {
        res.status(401).json({ error: 'Invalid admin credentials' });
        return;
      }

      res.json({
        success: true,
        user: result.user,
        token: result.token,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Admin Dashboard Analytics
   */
  static async getDashboard(_req: Request, res: Response): Promise<void> {
    try {
      const metrics = await OrderService.getDashboardMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Orders Management
   */
  static async getOrders(req: Request, res: Response): Promise<void> {
    try {
      const { search, status, paymentMethod, page, limit } = req.query;
      const result = await OrderService.listOrders({
        search: typeof search === 'string' ? search : undefined,
        status: status as any,
        paymentMethod: paymentMethod as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getOrderDetails(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }
      res.json({ order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async retryFulfillment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const order = await OrderService.getOrderById(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const job = await MinecraftDeliveryService.getJobByOrderId(order.id);
      if (!job) {
        const newJob = await MinecraftDeliveryService.enqueueFulfillment(order);
        res.json({ success: true, message: 'Fulfillment job enqueued', job: newJob });
        return;
      }

      const retried = await MinecraftDeliveryService.retryJob(job.id);

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'RETRY_FULFILLMENT',
        resourceType: 'ORDER',
        resourceId: order.order_number,
        details: { jobId: job.id, status: retried?.status },
        ipAddress: req.ip,
      });

      res.json({ success: true, message: 'Fulfillment attempt processed', job: retried });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async manualVerifyPayment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason || reason.trim().length < 5) {
        res.status(400).json({ error: 'An audit reason (min 5 chars) is required to manually verify payment' });
        return;
      }

      const order = await OrderService.getOrderById(id);
      if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
      }

      const updated = await OrderService.markOrderAsPaid(order.id, `MANUAL_VERIFIED_${Date.now()}`, {
        verifiedByAdmin: req.admin!.username,
        reason,
        verifiedAt: new Date().toISOString(),
      });

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'MANUAL_PAYMENT_VERIFICATION',
        resourceType: 'ORDER',
        resourceId: order.order_number,
        details: { reason, totalUsd: order.total_usd },
        ipAddress: req.ip,
      });

      res.json({ success: true, message: 'Payment marked as verified and rewards enqueued for delivery', order: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Product Management
   */
  static async getProducts(_req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductService.getAllProducts({ includeInactive: true });
      res.json({ products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as ProductCreateInput;
      const product = await ProductService.createProduct(input as any);

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'CREATE_PRODUCT',
        resourceType: 'PRODUCT',
        resourceId: product.id,
        details: { name: product.name, slug: product.slug, price: product.price_usd },
        ipAddress: req.ip,
      });

      res.status(201).json({ success: true, product });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await ProductService.updateProduct(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'UPDATE_PRODUCT',
        resourceType: 'PRODUCT',
        resourceId: id,
        details: req.body,
        ipAddress: req.ip,
      });

      res.json({ success: true, product: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await ProductService.deleteProduct(id);
      if (!success) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'DELETE_PRODUCT',
        resourceType: 'PRODUCT',
        resourceId: id,
        ipAddress: req.ip,
      });

      res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Coupons Management
   */
  static async getCoupons(_req: Request, res: Response): Promise<void> {
    try {
      const coupons = await CouponService.getAllCoupons();
      res.json({ coupons });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createCoupon(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as CouponCreateInput;
      const coupon = await CouponService.createCoupon(input as any);

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'CREATE_COUPON',
        resourceType: 'COUPON',
        resourceId: coupon.code,
        details: { discount: coupon.discount_value, type: coupon.discount_type },
        ipAddress: req.ip,
      });

      res.status(201).json({ success: true, coupon });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateCoupon(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await CouponService.updateCoupon(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Coupon not found' });
        return;
      }

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'UPDATE_COUPON',
        resourceType: 'COUPON',
        resourceId: updated.code,
        details: req.body,
        ipAddress: req.ip,
      });

      res.json({ success: true, coupon: updated });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Settings Management
   */
  static async getSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.getSettings();
      res.json({ settings });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSettings(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as StoreSettingsUpdateInput;
      const settings = await SettingsService.updateSettings(input);

      await AdminAuthService.logAudit({
        adminId: req.admin!.id,
        adminUsername: req.admin!.username,
        action: 'UPDATE_SETTINGS',
        resourceType: 'SETTINGS',
        details: input,
        ipAddress: req.ip,
      });

      res.json({ success: true, settings });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Audit Logs
   */
  static async getAuditLogs(_req: Request, res: Response): Promise<void> {
    try {
      const logs = await AdminAuthService.getAuditLogs(100);
      res.json({ logs });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Support Tickets
   */
  static async getSupportTickets(_req: Request, res: Response): Promise<void> {
    try {
      const tickets = await SupportService.listTickets();
      res.json({ tickets });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateSupportTicket(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await SupportService.updateTicket(id, req.body);
      if (!updated) {
        res.status(404).json({ error: 'Ticket not found' });
        return;
      }
      res.json({ success: true, ticket: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Team Management
   */
  static async getTeam(_req: Request, res: Response): Promise<void> {
    try {
      const team = TeamService.getTeam();
      res.json({ success: true, team });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async saveTeam(req: Request, res: Response): Promise<void> {
    try {
      const { groups } = req.body;
      if (!Array.isArray(groups)) {
        res.status(400).json({ error: 'Groups must be an array' });
        return;
      }
      const updated = TeamService.saveTeam(groups);
      res.json({ success: true, team: updated });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
