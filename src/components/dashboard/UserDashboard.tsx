import React, { useState } from 'react';
import {
  Package,
  Heart,
  MapPin,
  Settings,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  Download,
  Trash2,
  Edit2,
  Plus,
  Save,
  Coffee,
  ShieldCheck,
  Bell,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Order, SavedAddress } from '../../types';

export const UserDashboard: React.FC = () => {
  const {
    user,
    orders,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    wishlist,
    products,
    addToCart,
    toggleWishlist,
    formatPrice,
    updateUserProfile,
    cancelOrder,
    setActiveProductModal,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('overview');

  // Address editing state
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    isDefault: false
  });

  // Settings form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileBio, setProfileBio] = useState(user?.bio || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || '');

  // Tracked order for modal/view
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState<Order | null>(null);

  // Statistics
  const userOrders = orders; // show user's orders
  const totalOrders = userOrders.length;
  const pendingOrders = userOrders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'roasting').length;
  const completedOrders = userOrders.filter((o) => o.orderStatus === 'delivered').length;
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      bio: profileBio,
      avatar: profileAvatar
    });
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      const prod = products.find((p) => p.id === item.productId) || products[0];
      addToCart(prod, {
        size: item.size,
        price: item.price,
        quantity: item.quantity
      });
    });
    showToast(`Items from order ${order.id} re-added to your cart!`);
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      name: newAddr.name,
      phone: newAddr.phone,
      street: newAddr.street,
      apartment: newAddr.apartment,
      city: newAddr.city,
      state: newAddr.state,
      zipCode: newAddr.zipCode,
      country: 'United States',
      isDefault: newAddr.isDefault,
      type: 'home'
    });
    setIsAddingNewAddress(false);
    setNewAddr({
      name: user?.name || '',
      phone: user?.phone || '',
      street: '',
      apartment: '',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
      isDefault: false
    });
  };

  return (
    <div id="user-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh] text-stone-200">
      {/* Dashboard Header Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#1b120c] via-[#150f0c] to-[#0d0907] border border-amber-950/60 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-amber-100">
                Welcome back, {user?.name || 'Coffee Enthusiast'}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60">
                Gold Roastery Tier
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Member since {user?.joinedDate || '2025'} • {user?.email}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Coffee className="w-3.5 h-3.5" />
                <span>{user?.rewardPoints || 340} Roastery Bean Points</span>
              </span>
              <span className="text-stone-500">•</span>
              <span className="text-emerald-400 font-medium">Next free espresso at 500 beans</span>
            </div>
          </div>
        </div>

        {/* Quick Navigation Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800">
          <button
            id="tab-btn-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            id="tab-btn-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            My Orders ({totalOrders})
          </button>
          <button
            id="tab-btn-wishlist"
            onClick={() => setActiveTab('wishlist')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'wishlist'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Wishlist ({wishlist.length})
          </button>
          <button
            id="tab-btn-addresses"
            onClick={() => setActiveTab('addresses')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'addresses'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Addresses ({addresses.length})
          </button>
          <button
            id="tab-btn-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span>Total Roasts Ordered</span>
                <Package className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100">
                {totalOrders}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1">Active subscriber</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span>Currently Roasting</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-400">
                {pendingOrders}
              </div>
              <div className="text-[11px] text-amber-400/80 mt-1">In dispatch pipeline</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span>Completed Deliveries</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-200">
                {completedOrders}
              </div>
              <div className="text-[11px] text-stone-400 mt-1">100% on-time rate</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span>Saved Favorites</span>
                <Heart className="w-4 h-4 text-rose-500" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-rose-300">
                {wishlist.length}
              </div>
              <div className="text-[11px] text-stone-400 mt-1">Ready for re-order</div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-amber-100">Recent Roast Orders</h2>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs text-amber-400 hover:underline font-semibold"
              >
                View all orders →
              </button>
            </div>

            <div className="space-y-3">
              {userOrders.slice(0, 2).map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-900/30">
                      <Coffee className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-amber-200 text-sm">{order.id}</span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="text-stone-400 mt-0.5">
                        {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Ordered {new Date(order.createdAt).toLocaleDateString()} • Tracking: {order.trackingNumber}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-[11px] text-stone-400">Total</div>
                      <div className="font-serif font-bold text-amber-400 text-sm">
                        {formatPrice(order.total)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReorder(order)}
                      className="px-3.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-stone-950 font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ALL ORDERS & TRACKING */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-serif text-xl font-bold text-amber-100">All Roast Orders & History</h2>
            <span className="text-xs text-stone-400">{userOrders.length} orders total</span>
          </div>

          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div
                key={ord.id}
                id={`order-card-${ord.id}`}
                className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40 space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-800/80">
                  <div>
                    <span className="font-mono text-sm font-bold text-amber-300">{ord.id}</span>
                    <span className="text-xs text-stone-400 ml-2">
                      Placed on {new Date(ord.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        ord.orderStatus === 'delivered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : ord.orderStatus === 'cancelled'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                      }`}
                    >
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-900/60 border border-stone-800 text-xs">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-stone-200 truncate">{item.name}</div>
                        <div className="text-[11px] text-stone-400">{item.size} • Qty: {item.quantity}</div>
                        <div className="text-amber-400 font-bold">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking & Status Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/80 text-xs">
                  <div className="text-stone-400">
                    <div>Tracking: <strong className="text-stone-200 font-mono">{ord.trackingNumber}</strong></div>
                    <div>Destination: {ord.shippingAddress.street}, {ord.shippingAddress.city}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReorder(ord)}
                      className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>

                    {ord.orderStatus !== 'cancelled' && ord.orderStatus !== 'delivered' && (
                      <button
                        onClick={() => cancelOrder(ord.id)}
                        className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-rose-950/60 text-stone-400 hover:text-rose-300 border border-stone-800 font-semibold transition-colors"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-amber-100">Saved Wishlist ({wishlistProducts.length})</h2>
          </div>

          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#140e0b] border border-amber-950/40 flex flex-col justify-between text-xs space-y-3">
                  <div className="flex gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <div className="font-bold text-stone-200 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-stone-400">{p.category}</div>
                      <div className="font-bold text-amber-400 mt-1">{formatPrice(p.price)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-800">
                    <button
                      onClick={() => {
                        addToCart(p);
                        toggleWishlist(p.id);
                      }}
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500">
              Your wishlist is empty.
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-amber-100">Saved Delivery Locations</h2>
            <button
              onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {/* New address form */}
          {isAddingNewAddress && (
            <form onSubmit={handleCreateAddress} className="p-5 rounded-2xl bg-[#19110d] border border-amber-900/40 space-y-3 text-xs">
              <div className="font-bold text-amber-300">Add Delivery Location</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newAddr.name}
                    onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Zip Code</label>
                  <input
                    type="text"
                    required
                    value={newAddr.zipCode}
                    onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="px-4 py-2 rounded-xl bg-amber-600 text-stone-950 font-bold">
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 text-stone-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div key={addr.id} className="p-4 rounded-2xl bg-[#140e0b] border border-amber-950/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    <span>{addr.name}</span>
                  </span>
                  {addr.isDefault ? (
                    <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800">
                      Default Delivery
                    </span>
                  ) : (
                    <button
                      onClick={() => setDefaultAddress(addr.id)}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
                <div className="text-stone-300">{addr.street} {addr.apartment}</div>
                <div className="text-stone-400">{addr.city}, {addr.state} {addr.zipCode}</div>
                <div className="text-stone-500">{addr.phone}</div>

                <div className="pt-2 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={() => deleteAddress(addr.id)}
                    className="text-stone-500 hover:text-rose-400 p-1 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: ACCOUNT SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleProfileSave} className="max-w-xl p-6 rounded-3xl bg-[#140e0b] border border-amber-950/40 space-y-4 text-xs">
          <h2 className="font-serif text-lg font-bold text-amber-100 mb-2">Account Profile & Preferences</h2>

          <div>
            <label className="text-stone-400 block mb-1 font-semibold">Avatar Image URL</label>
            <input
              type="url"
              value={profileAvatar}
              onChange={(e) => setProfileAvatar(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-stone-400 block mb-1 font-semibold">Full Name</label>
            <input
              type="text"
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-stone-400 block mb-1 font-semibold">Email Address</label>
            <input
              type="email"
              required
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-stone-400 block mb-1 font-semibold">Phone Number</label>
            <input
              type="text"
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
            />
          </div>

          <div>
            <label className="text-stone-400 block mb-1 font-semibold">Personal Bio / Coffee Taste</label>
            <textarea
              rows={2}
              value={profileBio}
              onChange={(e) => setProfileBio(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Update Account Profile</span>
          </button>
        </form>
      )}
    </div>
  );
};
