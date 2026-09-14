import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Send,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Award,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoasteryStory: React.FC = () => {
  const { showToast } = useApp();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('Coffee Inquiry');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'When was my coffee roasted?',
      a: 'We roast small batches 5 days a week. Your bag is roasted to order and shipped within 24 to 48 hours of heat application, with the exact roast date and roastmaster signature stamped on the degassing valve back label.'
    },
    {
      q: 'How should I store my specialty coffee beans?',
      a: 'Keep your whole beans inside our one-way degassing valved foil pouch or an airtight vacuum canister at room temperature. Never store coffee in the refrigerator or freezer, as moisture condensation breaks down volatile aromatic lipids.'
    },
    {
      q: 'What makes direct trade different from standard fair trade?',
      a: 'In direct trade, our green buyer visits the smallholder coffee farms directly in Ethiopia, Guatemala, and Colombia. We negotiate prices with the farm families, consistently paying 80% to 150% above fair trade minimums to encourage sustainable organic cultivation.'
    },
    {
      q: 'Can you pre-grind my coffee for my specific brew method?',
      a: 'Yes! On every product detail page or inside our 3D Barista Lab, choose your exact grind type (Espresso Fine, V60 Pour Over, French Press Coarse, or Cold Brew). We calibrate our Mahlkönig commercial burr grinders daily to within ±10 microns.'
    },
    {
      q: 'Do you offer recurring coffee subscriptions?',
      a: 'Yes, you can subscribe to any single-origin bean or espresso blend with flexible 1-week, 2-week, or 1-month deliveries and receive an automatic 15% discount plus complimentary priority delivery.'
    }
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setIsSubmitted(true);
    showToast('Your message has been received by our head barista!');
  };

  return (
    <div id="roastery-story-page" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 text-stone-200">
      {/* Brand Heritage Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-950/60 p-8 sm:p-14 bg-gradient-to-br from-[#1b120c] via-[#140e0b] to-[#0d0907]">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Award className="w-4 h-4" />
            <span>Est. 2018 • Seattle Specialty Roasters</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-amber-100 leading-tight">
            Crafting the Soul of Every Coffee Bean
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Velvet Roast was founded on an uncompromising devotion to single-origin terroir. We partner
            directly with generational micro-lot farmers in volcanic mountain altitudes, paying premium wages
            for the ripest cherries, roasted on vintage cast iron drums using precise thermistor heat profiling.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-amber-950/50">
          <div className="space-y-1">
            <div className="text-amber-400 font-serif font-bold text-lg">Direct Farm Sourcing</div>
            <p className="text-xs text-stone-400">100% shade-grown arabica purchased directly from smallholder washing stations.</p>
          </div>
          <div className="space-y-1">
            <div className="text-amber-400 font-serif font-bold text-lg">Small-Batch Micro Roasting</div>
            <p className="text-xs text-stone-400">Roasted in 12kg batches on cast-iron drum machines to unlock distinctive natural sugars.</p>
          </div>
          <div className="space-y-1">
            <div className="text-amber-400 font-serif font-bold text-lg">Sustainable Degassing Pouches</div>
            <p className="text-xs text-stone-400">100% compostable outer plant-fiber bags with nitrogen-flushed one-way aroma preservation valves.</p>
          </div>
        </div>
      </div>

      {/* Location, Hours & Contact Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left: Location & Hours */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#140e0b] border border-amber-950/50 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Visit The Roastery</span>
            <h2 className="font-serif text-2xl font-bold text-amber-100 mt-1">Café & Roastery Flagship</h2>
            <p className="text-xs text-stone-400 mt-1">
              Watch our head roaster operate the cast iron drum roasters while sipping a customized single-origin flat white.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#19110d] border border-amber-900/30">
              <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-200">Address</div>
                <div className="text-stone-400 mt-0.5">842 Pike Street, Downtown Roastery Row, Seattle, WA 98101</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#19110d] border border-amber-900/30">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-200">Roastery Hours</div>
                <div className="text-stone-400 mt-0.5">Monday – Friday: 6:30 AM – 7:00 PM</div>
                <div className="text-stone-400">Saturday & Sunday: 7:00 AM – 8:00 PM</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#19110d] border border-amber-900/30">
              <Phone className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-stone-200">Phone & Orders</div>
                <div className="text-stone-400 mt-0.5">+1 (206) 555-ROAST • info@velvetroast.com</div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Mock Visual */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-800 h-48 bg-[#1f1510] flex items-center justify-center text-center p-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-amber-600/30 text-amber-400 flex items-center justify-center mx-auto">
                <MapPin className="w-6 h-6 animate-bounce" />
              </div>
              <div className="font-serif font-bold text-stone-200 text-sm">Seattle Flagship Roastery Map</div>
              <div className="text-[11px] text-amber-300">Pike Place Corridor • Free 15-min Curbside Pickup</div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#140e0b] border border-amber-950/50 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Get in Touch</span>
            <h2 className="font-serif text-2xl font-bold text-amber-100 mt-1">Send a Note to Our Roasters</h2>
            <p className="text-xs text-stone-400 mt-1">
              Have questions about wholesale, barista masterclasses, or custom bean blends? We would love to chat.
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-12 text-center space-y-3 p-6 rounded-2xl bg-emerald-950/40 border border-emerald-800/60">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-emerald-200">Message Delivered!</h3>
              <p className="text-xs text-stone-300 max-w-xs mx-auto">
                Our head coffee educator will review your inquiry and reply via email within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-stone-950 font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1 font-semibold">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1 font-semibold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1 font-semibold">Inquiry Subject</label>
                <select
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                >
                  <option value="Coffee Inquiry">Coffee Roast & Terroir Inquiry</option>
                  <option value="Wholesale">Wholesale Beans for Cafés</option>
                  <option value="Private Barista Class">Private Barista Tasting Class</option>
                  <option value="Order Support">Order & Delivery Tracking</option>
                </select>
              </div>

              <div>
                <label className="text-stone-400 block mb-1 font-semibold">Your Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you're brewing..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message to Head Barista</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Accordion */}
      <div className="p-6 sm:p-10 rounded-3xl bg-[#140e0b] border border-amber-950/50 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-stone-400">Everything you need to know about our beans, roasting, and deliveries.</p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-amber-950/40 bg-[#19110d] overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-stone-200 hover:text-amber-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-amber-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-stone-400 leading-relaxed border-t border-stone-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
