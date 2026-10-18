import {
  Product,
  ProductCategory,
  StoreSettings,
  Order,
  CheckoutRequest,
  SupportTicketInput,
  AdminUser,
} from '@anajaksmp/shared';

const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export const api = {
  // Store
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/store/settings`);
    if (!res.ok) throw new Error('Failed to load store settings');
    const data = await res.json();
    return data.settings;
  },

  async getServerStatus(): Promise<{
    online: boolean;
    serverIp: string;
    players: { online: number; max: number };
    version: string;
    motd: string;
  }> {
    const res = await fetch(`${API_BASE}/store/server-status`);
    if (!res.ok) throw new Error('Failed to load server status');
    return res.json();
  },

  async getCategories(): Promise<ProductCategory[]> {
    const res = await fetch(`${API_BASE}/store/categories`);
    if (!res.ok) throw new Error('Failed to load categories');
    const data = await res.json();
    return data.categories;
  },

  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.featured) query.set('featured', 'true');

    const res = await fetch(`${API_BASE}/store/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to load products');
    const data = await res.json();
    return data.products;
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/store/products/${slug}`);
    if (!res.ok) throw new Error('Product not found');
    const data = await res.json();
    return data.product;
  },

  // Checkout
  async validateCoupon(code: string, items: { productId: string; quantity: number }[]) {
    const res = await fetch(`${API_BASE}/checkout/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, items }),
    });
    return res.json();
  },

  async createCheckout(payload: CheckoutRequest) {
    const res = await fetch(`${API_BASE}/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Checkout failed');
    return data;
  },

  // Payment
  async getPaymentStatus(orderNumber: string, token: string) {
    const res = await fetch(`${API_BASE}/payments/status/${orderNumber}?token=${encodeURIComponent(token)}`);
    if (!res.ok) throw new Error('Failed to fetch payment status');
    return res.json();
  },

  async simulateSandboxPayment(orderNumber: string, token: string) {
    const res = await fetch(`${API_BASE}/payments/simulate-sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber, token }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to simulate payment');
    return data;
  },

  // Orders
  async getOrderStatus(orderNumber: string, token: string) {
    const res = await fetch(
      `${API_BASE}/orders/status/${orderNumber}?token=${encodeURIComponent(token)}`
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load order');
    return data;
  },

  // Support
  async submitTicket(payload: SupportTicketInput) {
    const res = await fetch(`${API_BASE}/support/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit ticket');
    return data;
  },

  // Admin API
  admin: {
    async login(usernameOrEmail: string, passwordPlain: string): Promise<{ user: AdminUser; token: string }> {
      const res = await fetch(`${API_BASE}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password: passwordPlain }),
      });
      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error(
          res.ok
            ? 'Unexpected response from server'
            : 'API server is not reachable on port 5000. Please ensure the backend is running with "npm run dev:api" or "npm run dev:all".'
        );
      }
      if (!res.ok) throw new Error(data.error || 'Login failed. Please verify your credentials.');
      return data;
    },

    async getDashboard(token: string) {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      return res.json();
    },

    async getOrders(token: string, params?: { search?: string; status?: string; page?: number }) {
      const query = new URLSearchParams();
      if (params?.search) query.set('search', params.search);
      if (params?.status && params.status !== 'all') query.set('status', params.status);
      if (params?.page) query.set('page', params.page.toString());

      const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load orders');
      return res.json();
    },

    async getOrderDetails(token: string, orderId: string) {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load order details');
      return res.json();
    },

    async retryFulfillment(token: string, orderId: string) {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/retry-fulfillment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to retry fulfillment');
      return data;
    },

    async manualVerifyPayment(token: string, orderId: string, reason: string) {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/manual-verify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to verify payment');
      return data;
    },

    async getProducts(token: string) {
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load products');
      return res.json();
    },

    async createProduct(token: string, product: any) {
      const res = await fetch(`${API_BASE}/admin/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create product');
      return data;
    },

    async updateProduct(token: string, id: string, updates: any) {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');
      return data;
    },

    async deleteProduct(token: string, id: string) {
      const res = await fetch(`${API_BASE}/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');
      return data;
    },

    async getCoupons(token: string) {
      const res = await fetch(`${API_BASE}/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load coupons');
      return res.json();
    },

    async createCoupon(token: string, coupon: any) {
      const res = await fetch(`${API_BASE}/admin/coupons`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(coupon),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create coupon');
      return data;
    },

    async updateCoupon(token: string, id: string, updates: any) {
      const res = await fetch(`${API_BASE}/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update coupon');
      return data;
    },

    async getSettings(token: string) {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load settings');
      return res.json();
    },

    async updateSettings(token: string, updates: any) {
      const res = await fetch(`${API_BASE}/admin/settings`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update settings');
      return data;
    },

    async getAuditLogs(token: string) {
      const res = await fetch(`${API_BASE}/admin/audit-logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load audit logs');
      return res.json();
    },

    async getTickets(token: string) {
      const res = await fetch(`${API_BASE}/admin/tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load tickets');
      return res.json();
    },

    async updateTicket(token: string, id: string, updates: any) {
      const res = await fetch(`${API_BASE}/admin/tickets/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update ticket');
      return data;
    },
  },
};
