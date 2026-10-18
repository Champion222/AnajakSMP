import { Request, Response } from 'express';
import { SupportService } from '../services/support.service.js';
import { SupportTicketInput } from '@anajaksmp/shared';

export class SupportController {
  static async submitTicket(req: Request, res: Response): Promise<void> {
    try {
      const input = req.body as SupportTicketInput;
      const ticket = await SupportService.createTicket(input);

      res.status(201).json({
        success: true,
        ticketNumber: ticket.ticket_number,
        message: 'Your support ticket has been received. Our team will review it shortly.',
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
