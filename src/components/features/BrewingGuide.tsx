import React, { useState } from 'react';
import { Coffee, Flame, Droplets, Clock, Scale, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BrewMethodData {
  id: string;
  name: string;
  ratio: string; // e.g. 1:16
  coffeeToWaterRatio: number; // 1g coffee to X g water
  grind: string;
  temp: string;
  time: string;
  description: string;
  steps: string[];
}

export const BrewingGuide: React.FC = () => {
  const { setActiveView } = useApp();

  const brewMethods: BrewMethodData[] = [
    {
      id: 'v60',
      name: 'Hario V60 Pour Over',
      ratio: '1 : 16',
      coffeeToWaterRatio: 16,
      grind: 'Medium-Fine (like sea salt)',
      temp: '93°C / 200°F',
      time: '3:00 min',
      description: 'Highlights sparkling acidity, floral aromatics, and clean citrus notes.',
      steps: [
        'Rinse paper filter with hot water and discard runoff to eliminate papery taste.',
        'Add freshly ground coffee to cone and shake gently to flatten the bed.',
        'Start timer and pour 50g of water for a 45-second bloom to degas CO₂.',
        'Pour remaining water in slow, concentric spirals without touching the paper edges.',
        'Let complete drawdown occur by 3:00 minutes. Swirl and serve hot.'
      ]
    },
    {
      id: 'french-press',
      name: 'French Press (Immersion)',
      ratio: '1 : 15',
      coffeeToWaterRatio: 15,
      grind: 'Coarse (like kosher salt)',
      temp: '94°C / 202°F',
      time: '4:30 min',
      description: 'Produces full-bodied, heavy mouthfeel with rich cocoa and nutty undertones.',
      steps: [
        'Preheat the glass beaker with warm water, then drain completely.',
        'Add coarse coffee grounds to the bottom of the press.',
        'Pour hot water vigorously to saturate all grounds evenly.',
        'Place the plunger lid on top without pressing down; brew undisturbed for 4 minutes.',
        'Break the crust with a spoon, scoop away excess foam, and slowly press the plunger.'
      ]
    },
    {
      id: 'aeropress',
      name: 'AeroPress (Inverted Method)',
      ratio: '1 : 13',
      coffeeToWaterRatio: 13,
      grind: 'Fine-Medium (like table salt)',
      temp: '88°C / 190°F',
      time: '1:45 min',
      description: 'Velvety, concentrated cup with low bitterness and high sweetness.',
      steps: [
        'Assemble AeroPress in inverted position with plunger set at number 4.',
        'Add freshly ground coffee and pour 200g of water at 88°C.',
        'Stir paddle back and forth for 15 seconds.',
        'Screw rinsed paper filter cap on tight, carefully invert onto your coffee mug.',
        'Press downward smoothly with gentle body weight for 30 seconds until a hiss.'
      ]
    },
    {
      id: 'chemex',
      name: 'Chemex Classic',
      ratio: '1 : 16.5',
      coffeeToWaterRatio: 16.5,
      grind: 'Medium-Coarse',
      temp: '95°C / 203°F',
      time: '4:15 min',
      description: 'Thick bonded paper filters remove all oils and sediment for pristine clarity.',
      steps: [
        'Fold thick triple-layer Chemex filter toward the spout side.',
        'Rinse generously with hot water; pour water out through the spout channel.',
        'Pour in coffee, hollow a small crater in the center.',
        'Bloom with 70g water for 45 seconds, then pour in 3 controlled stages.',
        'Lift filter to discard, swirl the carafe to aerate before pouring.'
      ]
    },
    {
      id: 'coldbrew',
      name: 'Cold Brew Immersion',
      ratio: '1 : 8',
      coffeeToWaterRatio: 8,
      grind: 'Extra Coarse (cracked pepper)',
      temp: 'Cold filtered water (15°C)',
      time: '16–20 hours',
      description: 'Ultra-low acidity, sweet syrupy body with dark chocolate and caramel notes.',
      steps: [
        'Place coarse grounds into a mesh cold brewer pouch or French press.',
        'Slowly pour cold filtered water, stirring until all dry pockets disappear.',
        'Seal container and place in refrigerator or cool dark cupboard for 18 hours.',
        'Filter through a secondary paper filter for sparkling, sediment-free cold nectar.',
        'Serve over clear ice blocks or cut 1:1 with oat milk.'
      ]
    }
  ];

  const [selectedMethod, setSelectedMethod] = useState<BrewMethodData>(brewMethods[0]);
  const [coffeeDoseGrams, setCoffeeDoseGrams] = useState<number>(18);

  // Calculated water needed based on ratio
  const waterGrams = Math.round(coffeeDoseGrams * selectedMethod.coffeeToWaterRatio);
  const estimatedCups = (waterGrams / 220).toFixed(1);

  return (
    <div id="brewing-guide-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-stone-200">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Barista Masterclass</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
          The Artisan Brewing Manual
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Dial in your morning extraction. Adjust coffee dose with our live ratio calculator and follow our
          roaster-verified recipe guidelines.
        </p>
      </div>

      {/* Brew Method Selector Pills */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
        {brewMethods.map((m) => (
          <button
            key={m.id}
            id={`btn-method-${m.id}`}
            onClick={() => setSelectedMethod(m)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedMethod.id === m.id
                ? 'bg-amber-600 text-stone-950 border-amber-400 shadow-lg shadow-amber-950'
                : 'bg-[#140e0b] text-stone-300 border-amber-950/40 hover:bg-[#1a120e]'
            }`}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* Main Grid: Calculator & Method Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Interactive Golden Ratio Calculator */}
        <div className="p-6 rounded-3xl bg-[#140e0b] border border-amber-950/50 space-y-6">
          <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-base">
            <Scale className="w-5 h-5 text-amber-500" />
            <span>Extraction Ratio Calculator</span>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-stone-300 font-semibold">Dry Coffee Dose</span>
              <span className="font-mono font-bold text-amber-400 text-sm">{coffeeDoseGrams} grams</span>
            </div>
            <input
              id="slider-coffee-dose"
              type="range"
              min="10"
              max="60"
              step="1"
              value={coffeeDoseGrams}
              onChange={(e) => setCoffeeDoseGrams(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>Single Cup (12g)</span>
              <span>Double (18g)</span>
              <span>Carafe (45g)</span>
            </div>
          </div>

          {/* Results Display */}
          <div className="p-4 rounded-2xl bg-[#19110d] border border-amber-900/40 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Golden Ratio</span>
              <span className="font-mono font-bold text-amber-300">{selectedMethod.ratio}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Total Filtered Water</span>
              <span className="font-mono font-extrabold text-amber-400 text-base">{waterGrams} grams (ml)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Approximate Yield</span>
              <span className="text-stone-200">{estimatedCups} cups of coffee</span>
            </div>
          </div>

          {/* Key Specifications */}
          <div className="space-y-2.5 text-xs text-stone-300 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-400">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Water Temp</span>
              </span>
              <span className="font-medium text-stone-200">{selectedMethod.temp}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-400">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Brew Time</span>
              </span>
              <span className="font-medium text-stone-200">{selectedMethod.time}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-stone-400">
                <Coffee className="w-3.5 h-3.5 text-amber-500" />
                <span>Grind Size</span>
              </span>
              <span className="font-medium text-stone-200">{selectedMethod.grind}</span>
            </div>
          </div>

          <button
            onClick={() => setActiveView('catalog')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Shop Beans for this method</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right 2 Columns: Step-by-Step Barista Recipe */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[#140e0b] border border-amber-950/50 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              {selectedMethod.name}
            </span>
            <h2 className="font-serif text-2xl font-bold text-amber-100 mt-1">
              Step-by-Step Brew Protocol
            </h2>
            <p className="text-xs text-stone-400 mt-1">{selectedMethod.description}</p>
          </div>

          <div className="space-y-4">
            {selectedMethod.steps.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#17100c] border border-amber-950/30 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-600/20 border border-amber-800/40 text-amber-400 font-serif font-extrabold flex items-center justify-center shrink-0 text-sm">
                  {idx + 1}
                </div>
                <div className="text-xs sm:text-sm text-stone-300 leading-relaxed pt-1">
                  {step}
                </div>
              </div>
            ))}
          </div>

          {/* Pro Barista Tip */}
          <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              <strong>Roaster Pro Tip:</strong> Always let your roasted beans rest for at least 5 to 7 days after the roast date so excessive CO₂ degassing doesn't interfere with uniform saturation.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
