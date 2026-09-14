import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ArrowRight,
  ShieldCheck,
  Truck,
  Bookmark,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discountAmount,
    formatPrice,
    setIsCheckoutOpen,
    setActiveView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; text?: string } | null>(null);
  const [giftCardInput, setGiftCardInput] = useState('');
  const [isGiftCardApplied, setIsGiftCardApplied] = useState(false);
  const [savedForLater, setSavedForLater] = useState<any[]>([]);

  if (!isCartOpen) return null;

  // Free shipping threshold: $35
  const shippingCost = cartSubtotal >= 35 || cartSubtotal === 0 ? 0 : 4.99;
  const giftCardDiscount = isGiftCardApplied ? 10.0 : 0;
  const estimatedTax = cartSubtotal > 0 ? (cartSubtotal - discountAmount) * 0.08 : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount - giftCardDiscount + shippingCost + estimatedTax);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponFeedback({ success: res.success, text: res.message });
    if (res.success) setCouponInput('');
  };

  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCardInput.trim()) return;
    setIsGiftCardApplied(true);
    setGiftCardInput('');
  };

  const handleSaveForLater = (item: any) => {
    setSavedForLater((prev) => [...prev, item]);
    removeFromCart(item.id);
  };

  const handleMoveBackToCart = (item: any) => {
    setSavedForLater((prev) => prev.filter((i) => i.id !== item.id));
    // add back with quantity 1
    updateCartQuantity(item.id, 1);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex justify-end"
      onClick={() => setIsCartOpen(false)}
    >
      <div
        id="cart-drawer-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#120d0a] border-l border-amber-950/60 h-full flex flex-col shadow-2xl text-stone-200 relative animate-in slide-in-from-right duration-300"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-amber-950/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-600/20 text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100">Your Fresh Roast Cart</h2>
              <span className="text-xs text-stone-400">
                {cart.length} {cart.length === 1 ? 'item' : 'items'} in order
              </span>
            </div>
          </div>

          <button
            id="btn-close-cart-drawer"
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="px-5 py-3 bg-[#19110d] border-b border-amber-950/30 text-xs">
          {cartSubtotal >= 35 ? (
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <Truck className="w-4 h-4" />
              <span>You have unlocked FREE nationwide courier shipping!</span>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between text-stone-300 mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add <strong className="text-amber-400">{formatPrice(35 - cartSubtotal)}</strong> more for Free Shipping</span>
                </span>
                <span className="text-[11px] font-bold text-amber-400">
                  {Math.round((cartSubtotal / 35) * 100)}%
                </span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartSubtotal / 35) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length > 0 ? (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="p-3.5 rounded-2xl bg-[#17100c] border border-amber-950/40 flex gap-3 text-xs"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 rounded-xl object-cover border border-stone-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-stone-200 text-xs sm:text-sm line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          id={`btn-remove-cart-${item.id}`}
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-500 hover:text-rose-400 transition-colors p-1 -mt-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Customization Details */}
                      <div className="text-[11px] text-stone-400 mt-0.5 space-y-0.5">
                        <div>Size: <span className="text-amber-300 font-medium">{item.selectedSize}</span></div>
                        {item.selectedMilk && <div>Milk: <span className="text-stone-300">{item.selectedMilk}</span></div>}
                        {item.selectedSugar && <div>Sweetness: <span className="text-stone-300">{item.selectedSugar}</span></div>}
                        {item.selectedGrind && <div>Grind: <span className="text-stone-300">{item.selectedGrind}</span></div>}
                        {item.selectedToppings && item.selectedToppings.length > 0 && (
                          <div>Adds: <span className="text-amber-400/90">{item.selectedToppings.join(', ')}</span></div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-800/60">
                      {/* Quantity Selector */}
                      <div className="flex items-center bg-stone-900 rounded-lg border border-stone-800 p-0.5">
                        <button
                          id={`btn-cart-dec-${item.id}`}
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-stone-200 text-xs">
                          {item.quantity}
                        </span>
                        <button
                          id={`btn-cart-inc-${item.id}`}
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-stone-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Save for later & Item Total */}
                      <div className="flex items-center gap-2">
                        <button
                          id={`btn-save-later-${item.id}`}
                          onClick={() => handleSaveForLater(item)}
                          className="text-[10px] text-amber-400/80 hover:text-amber-300 hover:underline"
                        >
                          Save for later
                        </button>
                        <span className="font-serif font-bold text-amber-400 text-sm">
                          {formatPrice(item.itemTotalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 mx-auto flex items-center justify-center text-stone-500 text-2xl">
                ☕
              </div>
              <h3 className="font-serif text-base font-bold text-stone-300">Your cup is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our single origin beans, handcrafted specialty drinks, or customize a roast in our 3D Barista Lab.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveView('catalog');
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 text-stone-950 font-bold text-xs shadow-md"
              >
                Browse Coffee Menu
              </button>
            </div>
          )}

          {/* Saved for Later Section */}
          {savedForLater.length > 0 && (
            <div className="pt-4 border-t border-amber-950/40">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Saved For Later ({savedForLater.length})</span>
              </h4>
              <div className="space-y-2">
                {savedForLater.map((saved) => (
                  <div
                    key={saved.id}
                    className="p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div className="truncate flex-1 pr-2">
                      <div className="font-bold text-stone-300 truncate">{saved.name}</div>
                      <div className="text-[10px] text-amber-400">{formatPrice(saved.price)}</div>
                    </div>
                    <button
                      onClick={() => handleMoveBackToCart(saved)}
                      className="px-2.5 py-1 rounded-lg bg-amber-600/30 text-amber-300 hover:bg-amber-600 hover:text-stone-950 font-semibold text-[11px] transition-colors"
                    >
                      Move to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer: Promo Code, Gift Card, Financial Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-amber-950/60 bg-[#0d0907] space-y-3.5">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-{appliedCoupon.discountPercentage}%)</span>
                  </div>
                  <button
                    id="btn-remove-applied-coupon"
                    onClick={removeCoupon}
                    className="text-stone-400 hover:text-rose-400 text-[11px] font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      id="input-cart-coupon"
                      type="text"
                      placeholder="Coupon (e.g. VELVET20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 uppercase focus:outline-hidden"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-2" />
                  </div>
                  <button
                    id="btn-apply-coupon"
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponFeedback && (
                <div
                  className={`text-[11px] mt-1 ${
                    couponFeedback.success ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {couponFeedback.text}
                </div>
              )}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-stone-400 pt-1">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-stone-200 font-medium">{formatPrice(cartSubtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Roastery Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              {isGiftCardApplied && (
                <div className="flex justify-between text-amber-300">
                  <span>Gift Card Balance</span>
                  <span>-{formatPrice(giftCardDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Courier Shipping</span>
                <span className={shippingCost === 0 ? 'text-emerald-400 font-medium' : 'text-stone-200'}>
                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="text-stone-200">{formatPrice(estimatedTax)}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-serif font-extrabold text-stone-100 pt-2 border-t border-stone-800">
                <span>Estimated Total</span>
                <span className="text-amber-400">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="btn-proceed-to-checkout"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 active:scale-98 transition-all"
            >
              <span>Proceed to Secure Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
