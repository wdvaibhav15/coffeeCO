import React from 'react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WishlistModal: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    products,
    addToCart,
    formatPrice,
    setActiveProductModal
  } = useApp();

  if (!isWishlistOpen) return null;

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveAllToCart = () => {
    wishlistProducts.forEach((p) => {
      addToCart(p);
    });
    setIsWishlistOpen(false);
  };

  return (
    <div
      id="wishlist-modal-overlay"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsWishlistOpen(false)}
    >
      <div
        id="wishlist-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#130d0a] border border-amber-950/60 rounded-3xl shadow-2xl p-6 text-stone-200 relative max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400">
              <Heart className="w-5 h-5 fill-rose-400" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-amber-100">Saved Wishlist</h2>
              <p className="text-xs text-stone-400">{wishlistProducts.length} items saved for later</p>
            </div>
          </div>

          <button
            id="btn-close-wishlist"
            onClick={() => setIsWishlistOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {wishlistProducts.length > 0 ? (
            wishlistProducts.map((p) => (
              <div
                key={p.id}
                id={`wishlist-item-${p.id}`}
                className="p-3 rounded-2xl bg-[#17100c] border border-stone-800 flex items-center gap-3 text-xs"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-800 shrink-0 cursor-pointer"
                  onClick={() => {
                    setActiveProductModal(p);
                    setIsWishlistOpen(false);
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div
                    onClick={() => {
                      setActiveProductModal(p);
                      setIsWishlistOpen(false);
                    }}
                    className="font-serif font-bold text-stone-200 hover:text-amber-300 truncate cursor-pointer text-sm"
                  >
                    {p.name}
                  </div>
                  <div className="text-[11px] text-stone-400 truncate">
                    {p.category} • {p.flavorNotes.slice(0, 2).join(', ')}
                  </div>
                  <div className="font-serif font-extrabold text-amber-400 text-xs mt-0.5">
                    {formatPrice(p.price)}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    id={`btn-wishlist-add-${p.id}`}
                    onClick={() => {
                      addToCart(p);
                      toggleWishlist(p.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-[11px] flex items-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>To Cart</span>
                  </button>
                  <button
                    id={`btn-wishlist-delete-${p.id}`}
                    onClick={() => toggleWishlist(p.id)}
                    className="p-1.5 rounded-xl text-stone-500 hover:text-rose-400 hover:bg-stone-800 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-stone-600 mx-auto" />
              <h3 className="font-serif text-base font-bold text-stone-300">Your wishlist is empty</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore our single origin beans and artisan lattes, then tap the heart icon on any roast to save it here.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {wishlistProducts.length > 0 && (
          <div className="pt-4 border-t border-amber-950/40 flex items-center justify-between gap-3">
            <button
              id="btn-move-all-wishlist-to-cart"
              onClick={handleMoveAllToCart}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>Move All to Cart</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
