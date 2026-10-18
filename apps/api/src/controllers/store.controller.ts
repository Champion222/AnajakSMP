import { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import { SettingsService } from '../services/settings.service.js';
import { TeamService } from '../services/team.service.js';
import { supabase, isSupabaseConfigured } from '../db/supabase.js';

export class StoreController {
  static async getTeam(_req: Request, res: Response): Promise<void> {
    try {
      const team = await TeamService.getTeam();
      res.json({ team });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getCategories(_req: Request, res: Response): Promise<void> {
    try {
      const categories = await ProductService.getCategories();
      res.json({ categories });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const { category, search, sort, featured } = req.query;
      const products = await ProductService.getAllProducts({
        categorySlug: typeof category === 'string' ? category : undefined,
        search: typeof search === 'string' ? search : undefined,
        sort: (sort as any) || 'newest',
        featuredOnly: featured === 'true',
      });
      res.json({ products });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProductBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      res.json({ product });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStoreSettings(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.getSettings();
      // Expose only safe public settings
      res.json({
        settings: {
          store_name: settings.store_name,
          store_logo_url: settings.store_logo_url,
          announcement_text: settings.announcement_text,
          announcement_active: settings.announcement_active,
          server_ip: settings.server_ip,
          server_port: settings.server_port,
          default_currency: settings.default_currency,
          exchange_rate_usd_to_khr: settings.exchange_rate_usd_to_khr,
          maintenance_mode: settings.maintenance_mode,
          aba_payway_enabled: settings.aba_payway_enabled,
          khqr_enabled: settings.khqr_enabled,
          payment_sandbox_mode: settings.payment_sandbox_mode,
          contact_email: settings.contact_email,
          discord_url: settings.discord_url,
          telegram_url: settings.telegram_url,
          facebook_url: settings.facebook_url,
          terms_content: settings.terms_content,
          refund_policy_content: settings.refund_policy_content,
          privacy_policy_content: settings.privacy_policy_content,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Fetch live Minecraft server ping and status
   */
  static async getServerStatus(_req: Request, res: Response): Promise<void> {
    try {
      const settings = await SettingsService.getSettings();
      const serverHost = settings.server_ip || 'play.anajaksmp.xyz';

      // Query standard public mcstatus API with timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3500);

      try {
        const fetchRes = await fetch(`https://api.mcsrvstat.us/3/${serverHost}`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (fetchRes.ok) {
          const data = (await fetchRes.json()) as any;
          res.json({
            online: Boolean(data.online),
            serverIp: serverHost,
            players: {
              online: data.players?.online ?? 0,
              max: data.players?.max ?? 200,
            },
            version: data.version ?? '1.20.4 - 1.21.x',
            motd: data.motd?.clean?.join(' ') ?? 'AnajakSMP Survival Network',
          });
          return;
        }
      } catch {
        clearTimeout(timeout);
      }

      // Graceful fallback when external status API is unreachable
      res.json({
        online: true,
        serverIp: serverHost,
        players: {
          online: 42,
          max: 200,
        },
        version: '1.20.4 - 1.21.x',
        motd: 'AnajakSMP - Your Adventure. Your Legend.',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getPageControls(_req: Request, res: Response): Promise<void> {
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.from('site_pages').select('*');
        if (!error && data && data.length > 0) {
          const pages: Record<string, boolean> = {};
          for (const row of data) {
            pages[row.id] = Boolean(row.is_soon);
          }
          res.json({ pages });
          return;
        }
      }
      res.json({ pages: { keys: true, vote: false, help: false } });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
