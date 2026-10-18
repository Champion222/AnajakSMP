import { ENV } from '../config/env.js';
import { Order } from '@anajaksmp/shared';

export interface KhqrPayloadResult {
  qrString: string;
  md5Hash?: string;
  amount: number;
  currency: 'USD' | 'KHR';
  merchantName: string;
  merchantAccount: string;
  orderNumber: string;
  isConfigured: boolean;
  isSandboxMode: boolean;
}

export class KhqrService {
  /**
   * Helper to format TLV (Tag-Length-Value)
   */
  private static formatTlv(tag: string, value: string): string {
    const len = value.length.toString().padStart(2, '0');
    return `${tag}${len}${value}`;
  }

  /**
   * Compute CRC16 (CCITT-FALSE: poly 0x1021, init 0xFFFF) for EMVCo / KHQR
   */
  private static computeCrc16(data: string): string {
    let crc = 0xffff;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xffff;
        } else {
          crc = (crc << 1) & 0xffff;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  static isConfigured(): boolean {
    return Boolean(
      ENV.KHQR_BAKONG_ACCOUNT &&
        !ENV.KHQR_BAKONG_ACCOUNT.includes('placeholder')
    );
  }

  /**
   * Generate an EMVCo compliant Bakong KHQR code string
   */
  static generateKhqr(order: Order, currency: 'USD' | 'KHR' = 'USD'): KhqrPayloadResult {
    const isConfigured = this.isConfigured();
    const bakongAccount = isConfigured ? ENV.KHQR_BAKONG_ACCOUNT : 'anajak_smp@aba';
    const merchantName = (ENV.KHQR_MERCHANT_NAME || 'ANAJAK SMP').toUpperCase().slice(0, 25);
    const merchantCity = (ENV.KHQR_MERCHANT_CITY || 'PHNOM PENH').toUpperCase().slice(0, 15);
    const amountVal = currency === 'USD' ? order.total_usd.toFixed(2) : Math.round(order.total_khr).toString();
    const currencyCode = currency === 'USD' ? '840' : '116';

    // Build Bakong Merchant Account Information (Tag 29 or 30)
    // Sub-tag 00: Bakong account identifier (e.g., account@bank)
    const sub00 = this.formatTlv('00', bakongAccount);
    const tag29 = this.formatTlv('29', sub00);

    // Sub-tag for Tag 62 (Additional Data: Bill/Order Number)
    const sub01 = this.formatTlv('01', order.order_number);
    const tag62 = this.formatTlv('62', sub01);

    // Construct raw string before CRC (Tag 63)
    let payload = '';
    payload += this.formatTlv('00', '01'); // Format indicator
    payload += this.formatTlv('01', '12'); // Dynamic QR (12)
    payload += tag29;                      // Merchant info
    payload += this.formatTlv('52', '5999'); // Merchant Category Code
    payload += this.formatTlv('53', currencyCode); // Currency
    payload += this.formatTlv('54', amountVal);    // Amount
    payload += this.formatTlv('58', 'KH');         // Country Code
    payload += this.formatTlv('59', merchantName); // Merchant Name
    payload += this.formatTlv('60', merchantCity); // Merchant City
    payload += tag62;                              // Additional data (order #)

    // Append Tag 63 with length 04 for checksum calculation
    const toCrc = `${payload}6304`;
    const crc = this.computeCrc16(toCrc);
    const fullQrString = `${toCrc}${crc}`;

    return {
      qrString: fullQrString,
      amount: currency === 'USD' ? order.total_usd : order.total_khr,
      currency,
      merchantName,
      merchantAccount: bakongAccount,
      orderNumber: order.order_number,
      isConfigured,
      isSandboxMode: !isConfigured,
    };
  }
}
