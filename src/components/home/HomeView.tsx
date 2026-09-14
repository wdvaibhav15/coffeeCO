import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Flame,
  Star,
  Award,
  Coffee,
  RotateCw,
  Gift,
  CheckCircle,
  Quote
} from 'lucide-react';
import { CoffeeCup3D } from '../3d/CoffeeCup3D';
import { ProductCard } from '../catalog/ProductCard';
import { useApp } from '../../context/AppContext';

export const HomeView: React.FC = () => {
  const { products, setActiveView, setSelectedCategory, formatPrice, showToast } = useApp();

  const featuredCoffees = products.filter((p) => p.isFeatured).slice(0, 3);
  const bestSellers = products.filter((p) => p.rating >= 4.8).slice(0, 4);
  const newHarvest = products.filter((p) => p.isNewArrival).slice(0, 3);

  const customerReviews = [
    {
      id: 1,
      name: 'Elena Rostova',
      role: 'Q-Grader & Coffee Sommelier',
      comment: 'The Ethiopian Yirgacheffe washed lot had the most pristine jasmine florals and bergamot finish I have tasted in years. The degassing packaging preserved the volatile aromatics immaculately.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
      coffee: 'Ethiopian Yirgacheffe Reserve'
    },
    {
      id: 2,
      name: 'Marcus Vance',
      role: 'Home Barista Champion',
      comment: 'The 3D interactive coffee builder helped me dial in my exact milk ratio and grind size before placing my order. Shipped within 24 hours of roasting and arrived with thick crema.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      coffee: 'Velvet Signature Roast'
    },
    {
      id: 3,
      name: 'Sophia Chen',
      role: 'Daily Espresso Drinker',
      comment: 'Subscribing to their micro-lot club has completely elevated my morning ritual. Every 2 weeks brings a rare origin from volcanic terroir that brews like silk.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      coffee: 'Guatemala Antigua Honey'
    }
  ];

  return (
    <div id="home-view-container" className="space-y-16 pb-12 text-stone-200">
      {/* 1. HERO SECTION WITH EMBEDDED 3D COFFEE EXPERIENCE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#140e0b] via-[#100b08] to-[#0a0705] border-b border-amber-950/40">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-xs font-bold text-amber-300">
                <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>Small Batch Hand-Roasted Daily • Free Shipping $35+</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-100 tracking-tight leading-[1.1]">
                Awaken Your Palate to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">
                  Pure Terroir
                </span>
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                Ethically sourced single-origin micro lots and artisan house roasts, shipped within 24 hours of drum roasting. Experience sensory clarity in every cup.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  id="btn-hero-explore-catalog"
                  onClick={() => setActiveView('catalog')}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 active:scale-95 transition-all"
                >
                  <span>Explore Coffee Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-palate-quiz"
                  onClick={() => setActiveView('quiz')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#19110d] hover:bg-[#221712] text-amber-200 border border-amber-950/70 hover:border-amber-500/50 text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Take Coffee Finder Quiz</span>
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-400 border-t border-amber-950/30">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Degassing Valve Fresh Packaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>100% Direct Fair Trade</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>4.9 / 5 Average Roaster Rating</span>
                </div>
              </div>
            </div>

            {/* Right Hero: Interactive 3D Coffee Cup Customizer Canvas */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center z-10">
              <div className="w-full max-w-lg">
                <CoffeeCup3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIAL DEAL / BANNER OF THE DAY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-amber-950/90 via-[#231711] to-[#140e0b] border border-amber-700/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-600 text-stone-950 shrink-0 shadow-lg">
              <Gift className="w-7 h-7" />
            </div>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300">
                Roastery Club Special Offer
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                Take 20% Off Your First Coffee Order
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Use checkout coupon code <strong className="font-mono text-amber-400">VELVET20</strong> on any single origin or artisan blend.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveView('catalog')}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs shrink-0 shadow-md transition-transform active:scale-95"
          >
            Claim 20% Promo Now →
          </button>
        </div>
      </section>

      {/* 3. FEATURED HARVEST ROASTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Flame className="w-3.5 h-3.5" />
              <span>Direct Farm Micro-Lots</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
              Featured Single Origins
            </h2>
          </div>

          <button
            onClick={() => {
              setSelectedCategory('Coffee Beans');
              setActiveView('catalog');
            }}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>View all beans</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCoffees.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS & NEW ARRIVALS TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
              Best-Selling Signature Blends
            </h2>
          </div>

          <button
            onClick={() => setActiveView('catalog')}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group"
          >
            <span>Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE BREWING MASTERCLASS TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#1b120c] to-[#0e0907] border border-amber-950/60 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
              <Coffee className="w-4 h-4" />
              <span>Extraction Precision</span>
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
              Master the Golden Pour Over Ratio
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Unlock the nuances of high-altitude beans. Use our live ratio calculator to dial in your water temperature, grind setting, and bloom timing for Chemex, V60, and AeroPress.
            </p>
            <button
              onClick={() => setActiveView('brewing')}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <span>Launch Brewing Guide & Ratio Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto text-xs">
            <div className="p-4 rounded-2xl bg-[#140e0b] border border-amber-900/30">
              <div className="font-bold text-amber-300 text-sm">1 : 16</div>
              <div className="text-stone-400 mt-0.5">Golden Brew Ratio</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#140e0b] border border-amber-900/30">
              <div className="font-bold text-amber-300 text-sm">93°C / 200°F</div>
              <div className="text-stone-400 mt-0.5">Optimal Extraction</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#140e0b] border border-amber-900/30">
              <div className="font-bold text-amber-300 text-sm">45 Sec</div>
              <div className="text-stone-400 mt-0.5">CO₂ Degas Bloom</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#140e0b] border border-amber-900/30">
              <div className="font-bold text-amber-300 text-sm">24h Roast</div>
              <div className="text-stone-400 mt-0.5">Guaranteed Peak Freshness</div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>Over 10,000+ Bags Roasted</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-100">
            Loved by Specialty Baristas & Coffee Drinkers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-[#140e0b] border border-amber-950/40 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800/80 flex items-center gap-3">
                <img src={rev.avatar} alt={rev.name} className="w-10 h-10 rounded-full object-cover border border-amber-500/40" />
                <div>
                  <div className="font-serif font-bold text-stone-200 text-xs">{rev.name}</div>
                  <div className="text-[11px] text-stone-400">{rev.role}</div>
                  <div className="text-[10px] text-amber-400/90 font-medium mt-0.5">Verified: {rev.coffee}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
