import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Server,
  Smartphone,
  ChevronDown,
  Sparkles,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useSettings } from '../context/SettingsContext.js';
import { playMinecraftClick } from '../utils/minecraft-sounds.js';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Delivery',
    question: 'How long does rank or crate key delivery take?',
    answer:
      'Items and rank permissions are automatically dispatched to your character via Minecraft RCON within 1 to 5 minutes after payment confirmation. Please ensure you are logged into the server or have logged in at least once so your player data is registered.',
  },
  {
    id: 'faq-2',
    category: 'Payment',
    question: 'How do I pay with Bakong / ABA PayWay KHQR?',
    answer:
      'During checkout, select KHQR. A dynamic QR code with the exact USD or KHR amount will be displayed on screen. Open any Cambodian mobile banking app (ABA Mobile, Bakong, ACLEDA Mobile, Wing Bank, etc.) and scan to pay. Your order will update to PAID automatically in real-time.',
  },
  {
    id: 'faq-3',
    category: 'Troubleshooting',
    question: 'My payment was deducted but perks have not arrived?',
    answer:
      'First, try typing /relog in game or rejoin the server to refresh your permission cache. If perks do not appear after 10 minutes, submit a support ticket below or open a ticket on Discord. Please include your Transaction ID or Order Number so we can immediately investigate.',
  },
  {
    id: 'faq-4',
    category: 'Bedrock Edition',
    question: 'Can Bedrock Edition (PE / Console) players receive purchases?',
    answer:
      'Yes! AnajakSMP fully supports Bedrock Edition crossplay via Geyser and Floodgate. When entering your username at checkout, use the exact prefix configured for your account (typically a period "." or asterisk "*") followed by your Gamertag.',
  },
  {
    id: 'faq-5',
    category: 'Policy',
    question: 'Can I transfer my rank to another Minecraft username?',
    answer:
      'Rank transfers are reviewed manually to protect accounts from theft. If you changed your official Minecraft IGN or switched accounts, open a ticket in our Discord server with proof of account ownership.',
  },
];

const quickTopics = [
  'Payment Verification',
  'Order Delivery Delay',
  'Rank Transfer Request',
  'Bedrock Linking Issue',
  'Bug Report / Feedback',
];

export const SupportPage: React.FC = () => {
  const { settings } = useSettings();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [openFaq, setOpenFaq] = useState<string | null>('faq-1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [copiedJava, setCopiedJava] = useState(false);
  const [copiedBedrock, setCopiedBedrock] = useState(false);

  const serverIp = settings?.server_ip || 'play.anajaksmp.xyz';
  const bedrockIp = 'bedrock.anajaksmp.xyz';
  const discordUrl = settings?.discord_url || 'https://discord.gg/anajaksmp';

  const handleCopyJava = () => {
    playMinecraftClick();
    navigator.clipboard.writeText(serverIp);
    setCopiedJava(true);
    setTimeout(() => setCopiedJava(false), 2000);
  };

  const handleCopyBedrock = () => {
    playMinecraftClick();
    navigator.clipboard.writeText(`${bedrockIp}:19132`);
    setCopiedBedrock(true);
    setTimeout(() => setCopiedBedrock(false), 2000);
  };

  const toggleFaq = (id: string) => {
    playMinecraftClick();
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const selectQuickTopic = (topic: string) => {
    playMinecraftClick();
    setSubject(topic);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playMinecraftClick();
    setError(null);
    setSuccessTicket(null);

    try {
      setIsSubmitting(true);
      const res = await api.submitTicket({
        minecraft_username: username.trim(),
        customer_email: email.trim(),
        order_number: orderNumber.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });

      setSuccessTicket(res.ticketNumber);
      setUsername('');
      setEmail('');
      setOrderNumber('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit support ticket. Please try again or join Discord.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Mazer Style Header Banner */}
      <div className="bg-[#1e1319] border-2 border-[#3b202d] rounded-2xl px-5 py-3.5 flex items-center space-x-3.5 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-[#e93b67] flex items-center justify-center shrink-0 shadow-inner">
          <HelpCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="block text-[10px] font-minecraft text-[#ffb4c2] tracking-wider uppercase">
            24/7 PLAYER ASSISTANCE
          </span>
          <h1 className="text-lg sm:text-2xl font-minecraft font-black text-white tracking-wide uppercase">
            HELP & SUPPORT CENTER
          </h1>
        </div>
      </div>

      {/* Quick Server Connection & Assistance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Java IP Card */}
        <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#485963] text-[#FFE600] flex items-center justify-center shadow-inner">
                <Server className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-minecraft font-bold bg-[#9ec4cd] text-[#131d24] px-2.5 py-1 rounded-full uppercase">
                Port 25565
              </span>
            </div>
            <div>
              <h3 className="font-minecraft text-base sm:text-lg font-bold text-[#131d24]">
                JAVA EDITION
              </h3>
              <p className="text-xs text-[#485963] mt-1 font-mono font-medium">
                {serverIp}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyJava}
            className="mt-4 w-full bg-[#485963] hover:bg-[#3b4952] active:scale-95 text-white font-minecraft text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            {copiedJava ? (
              <>
                <Check className="w-4 h-4 text-[#FFE600]" />
                <span className="text-[#FFE600] font-bold">COPIED IP!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY JAVA IP</span>
              </>
            )}
          </button>
        </div>

        {/* Bedrock IP Card */}
        <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#485963] text-[#48bfe3] flex items-center justify-center shadow-inner">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-minecraft font-bold bg-[#9ec4cd] text-[#131d24] px-2.5 py-1 rounded-full uppercase">
                Port 19132
              </span>
            </div>
            <div>
              <h3 className="font-minecraft text-base sm:text-lg font-bold text-[#131d24]">
                BEDROCK EDITION
              </h3>
              <p className="text-xs text-[#485963] mt-1 font-mono font-medium">
                {bedrockIp}
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyBedrock}
            className="mt-4 w-full bg-[#485963] hover:bg-[#3b4952] active:scale-95 text-white font-minecraft text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            {copiedBedrock ? (
              <>
                <Check className="w-4 h-4 text-[#FFE600]" />
                <span className="text-[#FFE600] font-bold">COPIED IP & PORT!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>COPY BEDROCK IP</span>
              </>
            )}
          </button>
        </div>

        {/* Discord Live Desk Card */}
        <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-5 sm:p-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#5865F2] text-white flex items-center justify-center shadow-inner">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-minecraft font-bold bg-[#5865F2]/20 text-[#5865F2] px-2.5 py-1 rounded-full uppercase">
                Active 24/7
              </span>
            </div>
            <div>
              <h3 className="font-minecraft text-base sm:text-lg font-bold text-[#131d24]">
                DISCORD DESK
              </h3>
              <p className="text-xs text-[#485963] mt-1">
                Fastest support! Get 1-on-1 assistance with active staff members.
              </p>
            </div>
          </div>

          <a
            href={discordUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={playMinecraftClick}
            className="mt-4 w-full bg-[#5865F2] hover:bg-[#4752c4] active:scale-95 text-white font-minecraft text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
          >
            <span>JOIN DISCORD GUILD</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* Main Grid: FAQ on Left, Ticket Form on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Frequently Asked Questions (FAQ) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-5 sm:p-6 shadow-sm space-y-4">
            <div className="border-b border-[#a7ccd6]/60 pb-3">
              <div className="inline-flex items-center space-x-2 text-xs font-minecraft font-bold text-[#485963]">
                <Zap className="w-4 h-4 text-[#d99a16]" />
                <span>KNOWLEDGE BASE</span>
              </div>
              <h2 className="font-minecraft text-xl font-black text-[#131d24] mt-1">
                COMMON QUESTIONS
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-[#9ec4cd] border border-[#89b1ba] overflow-hidden transition-all shadow-xs"
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-3.5 text-left flex items-center justify-between space-x-3 text-xs sm:text-sm font-bold text-[#131d24] hover:bg-[#93bcc5] transition-colors"
                    >
                      <span className="leading-snug">{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#131d24] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-[#2c3e50] leading-relaxed border-t border-[#89b1ba]/50 bg-[#c2dee5]/40 font-normal">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Guarantee Note */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#9ec4cd]/60 border border-[#89b1ba] flex items-center space-x-3">
              <ShieldCheck className="w-6 h-6 text-[#131d24] shrink-0" />
              <p className="text-[11px] text-[#2c3e50] leading-tight">
                All purchases are protected by our automatic delivery system and verified with Bakong KHQR.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Support Ticket Form */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-[#c2dee5] border-2 border-[#a7ccd6] p-6 sm:p-8 shadow-sm space-y-6">
            {/* Form Header */}
            <div className="border-b border-[#a7ccd6]/60 pb-4">
              <div className="inline-flex items-center space-x-2 text-xs font-minecraft font-bold text-[#485963]">
                <Sparkles className="w-4 h-4 text-[#d99a16]" />
                <span>OFFICIAL TICKET DESK</span>
              </div>
              <h2 className="font-minecraft text-xl sm:text-2xl font-black text-[#131d24] mt-1">
                SUBMIT A SUPPORT TICKET
              </h2>
              <p className="text-xs text-[#485963] mt-1">
                Fill in the details below. Our staff responds to tickets within 2 to 6 hours.
              </p>
            </div>

            {/* Success Notification */}
            {successTicket && (
              <div className="p-4 rounded-2xl bg-[#d4edda] border border-[#c3e6cb] text-[#155724] space-y-1.5 shadow-xs">
                <div className="flex items-center space-x-2 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#28a745]" />
                  <span>Ticket #{successTicket} Submitted Successfully!</span>
                </div>
                <p className="text-xs text-[#155724]/90 pl-7">
                  We have registered your ticket. A staff member will investigate your order and respond via email or in game.
                </p>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="p-4 rounded-2xl bg-[#f8d7da] border border-[#f5c6cb] text-[#721c24] flex items-start space-x-2.5 shadow-xs">
                <AlertCircle className="w-5 h-5 text-[#dc3545] shrink-0 mt-0.5" />
                <span className="text-xs font-medium">{error}</span>
              </div>
            )}

            {/* Ticket Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Username Input with Live Avatar */}
                <div>
                  <label className="block uppercase font-bold text-[#131d24] mb-1.5 font-minecraft text-[11px]">
                    Minecraft Username <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="e.g. _T_Z"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl px-3.5 py-2.5 text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors"
                      required
                    />
                    {username.trim() && (
                      <div className="absolute right-2 w-7 h-7 rounded-lg overflow-hidden bg-[#c5dfe6] border border-white/60 shrink-0">
                        <img
                          src={`https://mc-heads.net/avatar/${username.trim()}/32`}
                          alt="avatar"
                          className="w-full h-full object-cover pixelated"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://mc-heads.net/avatar/Steve/32';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block uppercase font-bold text-[#131d24] mb-1.5 font-minecraft text-[11px]">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl px-3.5 py-2.5 text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Order Number (Optional) */}
              <div>
                <label className="block uppercase font-bold text-[#131d24] mb-1.5 font-minecraft text-[11px]">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ASMP-2026-X8F4K"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl px-3.5 py-2.5 text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] uppercase transition-colors"
                />
              </div>

              {/* Quick Subject Suggestions */}
              <div>
                <label className="block uppercase font-bold text-[#131d24] mb-1.5 font-minecraft text-[11px]">
                  Subject <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {quickTopics.map((topic) => (
                    <button
                      type="button"
                      key={topic}
                      onClick={() => selectQuickTopic(topic)}
                      className={`text-[10px] font-minecraft px-2.5 py-1 rounded-lg border transition-all ${
                        subject === topic
                          ? 'bg-[#485963] text-white border-[#485963]'
                          : 'bg-[#9ec4cd] hover:bg-[#8eb8c2] text-[#131d24] border-[#89b1ba]'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Brief summary of your inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl px-3.5 py-2.5 text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors"
                  required
                />
              </div>

              {/* Detailed Message */}
              <div>
                <label className="block uppercase font-bold text-[#131d24] mb-1.5 font-minecraft text-[11px]">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain the problem in detail (e.g. transaction receipt, what perk was missing, screenshot link, etc.)..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#f2f9fb] border-2 border-[#89b1ba] rounded-xl px-3.5 py-2.5 text-[#131d24] placeholder-[#7d9da7] focus:outline-none focus:border-[#485963] transition-colors resize-y"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FFE600] hover:bg-[#ffd700] active:scale-[0.99] text-[#131d24] font-minecraft font-black py-3 rounded-2xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50 text-xs sm:text-sm mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#131d24]" />
                    <span>SUBMITTING TICKET...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#131d24]" />
                    <span>SUBMIT SUPPORT TICKET</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
