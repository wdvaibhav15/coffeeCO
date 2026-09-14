import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Flame,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
  Info,
  ChevronRight
} from 'lucide-react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';

export const ProductDetailModal: React.FC = () => {
  const {
    activeProductModal,
    setActiveProductModal,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    products,
    reviews,
    addReview
  } = useApp();

  const product = activeProductModal;

  // Selected options state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex] = useState(0);
  const [selectedMilk, setSelectedMilk] = useState<string | undefined>(
    product?.variants.milkOptions?.[0]
  );
  const [selectedSugar, setSelectedSugar] = useState<string | undefined>(
    product?.variants.sugarLevels?.[0]
  );
  const [selectedGrind, setSelectedGrind] = useState<string | undefined>(
    product?.variants.grindOptions?.[0]
  );
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomCoords, setZoomCoords] = useState({ x: 0, y: 0 });
  const [justAdded, setJustAdded] = useState(false);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newReviewerName, setNewReviewerName] = useState('');

  if (!product) return null;

  const inWishlist = isInWishlist(product.id);

  // Calculate dynamic price based on size & toppings
  const sizeOption = product.variants.sizes?.[selectedSizeIndex];
  const sizePriceOffset = sizeOption?.priceOffset || 0;
  const toppingsPrice = selectedToppings.reduce((sum, topName) => {
    const found = product.variants.extraToppings?.find((t) => t.name === topName);
    return sum + (found?.price || 0);
  }, 0);

  const unitPrice = product.price + sizePriceOffset + toppingsPrice;
  const totalPrice = unitPrice * quantity;

  const handleToggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleAddToCart = () => {
    addToCart(product, {
      size: sizeOption?.name || 'Standard',
      milk: selectedMilk,
      sugar: selectedSugar,
      toppings: selectedToppings.length > 0 ? selectedToppings : undefined,
      grind: selectedGrind,
      price: unitPrice,
      quantity
    });

    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setActiveProductModal(null);
    }, 1200);
  };

  // Image Zoom handler
  const handleMouseMoveZoom = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomCoords({ x, y });
  };

  // Filter reviews for this product
  const productReviews = reviews.filter((r) => r.status === 'approved');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview({
      userId: 'guest-reviewer',
      userName: newReviewerName.trim() || 'Fellow Coffee Lover',
      rating: newRating,
      comment: newComment,
      verifiedPurchase: true
    });
    setNewComment('');
    setShowReviewForm(false);
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => setActiveProductModal(null)}
    >
      <div
        id="product-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#130d0a] border border-amber-950/60 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-stone-200"
      >
        {/* Close Button */}
        <button
          id="btn-close-product-modal"
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-stone-300 hover:text-white border border-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column: Multi-Image Gallery & Interactive Zoom */}
            <div className="space-y-3">
              {/* Main Display Image with Zoom */}
              <div
                className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 cursor-crosshair group"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMoveZoom}
              >
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-200 ${
                    isZoomed ? 'scale-175' : 'scale-100'
                  }`}
                  style={
                    isZoomed
                      ? {
                          transformOrigin: `${zoomCoords.x}% ${zoomCoords.y}%`
                        }
                      : undefined
                  }
                />
                {!isZoomed && (
                  <div className="absolute bottom-3 right-3 text-[10px] bg-black/60 text-stone-300 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-xs flex items-center gap-1 pointer-events-none">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Hover to Zoom Texture</span>
                  </div>
                )}
              </div>

              {/* Thumbnails Row (2-4 images) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    id={`thumb-img-${idx}`}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-amber-500 scale-105 shadow-md'
                        : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="p-3.5 rounded-xl bg-stone-950/60 border border-amber-950/40 text-xs space-y-2 text-stone-400">
                <div className="flex items-center gap-2 text-stone-300 font-medium">
                  <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Fresh delivery guaranteed within 24–48 hours</span>
                </div>
                <div className="flex items-center gap-2 text-stone-300 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Direct-Trade Certified & 100% Specialty Grade</span>
                </div>
              </div>
            </div>

            {/* Right Column: Customization, Nutritional Facts & Actions */}
            <div className="space-y-5">
              {/* Category, Roast, Rating */}
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {product.category}
                  </span>
                  {product.roastLevel && (
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/40 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>{product.roastLevel}</span>
                    </span>
                  )}
                  {product.origin && (
                    <span className="text-xs text-stone-400">Origin: {product.origin}</span>
                  )}
                </div>

                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
                  {product.name}
                </h1>
                <p className="text-xs text-amber-200/70 font-medium mt-0.5">{product.tagline}</p>

                {/* Rating Stars */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-amber-300">{product.rating.toFixed(1)}</span>
                  <span className="text-xs text-stone-400">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-extrabold text-amber-400">
                  {formatPrice(unitPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-stone-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs text-emerald-400 font-medium">
                  • {product.stock} bags in stock
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {product.description}
              </p>

              {/* Flavor Profile Tags */}
              {product.flavorNotes && (
                <div>
                  <label className="text-xs font-semibold text-stone-400 block mb-1.5">
                    Flavor Notes:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.flavorNotes.map((note, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#1a120e] text-amber-200 border border-amber-900/40"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant 1: Size Selector */}
              {product.variants.sizes && product.variants.sizes.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-300 mb-1.5">
                    <span>Select Size / Volume</span>
                    <span className="text-amber-400">
                      {product.variants.sizes[selectedSizeIndex]?.volume}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {product.variants.sizes.map((s, idx) => (
                      <button
                        key={s.name}
                        id={`btn-size-${s.name}`}
                        onClick={() => setSelectedSizeIndex(idx)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          selectedSizeIndex === idx
                            ? 'bg-amber-600 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-950'
                            : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-850'
                        }`}
                      >
                        <div>{s.name}</div>
                        <div className="text-[10px] opacity-80">
                          {s.priceOffset > 0 ? `+${formatPrice(s.priceOffset)}` : 'Standard'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant 2: Grind Options (For Beans) */}
              {product.variants.grindOptions && (
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                    Select Grind Style:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {product.variants.grindOptions.map((grind) => (
                      <button
                        key={grind}
                        id={`btn-grind-${grind}`}
                        onClick={() => setSelectedGrind(grind)}
                        className={`p-2 rounded-xl text-xs font-medium border transition-all text-center ${
                          selectedGrind === grind
                            ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-850'
                        }`}
                      >
                        {grind}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant 3: Milk Options (For Lattes & Cappuccinos) */}
              {product.variants.milkOptions && (
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                    Milk Selection:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {product.variants.milkOptions.map((milk) => (
                      <button
                        key={milk}
                        id={`btn-milk-${milk}`}
                        onClick={() => setSelectedMilk(milk)}
                        className={`p-2 rounded-xl text-xs font-medium border transition-all text-center ${
                          selectedMilk === milk
                            ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-850'
                        }`}
                      >
                        {milk}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant 4: Sugar Level */}
              {product.variants.sugarLevels && (
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                    Sweetness Level:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {product.variants.sugarLevels.map((sug) => (
                      <button
                        key={sug}
                        id={`btn-sugar-${sug}`}
                        onClick={() => setSelectedSugar(sug)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                          selectedSugar === sug
                            ? 'bg-amber-600 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:bg-stone-850'
                        }`}
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variant 5: Extra Toppings */}
              {product.variants.extraToppings && (
                <div>
                  <label className="text-xs font-semibold text-stone-300 block mb-1.5">
                    Barista Additions & Toppings:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {product.variants.extraToppings.map((top) => {
                      const isChecked = selectedToppings.includes(top.name);
                      return (
                        <button
                          key={top.name}
                          type="button"
                          id={`btn-topping-${top.name}`}
                          onClick={() => handleToggleTopping(top.name)}
                          className={`p-2 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                            isChecked
                              ? 'bg-amber-950 text-amber-200 border-amber-600 font-semibold'
                              : 'bg-stone-900/60 text-stone-400 border-stone-800'
                          }`}
                        >
                          <span>{top.name}</span>
                          <span className="text-amber-400 font-bold">+{formatPrice(top.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Nutritional Information Table */}
              <div className="p-3.5 rounded-2xl bg-[#19120e] border border-amber-950/60 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-2">
                  <Info className="w-3.5 h-3.5" />
                  <span>Nutritional Profile & Ingredients</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center py-1">
                  <div className="p-1.5 rounded-lg bg-stone-900/80">
                    <div className="text-[10px] text-stone-400">Calories</div>
                    <div className="font-bold text-amber-200">{product.nutrition.calories}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-900/80">
                    <div className="text-[10px] text-stone-400">Caffeine</div>
                    <div className="font-bold text-amber-200">{product.nutrition.caffeineMg}mg</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-900/80">
                    <div className="text-[10px] text-stone-400">Fat</div>
                    <div className="font-bold text-amber-200">{product.nutrition.fatG}g</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-900/80">
                    <div className="text-[10px] text-stone-400">Carbs</div>
                    <div className="font-bold text-amber-200">{product.nutrition.carbsG}g</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-900/80">
                    <div className="text-[10px] text-stone-400">Sugar</div>
                    <div className="font-bold text-amber-200">{product.nutrition.sugarG}g</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-stone-900/80">
                    <div className="text-[10px] text-stone-400">Protein</div>
                    <div className="font-bold text-amber-200">{product.nutrition.proteinG}g</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-stone-400">
                  <strong className="text-stone-300">Ingredients:</strong> {product.ingredients.join(', ')}
                </div>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-800">
                {/* Quantity */}
                <div className="flex items-center rounded-xl bg-stone-900 border border-stone-800 p-1">
                  <button
                    id="btn-modal-qty-minus"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-300 hover:bg-stone-800"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-stone-100">
                    {quantity}
                  </span>
                  <button
                    id="btn-modal-qty-plus"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-stone-300 hover:bg-stone-800"
                  >
                    +
                  </button>
                </div>

                {/* Add To Cart Button */}
                <button
                  id="btn-modal-add-to-cart"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 ${
                    justAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Your Order!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart • {formatPrice(totalPrice)}</span>
                    </>
                  )}
                </button>

                {/* Wishlist Button */}
                <button
                  id="btn-modal-wishlist-toggle"
                  onClick={() => toggleWishlist(product.id)}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  className={`p-3 rounded-xl border transition-all ${
                    inWishlist
                      ? 'bg-rose-950/60 border-rose-600/50 text-rose-400'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-400' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="pt-8 border-t border-amber-950/60">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-100">
                  Customer Reviews ({productReviews.length})
                </h3>
                <p className="text-xs text-stone-400">Real feedback from verified roast subscribers</p>
              </div>

              <button
                id="btn-write-review-toggle"
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-900/40 text-xs font-semibold transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleSubmitReview}
                className="p-4 rounded-2xl bg-[#19110d] border border-amber-900/40 mb-6 space-y-3"
              >
                <div className="text-xs font-bold text-amber-200">Share your tasting experience</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Maya Lin"
                      value={newReviewerName}
                      onChange={(e) => setNewReviewerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Rating</label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="focus:outline-hidden"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Tasting Comments</label>
                  <textarea
                    rows={3}
                    placeholder="How was the aroma, body, acidity, and brew extraction?"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors"
                >
                  Submit Tasting Review
                </button>
              </form>
            )}

            {/* Reviews List */}
            <div className="space-y-3">
              {productReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-3.5 rounded-xl bg-[#140e0b] border border-stone-800/80 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-amber-700/40 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                        {rev.userName[0]}
                      </div>
                      <span className="font-bold text-stone-200">{rev.userName}</span>
                      {rev.verifiedPurchase && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-900">
                          Verified Roast
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-stone-400">{rev.date}</span>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3 h-3 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-stone-300 leading-relaxed">{rev.comment}</p>

                  {rev.adminReply && (
                    <div className="mt-2 pl-3 border-l-2 border-amber-600 bg-[#1c130f] p-2 rounded-r-lg text-[11px] text-amber-200">
                      <strong className="text-amber-400">Roastery Reply:</strong> {rev.adminReply}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="pt-6 border-t border-amber-950/60">
              <h3 className="font-serif text-base font-bold text-amber-100 mb-3">
                Complementary Roasts & Pairings
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedProducts.map((rel) => (
                  <button
                    key={rel.id}
                    id={`btn-related-${rel.id}`}
                    onClick={() => {
                      setActiveProductModal(rel);
                      setActiveImageIndex(0);
                    }}
                    className="text-left p-2.5 rounded-xl bg-[#140e0b] border border-stone-800 hover:border-amber-600 transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-stone-200 group-hover:text-amber-300 truncate">
                        {rel.name}
                      </div>
                      <div className="text-[11px] text-amber-400 font-bold">
                        {formatPrice(rel.price)}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-amber-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
