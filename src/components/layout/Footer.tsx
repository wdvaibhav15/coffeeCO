import React, { useState } from 'react';
import {
  Coffee,
  Mail,
  MapPin,
  Phone,
  Clock,
  Send,
  Check,
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedCategory, showToast } = useApp();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed! Use promo code WELCOME50 for 15% off your first bag.');
  };

  return (
    <footer className="bg-[#090605] text-stone-300 border-t border-amber-950/60 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Badges Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-amber-950/40">
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#140e0b] border border-amber-900/20">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">100% Specialty Arabica</div>
              <div className="text-[11px] text-stone-400">Direct trade sourced</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#140e0b] border border-amber-900/20">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">Roasted Fresh Daily</div>
              <div className="text-[11px] text-stone-400">Shipped within 24 hours</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#140e0b] border border-amber-900/20">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">Free Shipping $35+</div>
              <div className="text-[11px] text-stone-400">Fast nationwide courier</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#140e0b] border border-amber-900/20">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">Secure Payments</div>
              <div className="text-[11px] text-stone-400">Stripe, PayPal, UPI</div>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center text-amber-100 shadow-md">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif text-lg font-bold text-amber-100 tracking-wider">
                  VELVET ROAST
                </span>
                <span className="block text-[10px] text-amber-400 uppercase tracking-widest -mt-1">
                  Artisan Roasters
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Crafting transcendent coffee experiences since 1994. We ethically source micro-lots
              from Ethiopia, Colombia, Guatemala, and Sumatra, roasting them on cast-iron drum roasters
              for rich aroma and silky crema.
            </p>
            <div className="pt-2">
              <div className="text-xs font-semibold text-amber-300 mb-2">Join Roaster&apos;s Dispatch</div>
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <input
                    id="input-newsletter-email"
                    type="email"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    disabled={isSubscribed}
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#16100c] text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  id="btn-newsletter-subscribe"
                  type="submit"
                  disabled={isSubscribed}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shrink-0"
                >
                  {isSubscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  <span>{isSubscribed ? 'Joined' : 'Join'}</span>
                </button>
              </form>
              {isSubscribed && (
                <div className="text-[11px] text-emerald-400 mt-1.5">
                  Welcome! Code <strong className="text-amber-300">WELCOME50</strong> copied for your order.
                </div>
              )}
            </div>
          </div>

          {/* Coffee Catalog Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Roastery Menu</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Coffee Beans');
                    setActiveView('catalog');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Single Origin Beans
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Espresso');
                    setActiveView('catalog');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Signature Espresso Blends
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Cold Coffee');
                    setActiveView('catalog');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Nitro & Draft Cold Brew
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Latte');
                    setActiveView('catalog');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Artisan Lattes & Mochas
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Coffee Accessories');
                    setActiveView('catalog');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Barista Gear & Kettles
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-amber-400 transition-colors">
                  Track Your Roast
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-amber-400 transition-colors">
                  Order Invoices & History
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-amber-400 transition-colors">
                  Shipping & Return Policy
                </button>
              </li>
              <li>
                <span className="text-stone-500 cursor-not-allowed">Wholesale Roasting</span>
              </li>
              <li>
                <span className="text-stone-500 cursor-not-allowed">Gift Cards</span>
              </li>
            </ul>
          </div>

          {/* Roastery Locations & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-amber-200 uppercase tracking-wider">Visit The Roastery</h4>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>842 Pike Street, Seattle Roastery District, WA 98101</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>+1 (206) 555-ROAST</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>Mon-Fri: 6:30 AM – 7:00 PM<br />Sat-Sun: 7:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-6 border-t border-amber-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 Velvet Roast Coffee Co. All rights reserved. Artisan Roasted with Passion.
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400">
            <span className="text-stone-500">Accepted Gateways:</span>
            <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">Stripe</span>
            <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">PayPal</span>
            <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">Razorpay</span>
            <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">UPI / NetBanking</span>
            <span className="px-2 py-0.5 rounded bg-stone-900 border border-stone-800">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
