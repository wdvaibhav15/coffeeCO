import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  Tag,
  Search,
  Filter,
  BarChart3,
  X,
  Layers,
  Archive,
  Printer
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Order, Coupon, CoffeeCategory, RoastLevel } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    formatPrice,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons' | 'inventory'>('overview');

  // Product modal state (Add / Edit)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '',
    category: 'Coffee Beans',
    price: 18.0,
    stock: 25,
    roastLevel: 'Medium Roast',
    flavorNotes: ['Caramel', 'Chocolate'],
    description: '',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80']
  });

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(25);

  // Filter orders in admin
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [orderSearch, setOrderSearch] = useState('');

  // Selected order details
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Revenue & Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stock <= 15);

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter !== 'All' && o.orderStatus !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdForm({
      name: '',
      category: 'Coffee Beans',
      price: 18.0,
      stock: 30,
      roastLevel: 'Medium Roast',
      flavorNotes: ['Hazelnut', 'Honey'],
      description: 'Single-origin washed beans cultivated in high altitude volcanic soil.',
      images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'],
      sizes: ['8 oz (225g)', '12 oz (340g)', '1 kg Bag'],
      sizePrices: { '8 oz (225g)': 15.0, '12 oz (340g)': 18.0, '1 kg Bag)': 42.0 },
      isFeatured: true
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdForm(prod);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) return;

    if (editingProduct) {
      updateProduct(editingProduct.id, prodForm);
      showToast(`Updated "${prodForm.name}" successfully!`);
    } else {
      const newP: Product = {
        id: `prod-${Date.now()}`,
        name: prodForm.name || 'New Coffee Roast',
        tagline: 'Artisan micro-batch roast',
        description: prodForm.description || 'Freshly harvested beans roasted with care.',
        category: prodForm.category as CoffeeCategory || 'Coffee Beans',
        price: Number(prodForm.price),
        rating: 4.8,
        reviewCount: 1,
        images: prodForm.images && prodForm.images.length > 0 ? prodForm.images : [
          'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80'
        ],
        stock: Number(prodForm.stock) || 20,
        roastLevel: prodForm.roastLevel as RoastLevel || 'Medium Roast',
        origin: 'Ethiopia Yirgacheffe',
        flavorNotes: prodForm.flavorNotes || ['Citrus', 'Floral'],
        ingredients: ['100% Specialty Grade Arabica Coffee Beans'],
        nutrition: {
          calories: 2,
          caffeineMg: 140,
          fatG: 0,
          carbsG: 0,
          sugarG: 0,
          proteinG: 0.2
        },
        variants: {
          sizes: [
            { name: 'Small', priceOffset: -3, volume: '8 oz' },
            { name: 'Medium', priceOffset: 0, volume: '12 oz' },
            { name: 'Large', priceOffset: 4, volume: '16 oz' }
          ],
          grindOptions: ['Whole Bean', 'Espresso (Fine)', 'Pour Over (Medium)', 'French Press (Coarse)']
        },
        isFeatured: prodForm.isFeatured || false,
        isNewArrival: true
      };
      addProduct(newP);
      showToast(`Created new product "${newP.name}"!`);
    }
    setIsProductModalOpen(false);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    addCoupon({
      code: newCouponCode.toUpperCase().trim(),
      discountPercentage: Number(newCouponDiscount),
      minPurchase: Number(newCouponMin),
      expiresAt: '2026-12-31',
      isActive: true,
      description: `${newCouponDiscount}% off orders above $${newCouponMin}`
    });
    setNewCouponCode('');
    setIsCouponModalOpen(false);
    showToast(`Created active promo coupon!`);
  };

  const handleRestockProduct = (prodId: string) => {
    const p = products.find((x) => x.id === prodId);
    if (!p) return;
    updateProduct(prodId, { stock: p.stock + 25 });
    showToast(`Restocked 25 units for ${p.name}`);
  };

  return (
    <div id="admin-dashboard-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[85vh] text-stone-200">
      {/* Top Banner / Navigation */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#170e0a] via-[#120b08] to-[#0c0806] border border-amber-950/60 shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-600 text-stone-950">
              Admin Terminal
            </span>
            <span className="text-xs text-stone-400">Velvet Roast HQ Control</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-amber-100 mt-1">
            Roastery Operations Command
          </h1>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 flex-wrap bg-stone-900/90 p-1.5 rounded-2xl border border-stone-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'products' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'orders' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'inventory' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Inventory ({lowStockProducts.length} low)
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'coupons' ? 'bg-amber-600 text-stone-950 font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            Coupons ({coupons.length})
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                <span>Total Roastery Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-100">
                {formatPrice(totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% this month</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                <span>Total Orders Placed</span>
                <Package className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-amber-300">
                {totalOrdersCount}
              </div>
              <div className="text-[11px] text-stone-400 mt-1">Across 12 states</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                <span>Registered Coffee Lovers</span>
                <Users className="w-4 h-4 text-sky-400" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-stone-200">
                1,429
              </div>
              <div className="text-[11px] text-sky-400 mt-1">84% subscriber retention</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#140e0b] border border-amber-950/40">
              <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
                <span>Low Bean Inventory</span>
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              </div>
              <div className="font-serif text-2xl sm:text-3xl font-extrabold text-rose-400">
                {lowStockProducts.length}
              </div>
              <div className="text-[11px] text-rose-400/80 mt-1">Requires green bean restock</div>
            </div>
          </div>

          {/* Revenue Distribution Visual & Top Sellers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Graph Simulator */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-[#140e0b] border border-amber-950/40 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-bold text-amber-100">Monthly Roast Sales</h3>
                  <p className="text-xs text-stone-400">Weekly bean sales volume</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                  <BarChart3 className="w-4 h-4" />
                  <span>2026 Q1</span>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="pt-4 flex items-end justify-between gap-3 h-48 border-b border-stone-800 pb-2">
                {[
                  { week: 'W1 Jan', height: '40%', val: '$1,200' },
                  { week: 'W2 Jan', height: '65%', val: '$1,850' },
                  { week: 'W3 Jan', height: '55%', val: '$1,620' },
                  { week: 'W4 Jan', height: '75%', val: '$2,100' },
                  { week: 'W1 Feb', height: '70%', val: '$1,980' },
                  { week: 'W2 Feb', height: '85%', val: '$2,450' },
                  { week: 'W3 Feb', height: '90%', val: '$2,700' },
                  { week: 'W4 Feb', height: '95%', val: '$2,910' }
                ].map((col, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="text-[10px] text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.val}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-amber-700 to-amber-500 rounded-t-lg transition-all duration-500 group-hover:brightness-125"
                      style={{ height: col.height }}
                    />
                    <div className="text-[10px] text-stone-400 mt-1 truncate">{col.week}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Roasts */}
            <div className="p-6 rounded-3xl bg-[#140e0b] border border-amber-950/40 space-y-4">
              <h3 className="font-serif text-base font-bold text-amber-100">Top Moving Coffees</h3>
              <div className="space-y-3">
                {products.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center gap-3 text-xs">
                    <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-stone-200 truncate">{p.name}</div>
                      <div className="text-[11px] text-stone-400">{p.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-400">{formatPrice(p.price)}</div>
                      <div className="text-[10px] text-emerald-400">★ {p.rating}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">Roastery Product Catalog</h2>
              <p className="text-xs text-stone-400">Manage all bean origins, specialty drinks, and gear</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-800 bg-[#140e0b]">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-[#1c130f] text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="p-3.5">Product</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Roast Profile</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Rating</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-900/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div>
                        <div className="font-bold text-stone-200">{p.name}</div>
                        <div className="text-[10px] text-stone-400 truncate max-w-xs">{p.flavorNotes.join(', ')}</div>
                      </div>
                    </td>
                    <td className="p-3.5">{p.category}</td>
                    <td className="p-3.5">{p.roastLevel || 'N/A'}</td>
                    <td className="p-3.5 font-bold text-amber-400">{formatPrice(p.price)}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        p.stock <= 10 ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'text-stone-300'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="p-3.5">★ {p.rating} ({p.reviewCount})</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditProduct(p)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${p.name}"?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-400 hover:bg-stone-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. ORDERS MANAGEMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">Live Roastery Orders</h2>
              <p className="text-xs text-stone-400">Update status, dispatch couriers, and print packing slips</p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search order ID or customer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500"
              />
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-200 border border-stone-800 focus:border-amber-500"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="roasting">Roasting</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl bg-[#140e0b] border border-amber-950/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 text-sm">{ord.id}</span>
                    <span className="text-stone-400">• {ord.customerName}</span>
                    <span className="text-stone-500 text-[11px]">({ord.customerEmail})</span>
                  </div>
                  <div className="text-stone-400 mt-1">
                    {ord.items.map((i) => `${i.quantity}x ${i.name} (${i.size})`).join(', ')}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {ord.shippingAddress.street}, {ord.shippingAddress.city}, {ord.shippingAddress.state} • {ord.shippingMethod} shipping
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="font-bold text-amber-400 text-sm">{formatPrice(ord.total)}</div>
                    <div className="text-[10px] text-emerald-400">{ord.paymentMethod.toUpperCase()} (Paid)</div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={ord.orderStatus}
                    onChange={(e: any) => updateOrderStatus(ord.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer border ${
                      ord.orderStatus === 'delivered'
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : ord.orderStatus === 'cancelled'
                        ? 'bg-rose-950 text-rose-400 border-rose-800'
                        : 'bg-amber-950 text-amber-400 border-amber-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="roasting">Roasting</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => {
                      setSelectedOrderDetails(ord);
                      window.print();
                    }}
                    title="Print Packing Slip"
                    className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">Roastery Stock & Beans Level</h2>
              <p className="text-xs text-stone-400">Green bean burlap batches and retail inventory counts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="p-4 rounded-2xl bg-[#140e0b] border border-amber-950/40 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-stone-200 truncate">{p.name}</div>
                    <div className="text-stone-400 text-[11px]">{p.category}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800">
                  <div>
                    <span className="text-stone-400">Current Stock: </span>
                    <strong className={`font-mono text-sm ${p.stock <= 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {p.stock} units
                    </strong>
                  </div>
                  <button
                    onClick={() => handleRestockProduct(p.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-stone-950 font-bold transition-colors"
                  >
                    + Restock 25
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COUPONS TAB */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-amber-100">Discounts & Promo Coupons</h2>
              <p className="text-xs text-stone-400">Seasonal campaign codes and coffee club vouchers</p>
            </div>
            <button
              onClick={() => setIsCouponModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-[#140e0b] border border-amber-950/40 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-extrabold text-amber-300 text-base">{c.code}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                    {c.discountPercentage}% OFF
                  </span>
                </div>
                <div className="text-stone-300">{c.description}</div>
                <div className="text-[11px] text-stone-500">
                  Min Spend: {formatPrice(c.minPurchase)} • Expires: {c.expiresAt}
                </div>

                <div className="pt-2 border-t border-stone-800 flex justify-end">
                  <button
                    onClick={() => deleteCoupon(c.id)}
                    className="text-stone-500 hover:text-rose-400 p-1 flex items-center gap-1 text-[11px]"
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

      {/* Product Add / Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#140e0b] border border-amber-950/60 rounded-3xl p-6 text-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100">
                {editingProduct ? 'Edit Coffee Roast' : 'Add New Specialty Coffee'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Category</label>
                  <select
                    value={prodForm.category}
                    onChange={(e: any) => setProdForm({ ...prodForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  >
                    <option value="Coffee Beans">Coffee Beans</option>
                    <option value="Espresso">Espresso</option>
                    <option value="Latte">Latte</option>
                    <option value="Cappuccino">Cappuccino</option>
                    <option value="Mocha">Mocha</option>
                    <option value="Cold Coffee">Cold Coffee</option>
                    <option value="Hot Coffee">Hot Coffee</option>
                    <option value="Tea">Tea</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Coffee Accessories">Coffee Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Roast Level</label>
                  <select
                    value={prodForm.roastLevel}
                    onChange={(e: any) => setProdForm({ ...prodForm, roastLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  >
                    <option value="Light Roast">Light Roast</option>
                    <option value="Medium Roast">Medium Roast</option>
                    <option value="Dark Roast">Dark Roast</option>
                    <option value="Espresso Roast">Espresso Roast</option>
                    <option value="French Roast">French Roast</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Base Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-stone-400 block mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold"
                >
                  Save Product
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-400 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#140e0b] border border-amber-950/60 rounded-3xl p-6 text-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-amber-100">Create Roastery Coupon</h3>
              <button onClick={() => setIsCouponModalOpen(false)}>
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER25"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 font-mono uppercase border border-stone-800 focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Discount %</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="90"
                    value={newCouponDiscount}
                    onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Min Spend ($)</label>
                  <input
                    type="number"
                    required
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-stone-900 text-stone-200 border border-stone-800 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-600 text-stone-950 font-bold">
                  Publish Coupon
                </button>
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
