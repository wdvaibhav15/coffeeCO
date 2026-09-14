import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle,
  Truck,
  CreditCard,
  Building,
  QrCode,
  Wallet,
  Coins,
  MapPin,
  Plus,
  ArrowRight,
  ArrowLeft,
  Download,
  Mail,
  Smartphone,
  Sparkles,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SavedAddress, ShippingMethod, PaymentMethod, Order } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    appliedCoupon,
    discountAmount,
    formatPrice,
    addresses,
    addAddress,
    createOrder,
    user,
    setActiveView
  } = useApp();

  // Multi-step: 1 = Address, 2 = Shipping, 3 = Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected Address
  const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
  const [selectedAddressId, setSelectedAddressId] = useState<string>(defaultAddr?.id || '');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // New address form state
  const [newAddrName, setNewAddrName] = useState(user?.name || '');
  const [newAddrPhone, setNewAddrPhone] = useState(user?.phone || '+1 (555) 234-8901');
  const [newAddrStreet, setNewAddrStreet] = useState('');
  const [newAddrApt, setNewAddrApt] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('Seattle');
  const [newAddrState, setNewAddrState] = useState('WA');
  const [newAddrZip, setNewAddrZip] = useState('98101');

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState(user?.name || 'Julian Vance');
  const [upiId, setUpiId] = useState('julian@okaxis');

  // Completed Order State for Confirmation
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [emailNotificationSent, setEmailNotificationSent] = useState(true);
  const [smsNotificationSent, setSmsNotificationSent] = useState(true);

  if (!isCheckoutOpen) return null;

  // Calculate Shipping Cost based on method
  let shippingCost = 0;
  if (shippingMethod === 'standard') {
    shippingCost = cartSubtotal >= 35 ? 0 : 4.99;
  } else if (shippingMethod === 'express') {
    shippingCost = 9.99;
  } else {
    shippingCost = 0; // store pickup
  }

  const tax = (cartSubtotal - discountAmount) * 0.08;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingCost + tax);

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet || !newAddrCity) return;
    addAddress({
      name: newAddrName,
      phone: newAddrPhone,
      street: newAddrStreet,
      apartment: newAddrApt,
      city: newAddrCity,
      state: newAddrState,
      zipCode: newAddrZip,
      country: 'United States',
      isDefault: false,
      type: 'home'
    });
    setShowNewAddressForm(false);
  };

  const handlePlaceOrder = () => {
    if (!activeAddress) return;

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      size: item.selectedSize,
      optionsSummary: [item.selectedMilk, item.selectedSugar, item.selectedGrind]
        .filter(Boolean)
        .join(' • '),
      image: item.image
    }));

    const order = createOrder({
      userId: user?.id || 'guest',
      customerName: activeAddress.name,
      customerEmail: user?.email || 'coffee.lover@example.com',
      customerPhone: activeAddress.phone,
      items: orderItems,
      shippingAddress: activeAddress,
      shippingMethod,
      shippingCost,
      subtotal: cartSubtotal,
      tax,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      total: finalTotal,
      paymentMethod,
      paymentStatus: 'paid',
      orderStatus: 'roasting',
      estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString()
    });

    setCompletedOrder(order);
    setStep(4);

    // Fire festive coffee confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c89666', '#e0a96d', '#78350f', '#fbbf24', '#fef3c7']
      });
    } catch {
      // safe fallback
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div
      id="checkout-modal-overlay"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={() => step !== 4 && setIsCheckoutOpen(false)}
    >
      <div
        id="checkout-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#130d0a] border border-amber-950/60 rounded-3xl shadow-2xl p-5 sm:p-8 text-stone-200 relative my-auto max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-950/40">
          <div>
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              Velvet Roast Artisan Checkout
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
              {step === 4 ? 'Order Confirmed & Roasting!' : 'Complete Your Roast Order'}
            </h2>
          </div>

          {step !== 4 && (
            <button
              id="btn-close-checkout"
              onClick={() => setIsCheckoutOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-Step Progress Tracker */}
        {step !== 4 && (
          <div className="py-4 border-b border-amber-950/30 flex items-center justify-between text-xs">
            <div className={`flex items-center gap-1.5 font-bold ${step >= 1 ? 'text-amber-400' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-600 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                1
              </span>
              <span>Delivery Address</span>
            </div>
            <div className="w-8 h-px bg-stone-800" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 2 ? 'text-amber-400' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-600 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                2
              </span>
              <span>Shipping Speed</span>
            </div>
            <div className="w-8 h-px bg-stone-800" />
            <div className={`flex items-center gap-1.5 font-bold ${step >= 3 ? 'text-amber-400' : 'text-stone-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-600 text-stone-950' : 'bg-stone-800 text-stone-400'}`}>
                3
              </span>
              <span>Payment Gateway</span>
            </div>
          </div>
        )}

        {/* Scrollable Step Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          {/* STEP 1: Address Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-200">Select Delivery Address</h3>
                <button
                  id="btn-add-address-toggle"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Saved Addresses List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    id={`address-card-${addr.id}`}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'bg-[#1e1511] border-amber-500 shadow-md ring-1 ring-amber-500/50'
                        : 'bg-[#150f0c] border-stone-800 hover:bg-[#1a120e]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-amber-200 mb-1">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-amber-500" />
                        <span>{addr.name}</span>
                      </span>
                      {addr.isDefault && (
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.2 rounded border border-amber-800">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-stone-300">
                      {addr.street} {addr.apartment}
                    </div>
                    <div className="text-xs text-stone-400">
                      {addr.city}, {addr.state} {addr.zipCode}
                    </div>
                    <div className="text-[11px] text-stone-500 mt-1">{addr.phone}</div>
                  </div>
                ))}
              </div>

              {/* Add New Address Form Modal / Drawer */}
              {showNewAddressForm && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="p-4 rounded-2xl bg-[#18110e] border border-amber-900/50 space-y-3"
                >
                  <div className="text-xs font-bold text-amber-300">Add New Shipping Location</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={newAddrName}
                        onChange={(e) => setNewAddrName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={newAddrPhone}
                        onChange={(e) => setNewAddrPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 742 Evergreen Terrace"
                      value={newAddrStreet}
                      onChange={(e) => setNewAddrStreet(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={newAddrCity}
                        onChange={(e) => setNewAddrCity(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={newAddrState}
                        onChange={(e) => setNewAddrState(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Zip Code</label>
                      <input
                        type="text"
                        required
                        value={newAddrZip}
                        onChange={(e) => setNewAddrZip(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewAddressForm(false)}
                      className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400 text-xs font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Shipping Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-200">Select Roastery Delivery Speed</h3>
              <div className="space-y-3">
                <div
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === 'standard'
                      ? 'bg-[#1e1511] border-amber-500 shadow-md'
                      : 'bg-[#150f0c] border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-200">Standard Fresh Courier (2–4 Days)</div>
                      <div className="text-[11px] text-stone-400">Roasted in daily batch & shipped in degassing valved pouches</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-400 text-sm">
                      {cartSubtotal >= 35 ? 'FREE' : formatPrice(4.99)}
                    </span>
                    {cartSubtotal >= 35 && (
                      <div className="text-[10px] text-emerald-400">Unlocked ($35+ order)</div>
                    )}
                  </div>
                </div>

                <div
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === 'express'
                      ? 'bg-[#1e1511] border-amber-500 shadow-md'
                      : 'bg-[#150f0c] border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-200">Express Next-Day Roast (24–48 Hours)</div>
                      <div className="text-[11px] text-stone-400">Priority roast queue with temperature-controlled air transit</div>
                    </div>
                  </div>
                  <span className="font-bold text-amber-400 text-sm">{formatPrice(9.99)}</span>
                </div>

                <div
                  onClick={() => setShippingMethod('pickup')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === 'pickup'
                      ? 'bg-[#1e1511] border-amber-500 shadow-md'
                      : 'bg-[#150f0c] border-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-stone-200">Direct Roastery Café Counter Pickup</div>
                      <div className="text-[11px] text-stone-400">842 Pike Street, Seattle, WA • Ready in 2 hours</div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-400 text-sm">FREE</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Gateway & Methods */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-stone-200">Choose Payment Gateway</h3>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  id="btn-pay-stripe"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'stripe'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-[#150f0c] text-stone-300 border-stone-800'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-amber-400" />
                  <span>Stripe / Card</span>
                </button>

                <button
                  type="button"
                  id="btn-pay-razorpay"
                  onClick={() => setPaymentMethod('razorpay')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-[#150f0c] text-stone-300 border-stone-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Razorpay / UPI</span>
                </button>

                <button
                  type="button"
                  id="btn-pay-paypal"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'paypal'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-[#150f0c] text-stone-300 border-stone-800'
                  }`}
                >
                  <Wallet className="w-4 h-4 text-amber-400" />
                  <span>PayPal</span>
                </button>

                <button
                  type="button"
                  id="btn-pay-upi"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-[#150f0c] text-stone-300 border-stone-800'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>Google / PhonePe</span>
                </button>

                <button
                  type="button"
                  id="btn-pay-netbanking"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-[#150f0c] text-stone-300 border-stone-800'
                  }`}
                >
                  <Building className="w-4 h-4 text-amber-400" />
                  <span>Net Banking</span>
                </button>

                <button
                  type="button"
                  id="btn-pay-cod"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-600/30 text-amber-300 border-amber-500 shadow-md'
                      : 'bg-[#150f0c] text-stone-300 border-stone-800'
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>Cash on Delivery</span>
                </button>
              </div>

              {/* Dynamic Interactive Payment Form */}
              {paymentMethod === 'stripe' && (
                <div className="p-4 rounded-2xl bg-[#17100c] border border-amber-900/40 space-y-3 text-xs">
                  <div className="flex items-center justify-between text-stone-400 text-[11px]">
                    <span>Simulated Stripe 256-bit SSL Secure Card</span>
                    <span className="text-amber-400 font-semibold">Visa / Mastercard / Amex</span>
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 font-mono border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">Expires (MM/YY)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 font-mono border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-stone-400 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 font-mono border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {(paymentMethod === 'razorpay' || paymentMethod === 'upi') && (
                <div className="p-4 rounded-2xl bg-[#17100c] border border-amber-900/40 text-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 bg-white p-1 rounded-xl flex items-center justify-center shrink-0">
                      <QrCode className="w-16 h-16 text-black" />
                    </div>
                    <div>
                      <div className="font-bold text-amber-200">Scan QR Code or Enter UPI VPA</div>
                      <div className="text-[11px] text-stone-400">
                        Supports Google Pay, PhonePe, Paytm, and BHIM UPI
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-stone-400 block mb-1">UPI ID</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="p-4 rounded-2xl bg-[#17100c] border border-amber-900/40 text-xs text-stone-300">
                  You will be securely redirected to PayPal Express to finalize your roast purchase
                  with buyer protection.
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-[#17100c] border border-amber-900/40 text-xs text-amber-200">
                  Pay with exact cash or contactless card machine when the barista delivery arrives
                  at your doorstep.
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Order Confirmation & Live Tracking & Printable Invoice */}
          {step === 4 && completedOrder && (
            <div id="printable-invoice-section" className="space-y-6 text-xs">
              <div className="text-center py-4 space-y-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-amber-100">
                  Roast Batch Scheduled!
                </h3>
                <p className="text-xs text-stone-400">
                  Order ID: <strong className="text-amber-400 font-mono">{completedOrder.id}</strong> •
                  Tracking: <strong className="text-stone-300 font-mono">{completedOrder.trackingNumber}</strong>
                </p>
              </div>

              {/* Order Timeline Visualizer */}
              <div className="p-4 rounded-2xl bg-[#17100c] border border-amber-950/40">
                <div className="text-xs font-bold text-amber-200 uppercase tracking-wider mb-3">
                  Live Roastery Progress
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex flex-col items-center gap-1 text-emerald-400">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
                      ✓
                    </span>
                    <span>Order Placed</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-amber-600 mx-1" />
                  <div className="flex flex-col items-center gap-1 text-amber-400 animate-pulse">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-stone-950 flex items-center justify-center font-bold text-[10px]">
                      ☕
                    </span>
                    <span>Drum Roasting</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-stone-800 mx-1" />
                  <div className="flex flex-col items-center gap-1 text-stone-500">
                    <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center font-bold text-[10px]">
                      3
                    </span>
                    <span>Degassing & Pack</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-stone-800 mx-1" />
                  <div className="flex flex-col items-center gap-1 text-stone-500">
                    <span className="w-6 h-6 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center font-bold text-[10px]">
                      4
                    </span>
                    <span>Dispatched</span>
                  </div>
                </div>
              </div>

              {/* Printable Invoice Summary Table */}
              <div className="p-4 rounded-2xl bg-[#17100c] border border-amber-950/40 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-serif font-bold text-amber-200 text-sm">
                    Velvet Roast Coffee Co. Official Receipt
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Date: {new Date(completedOrder.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="divide-y divide-stone-800/60">
                  {completedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{item.quantity}x</span>
                        <div>
                          <div className="font-medium text-stone-200">{item.name}</div>
                          <div className="text-[10px] text-stone-400">{item.size} {item.optionsSummary ? `• ${item.optionsSummary}` : ''}</div>
                        </div>
                      </div>
                      <div className="font-mono text-amber-400 font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-800 space-y-1 text-stone-400">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(completedOrder.subtotal)}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount ({completedOrder.couponCode})</span>
                      <span>-{formatPrice(completedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping ({completedOrder.shippingMethod})</span>
                    <span>{completedOrder.shippingCost === 0 ? 'FREE' : formatPrice(completedOrder.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(completedOrder.tax)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-stone-100 pt-1 border-t border-stone-800">
                    <span>Total Paid</span>
                    <span className="text-amber-400">{formatPrice(completedOrder.total)}</span>
                  </div>
                </div>
              </div>

              {/* Notification & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-300">
                    <input
                      type="checkbox"
                      checked={emailNotificationSent}
                      onChange={(e) => setEmailNotificationSent(e.target.checked)}
                      className="rounded bg-stone-900 border-stone-700 text-amber-600"
                    />
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email Invoice Sent</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-stone-300">
                    <input
                      type="checkbox"
                      checked={smsNotificationSent}
                      onChange={(e) => setSmsNotificationSent(e.target.checked)}
                      className="rounded bg-stone-900 border-stone-700 text-amber-600"
                    />
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>SMS Tracking Enabled</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-print-invoice"
                    onClick={handlePrintInvoice}
                    className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>

                  <button
                    id="btn-go-to-dashboard-orders"
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setActiveView('dashboard');
                    }}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold transition-colors"
                  >
                    View My Orders →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons (Steps 1, 2, 3) */}
        {step !== 4 && (
          <div className="pt-4 border-t border-amber-950/40 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                id="btn-checkout-prev-step"
                onClick={() => setStep((s) => (s - 1) as any)}
                className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step === 1 && (
              <button
                id="btn-step1-continue"
                onClick={() => setStep(2)}
                disabled={!activeAddress}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Continue to Shipping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 2 && (
              <button
                id="btn-step2-continue"
                onClick={() => setStep(3)}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {step === 3 && (
              <button
                id="btn-place-order-final"
                onClick={handlePlaceOrder}
                className="px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-extrabold text-xs sm:text-sm flex items-center gap-2 shadow-xl shadow-amber-950/50 active:scale-95 transition-all"
              >
                <span>Authorize & Place Order ({formatPrice(finalTotal)})</span>
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
