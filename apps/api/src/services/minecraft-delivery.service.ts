import { Rcon } from 'rcon-client';
import { supabase, isSupabaseConfigured, memoryStore } from '../db/supabase.js';
import { FulfillmentJob, Order } from '@anajaksmp/shared';
import { SettingsService } from './settings.service.js';
import { ENV } from '../config/env.js';
import { v4 as uuidv4 } from 'uuid';

export class MinecraftDeliveryService {
  /**
   * Enqueue a fulfillment job for a paid order (idempotent: only creates once per order)
   */
  static async enqueueFulfillment(order: Order): Promise<FulfillmentJob> {
    // Check if fulfillment job already exists for this order
    const existing = await this.getJobByOrderId(order.id);
    if (existing) {
      if (existing.status === 'DELIVERED') {
        console.log(`[Minecraft Delivery] Order ${order.order_number} already fulfilled. Skipping.`);
        return existing;
      }
      // If already exists but pending/failed, return existing
      return existing;
    }

    // Assemble all commands from order items
    const commands: string[] = [];
    for (const item of order.items) {
      const itemCommands = item.commands_snapshot || [];
      for (let i = 0; i < item.quantity; i++) {
        for (const cmdTemplate of itemCommands) {
          const formattedCmd = cmdTemplate
            .replace(/\{username\}/gi, order.minecraft_username)
            .replace(/\{order_number\}/gi, order.order_number)
            .replace(/\{amount\}/gi, order.total_usd.toString());
          commands.push(formattedCmd);
        }
      }
    }

    const job: FulfillmentJob = {
      id: uuidv4(),
      order_id: order.id,
      minecraft_username: order.minecraft_username,
      status: 'QUEUED',
      attempts: 0,
      max_attempts: 5,
      commands,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('fulfillment_jobs').insert(job).select().single();
      if (error) throw error;
      return data as FulfillmentJob;
    }

    memoryStore.fulfillmentJobs.set(job.id, job);

    // Process asynchronously without blocking response
    this.processJob(job).catch((err) => {
      console.error(`[Minecraft Delivery] Error processing job ${job.id}:`, err);
    });

    return job;
  }

  /**
   * Process a single fulfillment job by executing Minecraft RCON commands
   */
  static async processJob(job: FulfillmentJob): Promise<boolean> {
    const settings = await SettingsService.getSettings();
    const rconHost = settings.rcon_host || ENV.MINECRAFT_RCON_HOST;
    const rconPort = settings.rcon_port || ENV.MINECRAFT_RCON_PORT;
    const rconPassword = ENV.MINECRAFT_RCON_PASSWORD;
    const timeoutMs = settings.rcon_timeout_ms || ENV.MINECRAFT_RCON_TIMEOUT;

    job.status = 'IN_PROGRESS';
    job.attempts += 1;
    job.updated_at = new Date().toISOString();
    await this.saveJob(job);

    // If RCON password is not set or server is in mock/sandbox mode:
    if (!rconPassword) {
      console.log(`⚠️ [Minecraft Delivery] RCON password not configured. Simulation delivery for ${job.minecraft_username}:`);
      for (const cmd of job.commands) {
        console.log(`   > [SIMULATED RCON] ${cmd}`);
        await this.recordAttempt(job.id, job.attempts, cmd, 'SIMULATED_SUCCESS: Server in test mode', true);
      }
      job.status = 'DELIVERED';
      job.executed_at = new Date().toISOString();
      await this.saveJob(job);
      await this.updateOrderStatusAfterFulfillment(job.order_id, 'DELIVERED');
      return true;
    }

    // Connect to actual Minecraft Java server via RCON
    let rcon: Rcon | null = null;
    try {
      rcon = new Rcon({
        host: rconHost,
        port: rconPort,
        password: rconPassword,
        timeout: timeoutMs,
      });

      await rcon.connect();
      console.log(`✅ [Minecraft Delivery] Connected to Minecraft server RCON (${rconHost}:${rconPort})`);

      for (const cmd of job.commands) {
        const cleanCmd = cmd.startsWith('/') ? cmd.slice(1) : cmd;
        const response = await rcon.send(cleanCmd);
        console.log(`[RCON Executed] "${cleanCmd}" => "${response}"`);
        await this.recordAttempt(job.id, job.attempts, cleanCmd, response, true);
      }

      await rcon.end();

      job.status = 'DELIVERED';
      job.executed_at = new Date().toISOString();
      job.error_message = null;
      await this.saveJob(job);
      await this.updateOrderStatusAfterFulfillment(job.order_id, 'DELIVERED');
      return true;
    } catch (error: any) {
      console.error(`❌ [Minecraft Delivery] Failed to execute RCON for order ${job.order_id}:`, error.message);
      if (rcon) {
        try {
          await rcon.end();
        } catch {
          // ignore disconnect errors
        }
      }

      job.status = 'FAILED';
      job.error_message = `RCON Error: ${error.message}`;
      await this.saveJob(job);
      await this.recordAttempt(job.id, job.attempts, 'ALL', null, false, error.message);

      // Keep order in PROCESSING state so admin can retry
      await this.updateOrderStatusAfterFulfillment(job.order_id, 'PROCESSING');
      return false;
    }
  }

  static async retryJob(jobId: string): Promise<FulfillmentJob | null> {
    let job: FulfillmentJob | null = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('fulfillment_jobs').select('*').eq('id', jobId).single();
      if (data) job = data as FulfillmentJob;
    } else {
      job = memoryStore.fulfillmentJobs.get(jobId) || null;
    }

    if (!job) return null;
    await this.processJob(job);
    return job;
  }

  static async getJobByOrderId(orderId: string): Promise<FulfillmentJob | null> {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('fulfillment_jobs').select('*').eq('order_id', orderId).limit(1).single();
      if (data) return data as FulfillmentJob;
    } else {
      for (const job of memoryStore.fulfillmentJobs.values()) {
        if (job.order_id === orderId) return job;
      }
    }
    return null;
  }

  private static async saveJob(job: FulfillmentJob): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('fulfillment_jobs').upsert(job);
    } else {
      memoryStore.fulfillmentJobs.set(job.id, { ...job });
    }
  }

  private static async recordAttempt(
    jobId: string,
    attemptNumber: number,
    command: string,
    response: string | null,
    isSuccess: boolean,
    errorDetail?: string
  ): Promise<void> {
    const attempt = {
      id: uuidv4(),
      job_id: jobId,
      attempt_number: attemptNumber,
      command_executed: command,
      response_text: response,
      is_success: isSuccess,
      error_detail: errorDetail || null,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      await supabase.from('fulfillment_attempts').insert(attempt);
    }
  }

  private static async updateOrderStatusAfterFulfillment(orderId: string, status: 'DELIVERED' | 'PROCESSING'): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
    } else {
      const order = memoryStore.orders.get(orderId);
      if (order) {
        order.status = status;
        order.updated_at = new Date().toISOString();
      }
    }
  }
}
