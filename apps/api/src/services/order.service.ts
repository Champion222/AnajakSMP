import crypto from 'crypto';
import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import {
  CheckoutRequest,
  Order,
  OrderItem,
  OrderStatus,
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '@anajaksmp/shared';
import { ProductService } from './product.service.js';
import { CouponService } from './coupon.service.js';
import { SettingsService } from './settings.service.js';
import { AbaPaywayService } from './aba-payway.service.js';
import { KhqrService } from './khqr.service.js';
import { MinecraftDeliveryService } from './minecraft-delivery.service.js';
import { v4 as uuidv4 } from 'uuid';

export class OrderService {
  /**
   * Generate a unique human-friendly order reference e.g. ASMP-2026-X8F4K
   */
  private static generateOrderNumber(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const year = new Date().getFullYear();
    return `ASMP-${year}-${code}`;
  }

  /**
   * Generate a cryptographically secure 64-char hex access token
   */
  private static generateAccessToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Create an order from guest checkout
   */
  static async createOrder(input: CheckoutRequest): Promise<{
    order: Order;
    payment: Payment;
    paymentDetails: any;
  }> {
    const settings = await SettingsService.getSettings();

    // 1. Fetch products and calculate server-side pricing
    let subtotalUsd = 0;
    const orderItems: OrderItem[] = [];

    for (const item of input.items) {
      const product = await ProductService.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }
      if (!product.is_active) {
        throw new Error(`Product "${product.name}" is currently unavailable`);
      }
      if (product.stock !== null && product.stock !== undefined && product.stock < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}"`);
      }

      const effectivePrice = product.sale_price_usd !== null && product.sale_price_usd !== undefined
        ? product.sale_price_usd
        : product.price_usd;

      const lineTotal = Math.round(effectivePrice * item.quantity * 100) / 100;
      subtotalUsd += lineTotal;

      orderItems.push({
        id: uuidv4(),
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        unit_price_usd: effectivePrice,
        quantity: item.quantity,
        line_total_usd: lineTotal,
        perks_snapshot: product.perks,
        commands_snapshot: product.delivery_commands,
      });
    }

    subtotalUsd = Math.round(subtotalUsd * 100) / 100;

    // 2. Validate coupon if provided
    let discountUsd = 0;
    let couponId: string | null = null;
    let couponCode: string | null = null;

    if (input.coupon_code && input.coupon_code.trim()) {
      const validation = await CouponService.validateCoupon(input.coupon_code, subtotalUsd);
      if (validation.isValid && validation.coupon) {
        discountUsd = validation.discountAmountUsd;
        couponId = validation.coupon.id;
        couponCode = validation.coupon.code;
        await CouponService.recordCouponUsage(validation.coupon.id);
      }
    }

    const totalUsd = Math.max(0, Math.round((subtotalUsd - discountUsd) * 100) / 100);
    const exchangeRate = settings.exchange_rate_usd_to_khr || 4100;
    const totalKhr = Math.round(totalUsd * exchangeRate);

    const orderId = uuidv4();
    const orderNumber = this.generateOrderNumber();
    const accessToken = this.generateAccessToken();

    const order: Order = {
      id: orderId,
      order_number: orderNumber,
      access_token: accessToken,
      minecraft_username: input.minecraft_username,
      customer_email: input.customer_email,
      subtotal_usd: subtotalUsd,
      discount_usd: discountUsd,
      total_usd: totalUsd,
      total_khr: totalKhr,
      status: 'AWAITING_PAYMENT',
      payment_method: input.payment_method,
      coupon_id: couponId,
      coupon_code: couponCode,
      items: orderItems.map((item) => ({ ...item, order_id: orderId })),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 3. Setup payment record
    const paymentId = uuidv4();
    let qrPayload: string | null = null;
    let paymentUrl: string | null = null;
    let paymentDetails: any = null;

    if (input.payment_method === 'ABA_PAYWAY') {
      const session = await AbaPaywayService.createPaymentSession(order);
      paymentUrl = session.paymentUrl;
      paymentDetails = session;
    } else if (input.payment_method === 'KHQR') {
      const khqr = KhqrService.generateKhqr(order, settings.default_currency || 'USD');
      qrPayload = khqr.qrString;
      paymentDetails = khqr;
    }

    const payment: Payment = {
      id: paymentId,
      order_id: orderId,
      provider: input.payment_method,
      amount_usd: totalUsd,
      amount_khr: totalKhr,
      status: 'PENDING',
      qr_payload: qrPayload,
      payment_url: paymentUrl,
      expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min expiry
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    order.payment = payment;

    // 4. Persist to Database or Memory
    if (isSupabaseConfigured && supabase) {
      const { error: orderError } = await supabase.from('orders').insert({
        id: order.id,
        order_number: order.order_number,
        access_token: order.access_token,
        minecraft_username: order.minecraft_username,
        customer_email: order.customer_email,
        subtotal_usd: order.subtotal_usd,
        discount_usd: order.discount_usd,
        total_usd: order.total_usd,
        total_khr: order.total_khr,
        status: order.status,
        payment_method: order.payment_method,
        coupon_id: order.coupon_id,
        coupon_code: order.coupon_code,
      });
      if (orderError) throw orderError;

      const { error: itemsError } = await supabase.from('order_items').insert(order.items);
      if (itemsError) throw itemsError;

      const { error: paymentError } = await supabase.from('payments').insert(payment);
      if (paymentError) throw paymentError;
    } else {
      memoryStore.orders.set(order.id, order);
      memoryStore.payments.set(payment.id, payment);
    }

    return {
      order,
      payment,
      paymentDetails,
    };
  }

  /**
   * Securely retrieve order by order number AND access token
   */
  static async getOrderByNumberAndToken(orderNumber: string, accessToken: string): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_number', orderNumber)
        .eq('access_token', accessToken)
        .single();

      if (error || !orderData) return null;

      const [itemsRes, paymentRes, jobsRes] = await Promise.all([
        supabase.from('order_items').select('*').eq('order_id', orderData.id),
        supabase.from('payments').select('*').eq('order_id', orderData.id).single(),
        supabase.from('fulfillment_jobs').select('*').eq('order_id', orderData.id),
      ]);

      const order = orderData as Order;
      order.items = (itemsRes.data || []) as OrderItem[];
      order.payment = (paymentRes.data || undefined) as Payment | undefined;
      order.fulfillment_jobs = (jobsRes.data || []) as any;
      return order;
    }

    for (const ord of memoryStore.orders.values()) {
      if (ord.order_number === orderNumber && ord.access_token === accessToken) {
        const orderCopy = { ...ord };
        const job = await MinecraftDeliveryService.getJobByOrderId(ord.id);
        if (job) orderCopy.fulfillment_jobs = [job];
        return orderCopy;
      }
    }
    return null;
  }

  /**
   * Admin: Get order by ID (unrestricted by token)
   */
  static async getOrderById(orderId: string): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      const { data: orderData, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (error || !orderData) return null;

      const [itemsRes, paymentRes, jobsRes] = await Promise.all([
        supabase.from('order_items').select('*').eq('order_id', orderId),
        supabase.from('payments').select('*').eq('order_id', orderId).single(),
        supabase.from('fulfillment_jobs').select('*').eq('order_id', orderId),
      ]);

      const order = orderData as Order;
      order.items = (itemsRes.data || []) as OrderItem[];
      order.payment = (paymentRes.data || undefined) as Payment | undefined;
      order.fulfillment_jobs = (jobsRes.data || []) as any;
      return order;
    }

    const found = memoryStore.orders.get(orderId);
    if (!found) return null;
    const orderCopy = { ...found };
    const job = await MinecraftDeliveryService.getJobByOrderId(found.id);
    if (job) orderCopy.fulfillment_jobs = [job];
    return orderCopy;
  }

  /**
   * Mark order and payment as PAID, and trigger Minecraft fulfillment
   */
  static async markOrderAsPaid(
    orderId: string,
    providerTxId?: string,
    rawPayload?: Record<string, any>
  ): Promise<Order> {
    const order = await this.getOrderById(orderId);
    if (!order) throw new Error(`Order not found: ${orderId}`);

    if (order.status === 'PAID' || order.status === 'DELIVERED') {
      console.log(`[OrderService] Order ${order.order_number} already paid. Skipping duplicate confirmation.`);
      return order;
    }

    const paidAt = new Date().toISOString();
    order.status = 'PAID';
    order.updated_at = paidAt;

    if (order.payment) {
      order.payment.status = 'COMPLETED';
      order.payment.paid_at = paidAt;
      if (providerTxId) order.payment.provider_tx_id = providerTxId;
      if (rawPayload) order.payment.raw_payload = rawPayload;
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ status: 'PAID', updated_at: paidAt }).eq('id', orderId);
      if (order.payment) {
        await supabase
          .from('payments')
          .update({
            status: 'COMPLETED',
            paid_at: paidAt,
            provider_tx_id: providerTxId || null,
            raw_payload: rawPayload || null,
            updated_at: paidAt,
          })
          .eq('order_id', orderId);
      }
    } else {
      memoryStore.orders.set(orderId, order);
      if (order.payment) {
        memoryStore.payments.set(order.payment.id, order.payment);
      }
    }

    // Trigger Minecraft delivery immediately
    await MinecraftDeliveryService.enqueueFulfillment(order);

    return order;
  }

  /**
   * List orders for Admin dashboard with filters
   */
  static async listOrders(filters?: {
    search?: string;
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    page?: number;
    limit?: number;
  }): Promise<{ orders: Order[]; total: number }> {
    const page = filters?.page || 1;
    const limit = filters?.limit || 20;

    let orders: Order[] = [];
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('orders').select('*, order_items(*), payments(*)', { count: 'exact' });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.paymentMethod) query = query.eq('payment_method', filters.paymentMethod);
      if (filters?.search) {
        query = query.or(
          `order_number.ilike.%${filters.search}%,minecraft_username.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`
        );
      }

      query = query.order('created_at', { ascending: false }).range((page - 1) * limit, page * limit - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      orders = (data || []).map((row: any) => ({
        ...row,
        items: row.order_items || [],
        payment: Array.isArray(row.payments) ? row.payments[0] : row.payments,
      }));
      return { orders, total: count || 0 };
    }

    // In-memory filter
    orders = Array.from(memoryStore.orders.values());
    if (filters?.status) {
      orders = orders.filter((o) => o.status === filters.status);
    }
    if (filters?.paymentMethod) {
      orders = orders.filter((o) => o.payment_method === filters.paymentMethod);
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(q) ||
          o.minecraft_username.toLowerCase().includes(q) ||
          o.customer_email.toLowerCase().includes(q)
      );
    }

    orders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const total = orders.length;
    const paginated = orders.slice((page - 1) * limit, page * limit);
    return { orders: paginated, total };
  }

  /**
   * Get Admin dashboard metrics (Total revenue from verified payments, today's orders, etc.)
   */
  static async getDashboardMetrics(): Promise<{
    totalRevenueUsd: number;
    ordersToday: number;
    ordersThisMonth: number;
    pendingPayments: number;
    paidOrders: number;
    deliveredOrders: number;
    failedDeliveries: number;
    recentOrders: Order[];
  }> {
    const { orders } = await this.listOrders({ limit: 1000 });

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let totalRevenueUsd = 0;
    let ordersToday = 0;
    let ordersThisMonth = 0;
    let pendingPayments = 0;
    let paidOrders = 0;
    let deliveredOrders = 0;
    let failedDeliveries = 0;

    for (const order of orders) {
      const orderTime = new Date(order.created_at).getTime();

      // Only count verified paid/delivered revenue (Prompt requirement: revenue must exclude unpaid, failed, cancelled)
      if (order.status === 'PAID' || order.status === 'DELIVERED') {
        totalRevenueUsd += order.total_usd;
        if (order.status === 'PAID') paidOrders++;
        if (order.status === 'DELIVERED') deliveredOrders++;
      } else if (order.status === 'AWAITING_PAYMENT' || order.status === 'PAYMENT_PENDING') {
        pendingPayments++;
      } else if (order.status === 'FAILED') {
        failedDeliveries++;
      }

      if (orderTime >= startOfToday) ordersToday++;
      if (orderTime >= startOfMonth) ordersThisMonth++;
    }

    return {
      totalRevenueUsd: Math.round(totalRevenueUsd * 100) / 100,
      ordersToday,
      ordersThisMonth,
      pendingPayments,
      paidOrders,
      deliveredOrders,
      failedDeliveries,
      recentOrders: orders.slice(0, 10),
    };
  }
}
