import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, RotateCcw, ShoppingBag, Coffee, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export const CoffeeFinderQuiz: React.FC = () => {
  const { products, addToCart, formatPrice, setActiveProductModal, setActiveView } = useApp();

  const [step, setStep] = useState<number>(1);
  const [answers, setAnswers] = useState({
    brewMethod: '',
    flavorProfile: '',
    roastPreference: '',
    milkPreference: ''
  });
  const [recommendedProduct, setRecommendedProduct] = useState<Product | null>(null);

  const handleSelectAnswer = (key: keyof typeof answers, val: string) => {
    const updated = { ...answers, [key]: val };
    setAnswers(updated);

    if (step < 4) {
      setStep((s) => s + 1);
    } else {
      // Calculate match
      let match = products[0];
      if (updated.flavorProfile === 'fruity' || updated.roastPreference === 'light') {
        match = products.find((p) => p.name.includes('Yirgacheffe')) || products[0];
      } else if (updated.flavorProfile === 'chocolate' || updated.milkPreference === 'with-milk') {
        match = products.find((p) => p.name.includes('Antigua')) || products[1];
      } else if (updated.roastPreference === 'dark') {
        match = products.find((p) => p.name.includes('Sumatra') || p.roastLevel === 'Dark Roast') || products[2];
      } else {
        match = products.find((p) => p.name.includes('Bourbon') || p.roastLevel === 'Medium Roast') || products[0];
      }
      setRecommendedProduct(match);
      setStep(5); // Result view
    }
  };

  const handleReset = () => {
    setStep(1);
    setAnswers({
      brewMethod: '',
      flavorProfile: '',
      roastPreference: '',
      milkPreference: ''
    });
    setRecommendedProduct(null);
  };

  return (
    <div id="coffee-finder-quiz" className="max-w-3xl mx-auto px-4 sm:px-6 py-10 text-stone-200">
      <div className="p-6 sm:p-10 rounded-3xl bg-[#140e0b] border border-amber-950/60 shadow-2xl relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-lg mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-[11px] font-bold text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Flavor Profile Matcher</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100">
            Discover Your Soul Bean
          </h2>
          <p className="text-xs text-stone-400">
            Answer 4 simple palate questions and let our roastmaster algorithm match you with your ideal single-origin roast.
          </p>
        </div>

        {/* Progress Dots */}
        {step <= 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s
                    ? 'w-8 bg-amber-500'
                    : step > s
                    ? 'w-4 bg-amber-700'
                    : 'w-4 bg-stone-800'
                }`}
              />
            ))}
          </div>
        )}

        {/* QUESTION 1 */}
        {step === 1 && (
          <div className="space-y-4 text-center animate-in fade-in duration-300">
            <h3 className="font-serif text-lg font-bold text-stone-200">
              How do you prefer brewing your coffee at home?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              {[
                { id: 'pourover', title: 'Pour Over / Chemex', desc: 'Clean, tea-like, nuanced cup' },
                { id: 'espresso', title: 'Espresso Machine', desc: 'Rich, thick crema, bold shot' },
                { id: 'frenchpress', title: 'French Press / Immersion', desc: 'Heavy mouthfeel, full body' },
                { id: 'coldbrew', title: 'Cold Brew / Iced Drip', desc: 'Sweet, low acidity, refreshing' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('brewMethod', opt.id)}
                  className="p-4 rounded-2xl bg-[#1a120e] hover:bg-[#251a14] border border-amber-950/60 hover:border-amber-500 text-left transition-all group"
                >
                  <div className="font-bold text-stone-200 text-xs sm:text-sm group-hover:text-amber-300">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 2 */}
        {step === 2 && (
          <div className="space-y-4 text-center animate-in fade-in duration-300">
            <h3 className="font-serif text-lg font-bold text-stone-200">
              Which tasting notes delight your palate most?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              {[
                { id: 'fruity', title: 'Fruity & Floral', desc: 'Jasmine, peach, bergamot, berry' },
                { id: 'chocolate', title: 'Chocolate & Caramel', desc: 'Dark cocoa, toffee, brown sugar' },
                { id: 'nutty', title: 'Nutty & Spiced', desc: 'Hazelnut, nutmeg, cinnamon bark' },
                { id: 'citrus', title: 'Crisp & Bright Citrus', desc: 'Lemon curd, orange blossom, green apple' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('flavorProfile', opt.id)}
                  className="p-4 rounded-2xl bg-[#1a120e] hover:bg-[#251a14] border border-amber-950/60 hover:border-amber-500 text-left transition-all group"
                >
                  <div className="font-bold text-stone-200 text-xs sm:text-sm group-hover:text-amber-300">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 3 */}
        {step === 3 && (
          <div className="space-y-4 text-center animate-in fade-in duration-300">
            <h3 className="font-serif text-lg font-bold text-stone-200">
              What roast intensity suits your mornings?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
              {[
                { id: 'light', title: 'Light Roast', desc: 'Delicate, lively acidity, terroir focused' },
                { id: 'medium', title: 'Medium Roast', desc: 'Balanced sweetness & body, rounded caramel' },
                { id: 'dark', title: 'Dark Roast', desc: 'Smoky, bold, low acid, intense cocoa' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('roastPreference', opt.id)}
                  className="p-4 rounded-2xl bg-[#1a120e] hover:bg-[#251a14] border border-amber-950/60 hover:border-amber-500 text-center transition-all group"
                >
                  <div className="font-bold text-stone-200 text-xs group-hover:text-amber-300">
                    {opt.title}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-1">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QUESTION 4 */}
        {step === 4 && (
          <div className="space-y-4 text-center animate-in fade-in duration-300">
            <h3 className="font-serif text-lg font-bold text-stone-200">
              Do you take milk or plant mylk in your coffee?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
              {[
                { id: 'black', title: 'Black Coffee Purist', desc: 'No dairy; I want pure bean terroir' },
                { id: 'with-milk', title: 'With Milk / Oat Mylk', desc: 'I love silky lattes, flat whites & cappuccinos' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectAnswer('milkPreference', opt.id)}
                  className="p-4 rounded-2xl bg-[#1a120e] hover:bg-[#251a14] border border-amber-950/60 hover:border-amber-500 text-left transition-all group"
                >
                  <div className="font-bold text-stone-200 text-xs sm:text-sm group-hover:text-amber-300">
                    {opt.title}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT STEP */}
        {step === 5 && recommendedProduct && (
          <div className="text-center space-y-6 animate-in zoom-in-95 duration-400">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
              <Award className="w-4 h-4" />
              <span>98% Palate Match Match Found!</span>
            </div>

            <div className="p-6 rounded-3xl bg-[#19110d] border border-amber-800/40 max-w-md mx-auto flex flex-col items-center text-center space-y-3">
              <img
                src={recommendedProduct.images[0]}
                alt={recommendedProduct.name}
                className="w-28 h-28 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
              />
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                {recommendedProduct.roastLevel} • {recommendedProduct.origin}
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-100">
                {recommendedProduct.name}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                {recommendedProduct.description}
              </p>

              {/* Flavor notes pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {recommendedProduct.flavorNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/50 text-[11px] font-semibold"
                  >
                    {note}
                  </span>
                ))}
              </div>

              <div className="font-serif font-extrabold text-amber-400 text-lg pt-1">
                {formatPrice(recommendedProduct.price)}
              </div>

              <div className="flex items-center gap-2 w-full pt-2">
                <button
                  onClick={() => addToCart(recommendedProduct)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Matched Roast to Cart</span>
                </button>
                <button
                  onClick={() => setActiveProductModal(recommendedProduct)}
                  className="py-2.5 px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
                >
                  Details
                </button>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:underline font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Palate Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
