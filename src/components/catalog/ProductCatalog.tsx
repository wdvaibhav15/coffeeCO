import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useApp } from '../../context/AppContext';
import { CoffeeCategory, RoastLevel } from '../../types';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    formatPrice
  } = useApp();

  const [priceMax, setPriceMax] = useState<number>(100);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedRoast, setSelectedRoast] = useState<RoastLevel | 'All'>('All');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories: (CoffeeCategory | 'All')[] = [
    'All',
    'Coffee Beans',
    'Espresso',
    'Latte',
    'Cappuccino',
    'Mocha',
    'Cold Coffee',
    'Hot Coffee',
    'Tea',
    'Snacks',
    'Desserts',
    'Coffee Accessories'
  ];

  const roastLevels: (RoastLevel | 'All')[] = [
    'All',
    'Light Roast',
    'Medium Roast',
    'Dark Roast',
    'Espresso Roast',
    'French Roast'
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchDesc = p.description.toLowerCase().includes(q);
        const matchNotes = p.flavorNotes.some((n) => n.toLowerCase().includes(q));
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchNotes && !matchCat) return false;
      }
      // Price filter
      if (p.price > priceMax) return false;
      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;
      // Roast filter
      if (selectedRoast !== 'All' && p.roastLevel !== selectedRoast) return false;
      // Stock availability
      if (onlyInStock && p.stock <= 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceMax, minRating, selectedRoast, onlyInStock, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceMax(100);
    setMinRating(0);
    setSelectedRoast('All');
    setOnlyInStock(false);
    setSortBy('featured');
  };

  return (
    <div id="product-catalog-section" className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Catalog Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Single Origins & Hand-Brewed Drinks</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-stone-100">
          The Artisan Roastery Catalog
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm mt-1 max-w-2xl">
          Explore our seasonal harvest of ethically traded micro-lots, freshly ground signature
          roasts, specialty drinks, and competitive barista equipment.
        </p>
      </div>

      {/* Category Pills Bar (Horizontal Scrollable) */}
      <div className="mb-6 overflow-x-auto pb-2 scrollbar-none flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-amber-600 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-950'
                : 'bg-[#140e0b] text-stone-300 border-amber-950/60 hover:bg-[#1f1510] hover:text-amber-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 p-4 rounded-2xl bg-[#140e0b] border border-amber-950/50">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <input
            id="input-catalog-search"
            type="text"
            placeholder="Search flavor notes (e.g. Jasmine, Chocolate)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-stone-900 text-stone-200 placeholder-stone-400 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Sheet Button */}
          <button
            id="btn-toggle-mobile-filters"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-stone-900 text-stone-300 border border-stone-800 text-xs font-medium flex items-center gap-2"
          >
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span>Refine Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-stone-400 hidden sm:inline" />
            <select
              id="select-sort-products"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-stone-900 text-stone-200 text-xs font-semibold py-2 px-3 rounded-xl border border-stone-800 focus:border-amber-500 focus:outline-hidden cursor-pointer"
            >
              <option value="featured">Sort by: Featured Roasts</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">New Harvest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Sidebar Filters (Desktop & Collapsible Mobile) */}
        <div
          className={`space-y-6 lg:block ${
            isMobileFilterOpen
              ? 'block fixed inset-0 z-50 bg-[#0e0a08]/95 p-6 overflow-y-auto'
              : 'hidden'
          }`}
        >
          {isMobileFilterOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 lg:hidden">
              <span className="font-serif text-lg font-bold text-amber-100">Filter Roasts</span>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter Specifications</span>
              </span>
              <button
                id="btn-reset-filters"
                onClick={handleResetFilters}
                className="text-[11px] text-amber-400 hover:underline font-medium"
              >
                Reset All
              </button>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-medium text-stone-300 mb-2">
                <span>Maximum Price</span>
                <span className="text-amber-400 font-bold">{formatPrice(priceMax)}</span>
              </div>
              <input
                id="slider-price-max"
                type="range"
                min="4"
                max="100"
                step="1"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>{formatPrice(4)}</span>
                <span>{formatPrice(100)}</span>
              </div>
            </div>

            {/* Roast Level Filter */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-2">
                Roast Profile
              </label>
              <div className="space-y-1">
                {roastLevels.map((rl) => (
                  <button
                    key={rl}
                    id={`filter-roast-${rl.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedRoast(rl)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedRoast === rl
                        ? 'bg-amber-600/30 text-amber-300 font-bold border border-amber-600/40'
                        : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                    }`}
                  >
                    <span>{rl}</span>
                    {selectedRoast === rl && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Minimum Rating */}
            <div>
              <label className="text-xs font-semibold text-stone-300 block mb-2">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[0, 4.0, 4.5, 4.8].map((r) => (
                  <button
                    key={r}
                    id={`filter-rating-${r}`}
                    onClick={() => setMinRating(r)}
                    className={`p-1.5 rounded-lg text-xs font-medium border text-center transition-all ${
                      minRating === r
                        ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                    }`}
                  >
                    {r === 0 ? 'All' : `${r}★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Availability Toggle */}
            <div className="pt-2 border-t border-stone-800">
              <label className="flex items-center gap-2.5 text-xs text-stone-300 cursor-pointer">
                <input
                  id="checkbox-in-stock-only"
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded bg-stone-900 border-stone-700 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span>In Stock Only ({products.filter((p) => p.stock > 0).length})</span>
              </label>
            </div>

            {isMobileFilterOpen && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl bg-amber-600 text-stone-950 font-bold text-xs"
              >
                Apply Filters & Show {filteredProducts.length} Results
              </button>
            )}
          </div>
        </div>

        {/* Right Grid: Filtered Products */}
        <div className="lg:col-span-3">
          {/* Results Summary Count */}
          <div className="flex items-center justify-between mb-4 text-xs text-stone-400">
            <span>
              Showing <strong className="text-amber-300 font-bold">{filteredProducts.length}</strong> specialty items
            </span>
            {selectedCategory !== 'All' && (
              <span className="text-amber-400/90 font-medium">Category: {selectedCategory}</span>
            )}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center rounded-3xl bg-[#140e0b] border border-stone-800/80 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-800/40 mx-auto flex items-center justify-center text-amber-400 text-2xl font-serif">
                ☕
              </div>
              <h3 className="font-serif text-xl font-bold text-stone-200">
                No matching roasts found
              </h3>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                Try widening your price range, clearing flavor note search terms, or resetting your
                category filters to browse our full roastery menu.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
