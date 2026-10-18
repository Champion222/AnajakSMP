import React from 'react';
import { useSettings } from '../context/SettingsContext.js';
import { Shield } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-gold text-xs uppercase font-extrabold tracking-widest block">Legal Documentation</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Terms of Service</h1>
        <p className="text-xs text-text-secondary">Effective Date: October 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-text-secondary space-y-6 leading-relaxed">
        <p>{settings?.terms_content}</p>

        <h3 className="text-white font-bold text-base mt-6">1. In-Game Entitlements and Virtual Goods</h3>
        <p>
          All ranks, crate keys, currencies, cosmetics, and bundles available for purchase on AnajakSMP.xyz are strictly virtual goods for use within the AnajakSMP Minecraft server. These items have no real-world monetary value and cannot be exchanged for fiat currency or other real-world property.
        </p>

        <h3 className="text-white font-bold text-base mt-6">2. Server Rules and Disciplinary Action</h3>
        <p>
          Purchasing perks, ranks, or items does not exempt any player from following the server rules. If you violate server rules (e.g. cheating, hacking, exploiting, harassment), staff reserve the right to mute, kick, or ban your account without any refund or entitlement restoration.
        </p>

        <h3 className="text-white font-bold text-base mt-6">3. Chargebacks & Disputes</h3>
        <p>
          Any unauthorized chargeback, dispute, or reversal initiated through ABA Bank, Bakong, or your financial institution will result in an immediate, permanent, and non-appealable ban from the AnajakSMP network and all affiliated services.
        </p>

        <h3 className="text-white font-bold text-base mt-6">4. Minecraft Disclaimer</h3>
        <p>
          AnajakSMP is not an official Minecraft product. We are neither affiliated with nor endorsed by Mojang Studios or Microsoft Corporation.
        </p>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-gold text-xs uppercase font-extrabold tracking-widest block">Customer Protection</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Refund Policy</h1>
        <p className="text-xs text-text-secondary">Effective Date: October 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-text-secondary space-y-6 leading-relaxed">
        <p>{settings?.refund_policy_content}</p>

        <h3 className="text-white font-bold text-base mt-6">1. Nature of Digital Purchases</h3>
        <p>
          Due to the instant and automated fulfillment of digital items, commands, and rank permissions, all sales made on AnajakSMP.xyz are final. Once an item is granted to your Minecraft username, it cannot be refunded or revoked for cash.
        </p>

        <h3 className="text-white font-bold text-base mt-6">2. Failed or Delayed Deliveries</h3>
        <p>
          In the event that an automated server delivery fails due to technical difficulties, server maintenance, or downtime, our staff will manually verify your payment receipt and execute the delivery to your account upon submitting a support ticket.
        </p>

        <h3 className="text-white font-bold text-base mt-6">3. Fraudulent Transactions</h3>
        <p>
          If you believe an unauthorized purchase was made using your payment method, please contact our support team immediately at <span className="text-gold">{settings?.contact_email || 'support@anajaksmp.xyz'}</span>.
        </p>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <div className="space-y-2 border-b border-brand-border pb-6">
        <span className="text-gold text-xs uppercase font-extrabold tracking-widest block">Privacy & Security</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-text-secondary">Effective Date: October 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-sm text-text-secondary space-y-6 leading-relaxed">
        <p>{settings?.privacy_policy_content}</p>

        <h3 className="text-white font-bold text-base mt-6">1. What Information We Collect</h3>
        <p>
          We do not require account registration for players. During guest checkout, we collect only:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your Minecraft in-game username (to execute commands and deliver ranks).</li>
          <li>Your contact email address (to send order reference receipts and security access tokens).</li>
          <li>Your IP address (solely for security rate limiting and fraud prevention).</li>
        </ul>

        <h3 className="text-white font-bold text-base mt-6">2. Payment Security</h3>
        <p>
          We do NOT store credit card numbers, CVVs, or bank credentials. All transactions are securely processed directly through the authorized gateways of ABA PayWay and the National Bank of Cambodia (NBC Bakong KHQR).
        </p>
      </div>
    </div>
  );
};
