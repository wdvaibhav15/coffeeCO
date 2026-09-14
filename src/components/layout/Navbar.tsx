import React, { useState, useRef, useEffect } from 'react';
import {
  Coffee,
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  Sun,
  Moon,
  ShieldCheck,
  Package,
  LogOut,
  X,
  ChevronDown
} from 'lucide-react';
import { useApp, Currency } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currency,
    setCurrency,
    cartTotalCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    user,
    role,
    setRole,
    logout,
    setIsAuthModalOpen,
    setAuthModalTab,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    products,
    setActiveProductModal
  } = useApp();

  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products for quick search dropdown
  const filteredQuickProducts = searchQuery.trim()
    ? products
        .filter(
          p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.flavorNotes.some(fn => fn.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .slice(0, 5)
    : [];

  const handleSelectQuickProduct = (prod: any) => {
    setActiveProductModal(prod);
    setSearchQuery('');
    setIsSearchExpanded(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-300 backdrop-blur-md bg-[#0e0a08]/90 dark:bg-[#0c0806]/95 border-b border-amber-950/40 text-stone-200">
      {/* Top Notification Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-950 via-[#3a2012] to-amber-950 text-amber-200/90 text-xs py-1.5 px-4 text-center border-b border-amber-900/30 flex items-center justify-between">
        <div className="hidden sm:block text-[11px] text-amber-300/80">
          Est. 1994 • Single Origin Roasters
        </div>
        <div className="mx-auto flex items-center gap-2 text-xs font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Fresh Micro-Batch Roasted Today! Use code <strong className="text-amber-300 font-bold bg-amber-900/50 px-1.5 py-0.5 rounded">VELVET20</strong> for 20% Off</span>
        </div>
        {/* Quick Role Switcher Pill for Testing */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-amber-400/80 hidden md:inline">Current Mode:</span>
          <button
            id="btn-quick-role-toggle"
            onClick={() => {
              if (role === 'customer') {
                setRole('admin');
                setActiveView('admin');
              } else {
                setRole('customer');
                setActiveView('home');
              }
            }}
            className={`px-2 py-0.5 rounded-full font-bold transition-all border ${
              role === 'admin'
                ? 'bg-amber-500 text-stone-950 border-amber-300 shadow-xs'
                : 'bg-stone-800 text-amber-300 border-amber-800/40 hover:bg-stone-700'
            }`}
          >
            {role === 'admin' ? 'Admin Mode (Active)' : 'Customer Mode'}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <button
          id="btn-nav-brand-logo"
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-amber-100 shadow-md shadow-amber-950/60 border border-amber-500/40 group-hover:scale-105 transition-transform">
            <Coffee className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <span className="font-serif text-lg sm:text-xl font-extrabold tracking-wide text-amber-100 group-hover:text-amber-300 transition-colors">
              VELVET ROAST
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-amber-400/80 font-medium -mt-1">
              Artisan Roastery & Café
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <button
            id="nav-link-home"
            onClick={() => setActiveView('home')}
            className={`transition-colors hover:text-amber-400 pb-1 border-b-2 ${
              activeView === 'home' ? 'text-amber-400 border-amber-500 font-semibold' : 'text-stone-300 border-transparent'
            }`}
          >
            Home
          </button>

          <button
            id="nav-link-catalog"
            onClick={() => setActiveView('catalog')}
            className={`transition-colors hover:text-amber-400 pb-1 border-b-2 ${
              activeView === 'catalog' ? 'text-amber-400 border-amber-500 font-semibold' : 'text-stone-300 border-transparent'
            }`}
          >
            Coffee Catalog
          </button>

          <button
            id="nav-link-dashboard"
            onClick={() => {
              if (!user) {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              } else {
                setActiveView('dashboard');
              }
            }}
            className={`transition-colors hover:text-amber-400 pb-1 border-b-2 ${
              activeView === 'dashboard' ? 'text-amber-400 border-amber-500 font-semibold' : 'text-stone-300 border-transparent'
            }`}
          >
            Customer Orders
          </button>

          <button
            id="nav-link-admin"
            onClick={() => {
              setRole('admin');
              setActiveView('admin');
            }}
            className={`flex items-center gap-1.5 transition-colors hover:text-amber-400 pb-1 border-b-2 ${
              activeView === 'admin' ? 'text-amber-400 border-amber-500 font-semibold' : 'text-amber-300/80 border-transparent'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Admin Suite</span>
          </button>
        </nav>

        {/* Search Bar & Auto-Suggestions */}
        <div className="relative flex-1 max-w-xs hidden md:block">
          <div className="relative">
            <input
              ref={searchInputRef}
              id="input-global-search"
              type="text"
              placeholder="Search roasts, espresso, beans..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'catalog' && e.target.value.length > 2) {
                  // user can also see live dropdown
                }
              }}
              onFocus={() => setIsSearchExpanded(true)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-stone-900/90 text-stone-200 placeholder-stone-400 border border-stone-800 focus:border-amber-500 focus:bg-stone-950 focus:outline-hidden transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                id="btn-clear-search"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchExpanded && filteredQuickProducts.length > 0 && (
            <div
              id="search-results-dropdown"
              className="absolute top-full left-0 right-0 mt-2 bg-[#17110d] border border-amber-900/40 rounded-xl shadow-2xl p-2 z-50 overflow-hidden"
            >
              <div className="text-[11px] font-semibold text-stone-400 px-2 py-1 uppercase tracking-wider">
                Matching Coffees ({filteredQuickProducts.length})
              </div>
              <div className="divide-y divide-stone-800/60">
                {filteredQuickProducts.map((p) => (
                  <button
                    key={p.id}
                    id={`search-item-${p.id}`}
                    onClick={() => handleSelectQuickProduct(p)}
                    className="w-full text-left p-2 flex items-center gap-3 hover:bg-stone-800/80 rounded-lg transition-colors group"
                  >
                    <img src={p.images[0]} alt={p.name} className="w-9 h-9 object-cover rounded-md" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate">
                        {p.category} • {p.flavorNotes.slice(0, 2).join(', ')}
                      </div>
                    </div>
                    <div className="text-xs font-bold text-amber-400">${p.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
              <button
                id="btn-view-all-search"
                onClick={() => {
                  setActiveView('catalog');
                  setIsSearchExpanded(false);
                }}
                className="w-full text-center text-xs font-semibold text-amber-400 py-1.5 mt-1 hover:bg-amber-950/40 rounded-md transition-colors"
              >
                View all in Catalog →
              </button>
            </div>
          )}
        </div>

        {/* Actions (Currency, Theme, Wishlist, Cart, Profile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Selector */}
          <div className="relative hidden sm:block">
            <select
              id="select-currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="appearance-none bg-stone-900/80 text-stone-300 text-xs font-semibold py-1.5 pl-2.5 pr-6 rounded-lg border border-stone-800 focus:outline-hidden focus:border-amber-500 cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-2.5 pointer-events-none" />
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            id="btn-toggle-theme"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Warm Cream Light Mode' : 'Switch to Espresso Obsidian Dark Mode'}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-amber-300 border border-stone-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-stone-800" />}
          </button>

          {/* Wishlist Button */}
          <button
            id="btn-open-wishlist"
            onClick={() => setIsWishlistOpen(true)}
            className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-800 relative transition-colors"
            title="View Wishlist"
          >
            <Heart className={`w-4 h-4 ${wishlist.length > 0 ? 'text-rose-400 fill-rose-400' : ''}`} />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Shopping Cart Drawer Trigger */}
          <button
            id="btn-open-cart-drawer"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold transition-all shadow-md shadow-amber-950/40 border border-amber-400/40 relative active:scale-95"
          >
            <ShoppingCart className="w-4 h-4 text-stone-950" />
            <span className="hidden sm:inline text-xs font-extrabold text-stone-950">Cart</span>
            {cartTotalCount > 0 && (
              <span className="bg-stone-950 text-amber-300 text-[11px] font-black px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* User Account Dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="btn-user-dropdown-toggle"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 transition-colors"
            >
              {user ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-lg object-cover border border-amber-600/50"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-stone-800 flex items-center justify-center text-stone-300">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
              <ChevronDown className="w-3 h-3 text-stone-400 mr-1" />
            </button>

            {isUserMenuOpen && (
              <div
                id="user-menu-popover"
                className="absolute right-0 mt-2 w-60 bg-[#16100c] border border-amber-950/60 rounded-2xl shadow-2xl p-2 z-50 text-stone-200"
              >
                {user ? (
                  <>
                    <div className="p-2 border-b border-stone-800/80">
                      <div className="text-xs font-bold text-amber-200 truncate">{user.name}</div>
                      <div className="text-[11px] text-stone-400 truncate">{user.email}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/50">
                          {role.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-amber-400/90 font-medium">
                          ☕ {user.rewardPoints} Reward Beans
                        </span>
                      </div>
                    </div>

                    <div className="py-1 space-y-0.5 text-xs font-medium">
                      <button
                        id="btn-menu-dashboard"
                        onClick={() => {
                          setActiveView('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-800 flex items-center gap-2 text-stone-300 hover:text-amber-300"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders & Addresses</span>
                      </button>

                      <button
                        id="btn-menu-admin"
                        onClick={() => {
                          setRole('admin');
                          setActiveView('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-stone-800 flex items-center gap-2 text-amber-300 hover:text-amber-200 font-semibold"
                      >
                        <ShieldCheck className="w-4 h-4 text-amber-400" />
                        <span>Admin Order & Inventory</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-800/80">
                      <button
                        id="btn-menu-logout"
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-300 flex items-center gap-2 text-xs"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-2 space-y-2">
                    <div className="text-xs font-medium text-stone-300 mb-1">
                      Sign in for order tracking, rewards & addresses:
                    </div>
                    <button
                      id="btn-menu-signin"
                      onClick={() => {
                        setAuthModalTab('login');
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs text-center transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      id="btn-menu-register"
                      onClick={() => {
                        setAuthModalTab('register');
                        setIsAuthModalOpen(true);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs text-center transition-colors"
                    >
                      Create Account
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
