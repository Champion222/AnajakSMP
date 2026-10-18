import React from 'react';
import { useSettings } from '../context/SettingsContext.js';
import { Shield } from 'lucide-react';

export const TermsPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 select-none">
      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-xs font-minecraft font-bold text-[#ffb4c2] tracking-wider uppercase">
            LEGAL DOCUMENTATION
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-minecraft font-black text-white tracking-wide uppercase">
            TERMS OF SERVICE
          </h1>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-6 sm:p-10 shadow-sm text-[#131d24] space-y-6">
        <div className="border-b border-[#a7ccd6] pb-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#485963] block">
            Last Updated: October 2026
          </span>
        </div>

        <div className="text-xs sm:text-sm text-[#2c3e50] space-y-6 leading-relaxed">
          {settings?.terms_content && <p>{settings.terms_content}</p>}

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              1. In-Game Entitlements and Virtual Goods
            </h3>
            <p>
              All ranks, crate keys, currencies, cosmetics, and bundles available for purchase on AnajakSMP.xyz are strictly virtual goods for use within the AnajakSMP Minecraft server. These items have no real-world monetary value and cannot be exchanged for fiat currency or other real-world property.
            </p>
          </div>

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              2. Server Rules and Disciplinary Action
            </h3>
            <p>
              Purchasing perks, ranks, or items does not exempt any player from following the server rules. If you violate server rules (e.g. cheating, hacking, exploiting, harassment), staff reserve the right to mute, kick, or ban your account without any refund or entitlement restoration.
            </p>
          </div>

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              3. Chargebacks & Disputes
            </h3>
            <p>
              Any unauthorized chargeback, dispute, or reversal initiated through ABA Bank, Bakong, or your financial institution will result in an immediate, permanent, and non-appealable ban from the AnajakSMP network and all affiliated services.
            </p>
          </div>

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              4. Minecraft Disclaimer
            </h3>
            <p>
              AnajakSMP is not an official Minecraft product. We are neither affiliated with nor endorsed by Mojang Studios or Microsoft Corporation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 select-none">
      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-xs font-minecraft font-bold text-[#ffb4c2] tracking-wider uppercase">
            CUSTOMER PROTECTION
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-minecraft font-black text-white tracking-wide uppercase">
            REFUND POLICY
          </h1>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-6 sm:p-10 shadow-sm text-[#131d24] space-y-6">
        <div className="border-b border-[#a7ccd6] pb-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#485963] block">
            Effective Date: October 2026
          </span>
        </div>

        <div className="text-xs sm:text-sm text-[#2c3e50] space-y-6 leading-relaxed">
          {settings?.refund_policy_content && <p>{settings.refund_policy_content}</p>}

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              1. Nature of Digital Purchases
            </h3>
            <p>
              Due to the instant and automated fulfillment of digital items, commands, and rank permissions, all sales made on AnajakSMP.xyz are final. Once an item is granted to your Minecraft username, it cannot be refunded or revoked for cash.
            </p>
          </div>

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              2. Failed or Delayed Deliveries
            </h3>
            <p>
              In the event that an automated server delivery fails due to technical difficulties, server maintenance, or downtime, our staff will manually verify your payment receipt and execute the delivery to your account upon submitting a support ticket.
            </p>
          </div>

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              3. Fraudulent Transactions
            </h3>
            <p>
              If you believe an unauthorized purchase was made using your payment method, please contact our support team immediately at{' '}
              <span className="font-bold text-[#131d24] underline">
                {settings?.contact_email || 'support@anajaksmp.xyz'}
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6 select-none">
      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-xs font-minecraft font-bold text-[#ffb4c2] tracking-wider uppercase">
            PRIVACY & SECURITY
          </span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-minecraft font-black text-white tracking-wide uppercase">
            PRIVACY POLICY
          </h1>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-6 sm:p-10 shadow-sm text-[#131d24] space-y-6">
        <div className="border-b border-[#a7ccd6] pb-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#485963] block">
            Effective Date: October 2026
          </span>
        </div>

        <div className="text-xs sm:text-sm text-[#2c3e50] space-y-6 leading-relaxed">
          {settings?.privacy_policy_content && <p>{settings.privacy_policy_content}</p>}

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              1. What Information We Collect
            </h3>
            <p className="mb-2">
              We do not require account registration for players. During guest checkout, we collect only:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your Minecraft in-game username (to execute commands and deliver ranks).</li>
              <li>Your contact email address (to send order reference receipts and security access tokens).</li>
              <li>Your IP address (solely for security rate limiting and fraud prevention).</li>
            </ul>
          </div>

          <div>
            <h3 className="font-minecraft font-black text-sm sm:text-base text-[#131d24] uppercase tracking-wide mb-2">
              2. Payment Security
            </h3>
            <p>
              We do NOT store credit card numbers, CVVs, or bank credentials. All transactions are securely processed directly through the authorized gateways of ABA PayWay and the National Bank of Cambodia (NBC Bakong KHQR).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
