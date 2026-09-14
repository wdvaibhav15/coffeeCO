import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomeView } from './components/home/HomeView';
import { ProductCatalog } from './components/catalog/ProductCatalog';
import { CoffeeCup3D } from './components/3d/CoffeeCup3D';
import { BrewingGuide } from './components/features/BrewingGuide';
import { CoffeeFinderQuiz } from './components/features/CoffeeFinderQuiz';
import { RoasteryStory } from './components/features/RoasteryStory';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetailModal } from './components/catalog/ProductDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { WishlistModal } from './components/wishlist/WishlistModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { CheckCircle2, Sparkles, Coffee } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView, toastMessage, theme } = useApp();

  return (
    <div
      id="app-root-wrapper"
      className={`min-h-screen transition-colors duration-300 font-sans ${
        theme === 'dark'
          ? 'bg-[#0a0705] text-stone-200 selection:bg-amber-600 selection:text-stone-950'
          : 'bg-[#fcf9f5] text-stone-900 selection:bg-amber-500 selection:text-stone-950'
      }`}
    >
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main id="main-content-viewport" className="min-h-[calc(100vh-80px)]">
        {activeView === 'home' && <HomeView />}
        {activeView === 'catalog' && <ProductCatalog />}
        {activeView === '3d-lab' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/50 text-[11px] font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Three.js Physics & Shader Rendering</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-amber-100">
                Interactive 3D Barista Lab
              </h1>
              <p className="text-xs sm:text-sm text-stone-400">
                Rotate 360°, customize your ceramic cup finish, design procedural latte art rosettes, and tailor temperature steam in real-time.
              </p>
            </div>
            <CoffeeCup3D />
          </div>
        )}
        {activeView === 'brewing' && <BrewingGuide />}
        {activeView === 'quiz' && <CoffeeFinderQuiz />}
        {activeView === 'about' && <RoasteryStory />}
        {activeView === 'dashboard' && <UserDashboard />}
        {activeView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Overlays */}
      <ProductDetailModal />
      <AuthModal />
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          id="global-toast-notification"
          className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1d140f] text-stone-100 border border-amber-600/50 shadow-2xl flex items-center gap-3 text-xs max-w-sm animate-in slide-in-from-bottom-5 duration-300"
        >
          <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="font-semibold text-stone-200">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
