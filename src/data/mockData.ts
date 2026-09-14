import { Product, Review, Coupon, BlogPost, SavedAddress, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Velvet Reserve Ethiopian Geisha',
    tagline: 'Single Origin • Jasmine Floral & Bergamot Notes',
    description: 'Harvested from high-altitude misty slopes in Gesha Village, Ethiopia. Featuring delicate notes of fragrant jasmine blossom, bergamot citrus, and honey nectar with a silky tea-like finish.',
    price: 24.50,
    originalPrice: 28.00,
    category: 'Coffee Beans',
    stock: 24,
    rating: 4.9,
    reviewCount: 48,
    images: [
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Light Roast',
    flavorNotes: ['Jasmine', 'Bergamot', 'Wild Honey', 'Peach'],
    origin: 'Gesha Village, Bench Maji Zone, Ethiopia',
    ingredients: ['100% Arabica Specialty Coffee Beans'],
    nutrition: { calories: 2, caffeineMg: 120, fatG: 0, carbsG: 0, sugarG: 0, proteinG: 0 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '250g (8.8 oz)' },
        { name: 'Medium', priceOffset: 16.00, volume: '500g (1.1 lbs)' },
        { name: 'Large', priceOffset: 34.00, volume: '1000g (2.2 lbs)' }
      ],
      grindOptions: ['Whole Bean', 'Espresso Grind', 'Pour Over / Drip', 'French Press / Coarse', 'AeroPress']
    },
    isFeatured: true,
    isBestSeller: true,
    brewTime: '3-4 mins Pour Over'
  },
  {
    id: 'prod-2',
    name: 'Artisan Golden Crema Espresso',
    tagline: 'Signature Roastery Blend • Dark Cocoa & Hazelnut Crema',
    description: 'Our award-winning flagship espresso blend. A harmonious triad of volcanic Guatemalan Antigua and Brazilian Cerrado beans roasted for thick, velvety caramel crema and lingering chocolate finish.',
    price: 4.75,
    category: 'Espresso',
    stock: 99,
    rating: 5.0,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Espresso Roast',
    flavorNotes: ['Dark Chocolate', 'Toasted Hazelnut', 'Caramel Crema'],
    origin: 'Blend: Guatemala & Brazil',
    ingredients: ['Freshly pulled double shot 100% Arabica espresso'],
    nutrition: { calories: 5, caffeineMg: 150, fatG: 0.1, carbsG: 0.5, sugarG: 0, proteinG: 0.4 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: 'Single Shot (1.5 oz)' },
        { name: 'Medium', priceOffset: 1.00, volume: 'Double Shot (2.5 oz)' },
        { name: 'Large', priceOffset: 2.00, volume: 'Quad Ristretto (3.5 oz)' }
      ],
      sugarLevels: ['No Sugar', '25% Sugar', '50% Sugar', 'Brown Demerara'],
      extraToppings: [
        { name: 'Dollop of Microfoam', price: 0.50 },
        { name: 'Vanilla Bean Mist', price: 0.75 },
        { name: 'Cacao Nibs Dusting', price: 0.50 }
      ]
    },
    isFeatured: true,
    isBestSeller: true,
    brewTime: '28 seconds extraction'
  },
  {
    id: 'prod-3',
    name: 'Roasted Hazelnut Praline Latte',
    tagline: 'Silky Steamed Microfoam • Housemade Praline Sauce',
    description: 'Silky textured oat or dairy milk infused with our house-crafted caramelized hazelnut paste, poured tenderly over a double shot of Velvet Reserve Espresso with delicate swan latte art.',
    price: 6.25,
    originalPrice: 7.00,
    category: 'Latte',
    stock: 80,
    rating: 4.8,
    reviewCount: 76,
    images: [
      'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Medium Roast',
    flavorNotes: ['Roasted Hazelnut', 'Vanilla Bean', 'Caramelized Praline'],
    ingredients: ['Double Espresso', 'Steamed Artisan Milk', 'Raw Sugar Praline Essence'],
    nutrition: { calories: 210, caffeineMg: 135, fatG: 7, carbsG: 22, sugarG: 17, proteinG: 8 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '8 oz Cup' },
        { name: 'Medium', priceOffset: 0.75, volume: '12 oz Cup' },
        { name: 'Large', priceOffset: 1.50, volume: '16 oz Cup' }
      ],
      milkOptions: ['Whole Milk', 'Oat Milk (Barista Edition)', 'Almond Milk', 'Coconut Milk', 'Skim Milk'],
      sugarLevels: ['Sugar Free', 'Half Sweet (50%)', 'Standard Sweet', 'Extra Sweet'],
      extraToppings: [
        { name: 'Crushed Caramelized Hazelnuts', price: 0.75 },
        { name: 'Whipped Madagascar Cream', price: 0.85 },
        { name: 'Salted Caramel Drizzle', price: 0.60 }
      ]
    },
    isFeatured: true,
    isSeasonal: true
  },
  {
    id: 'prod-4',
    name: 'Smoked Vanilla Caramel Cappuccino',
    tagline: 'Equal Parts Espresso, Milk & Cloud-Dense Foam',
    description: 'The golden ratio of equal thirds: intense ristretto, warm velvety milk, and an ethereal crown of dense foam dusted with single-origin Madagascan vanilla and cinnamon bark.',
    price: 5.75,
    category: 'Cappuccino',
    stock: 65,
    rating: 4.9,
    reviewCount: 64,
    images: [
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Dark Roast',
    flavorNotes: ['Smoked Vanilla', 'Cinnamon Bark', 'Butterscotch'],
    ingredients: ['Double Ristretto', 'Aerated Steamed Milk', 'Vanilla Bean Dust'],
    nutrition: { calories: 140, caffeineMg: 140, fatG: 5, carbsG: 12, sugarG: 9, proteinG: 7 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '6 oz Traditional' },
        { name: 'Medium', priceOffset: 0.65, volume: '10 oz' },
        { name: 'Large', priceOffset: 1.25, volume: '14 oz' }
      ],
      milkOptions: ['Whole Milk', 'Oat Milk', 'Almond Milk', 'Soy Milk'],
      sugarLevels: ['Unsweetened', 'Light Sweet', 'Regular Sweet'],
      extraToppings: [
        { name: 'Extra Cinnamon Dusting', price: 0.30 },
        { name: 'Nutmeg Infusion', price: 0.40 },
        { name: 'Caramel Cloud Foam', price: 0.90 }
      ]
    },
    isBestSeller: true
  },
  {
    id: 'prod-5',
    name: '24-Hour Nitro Cold Brew',
    tagline: 'Slow-Dripped Cold Extraction • Guinness-Like Cascading Head',
    description: 'Steeped cold for a full 24 hours with pure mountain spring water, then pressurized with micro-nitrogen bubbles. Delivers an ultra-creamy draft pour with natural sweetness and zero acidity.',
    price: 5.95,
    category: 'Cold Coffee',
    stock: 45,
    rating: 4.9,
    reviewCount: 93,
    images: [
      'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Medium Roast',
    flavorNotes: ['Dark Chocolate Molasses', 'Black Cherry', 'Malt'],
    origin: 'Colombia Huila Valley',
    ingredients: ['Cold-steeped Arabica coffee', 'Filtered spring water', 'Food-grade Nitrogen'],
    nutrition: { calories: 5, caffeineMg: 210, fatG: 0, carbsG: 1, sugarG: 0, proteinG: 0.5 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '12 oz Draft' },
        { name: 'Medium', priceOffset: 1.00, volume: '16 oz Pint' },
        { name: 'Large', priceOffset: 2.00, volume: '24 oz Big Sip' }
      ],
      extraToppings: [
        { name: 'Sweet Cream Cold Foam', price: 1.00 },
        { name: 'Salted Brown Sugar Foam', price: 1.25 },
        { name: 'Espresso Float Shot', price: 1.50 }
      ]
    },
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-6',
    name: 'Belgian Dark Chocolate Truffle Mocha',
    tagline: '72% Single-Origin Cocoa • Whipped Sea Salt Crema',
    description: 'Melted Belgian 72% dark chocolate ganache blended smoothly with espresso and velvety microfoam, topped with house-whipped cream and shaved bittersweet chocolate curls.',
    price: 6.50,
    category: 'Mocha',
    stock: 50,
    rating: 4.8,
    reviewCount: 58,
    images: [
      'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Dark Roast',
    flavorNotes: ['Belgian Cocoa', 'Madagascar Vanilla', 'Roasted Almond'],
    ingredients: ['Espresso', '72% Dark Chocolate Ganache', 'Steamed Milk', 'Fresh Whipped Cream'],
    nutrition: { calories: 340, caffeineMg: 125, fatG: 14, carbsG: 44, sugarG: 32, proteinG: 9 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '8 oz Cup' },
        { name: 'Medium', priceOffset: 0.85, volume: '12 oz Cup' },
        { name: 'Large', priceOffset: 1.65, volume: '16 oz Cup' }
      ],
      milkOptions: ['Whole Milk', 'Oat Milk', 'Almond Milk'],
      sugarLevels: ['Standard Ganache', 'Extra Dark (Less Sweet)', 'Sweet Indulgence'],
      extraToppings: [
        { name: 'Gold Dust Chocolate Shavings', price: 0.90 },
        { name: 'Marshmallow Cloud Float', price: 0.75 },
        { name: 'Espresso Shot Boost', price: 1.00 }
      ]
    },
    isSeasonal: true
  },
  {
    id: 'prod-7',
    name: 'Ceremonial Grade Uji Matcha Latte',
    tagline: 'First-Harvest Kyoto Stone-Ground Green Tea',
    description: 'Authentic stone-ground tea leaves hand-whisked with bamboo chasen into a vibrant emerald froth, balanced with silky vanilla oat milk for sustained calm energy.',
    price: 6.20,
    category: 'Tea',
    stock: 40,
    rating: 4.9,
    reviewCount: 82,
    images: [
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=1000&q=80'
    ],
    flavorNotes: ['Umami Grass', 'Sweet Cream', 'Pistachio'],
    origin: 'Uji, Kyoto Prefecture, Japan',
    ingredients: ['Ceremonial Uji Matcha', 'Filtered Water', 'Steamed Oat Milk', 'Touch of Agave'],
    nutrition: { calories: 150, caffeineMg: 70, fatG: 4, carbsG: 18, sugarG: 11, proteinG: 5 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '8 oz' },
        { name: 'Medium', priceOffset: 0.80, volume: '12 oz' },
        { name: 'Large', priceOffset: 1.50, volume: '16 oz' }
      ],
      milkOptions: ['Oat Milk (Recommended)', 'Almond Milk', 'Whole Milk', 'Coconut Milk'],
      sugarLevels: ['Unsweetened (Pure Umami)', 'Light Agave (25%)', 'Regular Sweet']
    },
    isNewArrival: true
  },
  {
    id: 'prod-8',
    name: 'French Butter Croissant & Espresso Marmalade',
    tagline: 'Laminated 81 Layers • Normandy Butter',
    description: 'Baked fresh every morning in our roastery bakery. Crisp, shatteringly flaky exterior opening into a honeycombed cloud of cultured French butter, served with house espresso berry marmalade.',
    price: 4.50,
    category: 'Snacks',
    stock: 35,
    rating: 4.7,
    reviewCount: 41,
    images: [
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80'
    ],
    flavorNotes: ['Cultured Butter', 'Toasted Wheat', 'Espresso Glaze'],
    ingredients: ['Flour', 'Normandy AOP Butter', 'Yeast', 'Sea Salt', 'Coffee Glaze'],
    nutrition: { calories: 280, caffeineMg: 0, fatG: 16, carbsG: 31, sugarG: 5, proteinG: 6 },
    variants: {
      sizes: [{ name: 'Small', priceOffset: 0, volume: '1 Piece' }],
      extraToppings: [
        { name: 'Warm Chocolate Drizzle', price: 0.75 },
        { name: 'Whipped Honey Butter Side', price: 0.50 }
      ]
    },
    isBestSeller: true
  },
  {
    id: 'prod-9',
    name: 'Tiramisu Della Nonna with Espresso Mist',
    tagline: 'Savoiardi Ladyfingers • Aged Mascarpone Cream',
    description: 'Traditional Italian recipe dipped in fresh Velvet Reserve espresso, layered with whipped egg yolk and aged mascarpone, generously blanketed with raw Dutch cocoa powder.',
    price: 7.50,
    category: 'Desserts',
    stock: 22,
    rating: 4.9,
    reviewCount: 65,
    images: [
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1586040140378-b5634cb4c8fc?auto=format&fit=crop&w=1000&q=80'
    ],
    flavorNotes: ['Espresso', 'Mascarpone', 'Dutch Cocoa', 'Marsala Wine'],
    ingredients: ['Mascarpone Cheese', 'Ladyfinger Biscuits', 'Double Espresso', 'Cocoa Powder', 'Eggs', 'Sugar'],
    nutrition: { calories: 380, caffeineMg: 60, fatG: 22, carbsG: 39, sugarG: 26, proteinG: 7 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: 'Single Serving Jar' },
        { name: 'Large', priceOffset: 12.00, volume: '4-Person Sharing Dish' }
      ]
    },
    isFeatured: true
  },
  {
    id: 'prod-10',
    name: 'Precision Barista Goose-Neck Kettle',
    tagline: 'Variable Digital Temp • 0.8L Matte Obsidian Finish',
    description: 'Engineered for competitive baristas. Features 1-degree precision temperature dial, built-in brew stopwatch, counterbalanced ergonomic handle, and slow-pour counter spout.',
    price: 89.00,
    originalPrice: 110.00,
    category: 'Coffee Accessories',
    stock: 18,
    rating: 4.9,
    reviewCount: 39,
    images: [
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80'
    ],
    flavorNotes: ['304 Stainless Steel', 'Matte Heat Shield Coating', 'LCD Display'],
    ingredients: ['Food-grade 304 Stainless Steel', 'Silicone Seal', 'LCD Controller'],
    nutrition: { calories: 0, caffeineMg: 0, fatG: 0, carbsG: 0, sugarG: 0, proteinG: 0 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '0.8 Liter' },
        { name: 'Large', priceOffset: 20.00, volume: '1.2 Liter Pro' }
      ]
    },
    isFeatured: true
  },
  {
    id: 'prod-11',
    name: 'Sumatra Mandheling Dark Roast Beans',
    tagline: 'Wet-Hulled Process • Earthy Cedar, Tobacco & Molasses',
    description: 'Grown on the rich volcanic soil of Mount Leuser in northern Sumatra. Bold, heavy-bodied with deep notes of cedar spice, sweet tobacco leaf, and unsweetened baker’s chocolate.',
    price: 21.00,
    category: 'Coffee Beans',
    stock: 45,
    rating: 4.8,
    reviewCount: 52,
    images: [
      'https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Dark Roast',
    flavorNotes: ['Cedar Spice', 'Molasses', 'Baker Chocolate', 'Herbal'],
    origin: 'Lintong, Sumatra, Indonesia',
    ingredients: ['100% Specialty Arabica Coffee Beans'],
    nutrition: { calories: 2, caffeineMg: 130, fatG: 0, carbsG: 0, sugarG: 0, proteinG: 0 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '250g' },
        { name: 'Medium', priceOffset: 14.00, volume: '500g' },
        { name: 'Large', priceOffset: 29.00, volume: '1000g' }
      ],
      grindOptions: ['Whole Bean', 'French Press / Coarse', 'Moka Pot', 'Espresso Grind']
    },
    isSeasonal: true
  },
  {
    id: 'prod-12',
    name: 'Classic Americano with Crema Float',
    tagline: 'Double Ristretto over 92°C Filtered Hot Water',
    description: 'Pure, uncomplicated and deeply aromatic. Two shots of freshly extracted Velvet Reserve espresso floated on top of purified hot water to preserve the fragile golden crema.',
    price: 4.25,
    category: 'Hot Coffee',
    stock: 120,
    rating: 4.7,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=80'
    ],
    roastLevel: 'Medium Roast',
    flavorNotes: ['Clean Acidity', 'Roasted Almond', 'Milk Chocolate'],
    ingredients: ['Purified Hot Spring Water', 'Double Shot Arabica Espresso'],
    nutrition: { calories: 5, caffeineMg: 150, fatG: 0, carbsG: 1, sugarG: 0, proteinG: 0 },
    variants: {
      sizes: [
        { name: 'Small', priceOffset: 0, volume: '8 oz' },
        { name: 'Medium', priceOffset: 0.50, volume: '12 oz' },
        { name: 'Large', priceOffset: 1.00, volume: '16 oz' }
      ],
      sugarLevels: ['None', 'One Raw Sugar', 'Two Raw Sugars']
    },
    isBestSeller: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-c1',
    userName: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-08-20',
    comment: 'The Ethiopian Geisha is phenomenal. The floral jasmine aroma when doing the bloom on my Chemex is unlike anything from commercial roasters. You can taste the high elevation care!',
    verifiedPurchase: true,
    adminReply: 'Thank you Elena! Gesha Village lot 26 is truly one of our proudest direct trade imports of this season.',
    status: 'approved'
  },
  {
    id: 'rev-2',
    userId: 'user-c2',
    userName: 'Marcus Chen',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-08-24',
    comment: 'The Hazelnut Praline Latte with Oat Milk is my daily ritual now. Perfect sweetness balance and the praline crunch on top is divine. Fast delivery to downtown too!',
    verifiedPurchase: true,
    status: 'approved'
  },
  {
    id: 'rev-3',
    userId: 'user-c3',
    userName: 'Sophia Montgomery',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2026-09-02',
    comment: 'Ordered the precision kettle and a bag of Sumatra beans. The packaging was eco-friendly and arrived in 48 hours. The kettle pours with surgical control.',
    verifiedPurchase: true,
    status: 'approved'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'VELVET20',
    discountPercentage: 20,
    maxDiscount: 25,
    minSpend: 20,
    expiryDate: '2026-12-31',
    isActive: true,
    usageCount: 142,
    description: '20% off all orders over $20 for coffee lovers'
  },
  {
    id: 'coup-2',
    code: 'BARISTA10',
    discountPercentage: 10,
    maxDiscount: 15,
    minSpend: 15,
    expiryDate: '2026-11-30',
    isActive: true,
    usageCount: 89,
    description: '10% instant off on whole bean roasts & brew gear'
  },
  {
    id: 'coup-3',
    code: 'WELCOME50',
    discountPercentage: 15,
    maxDiscount: 20,
    minSpend: 30,
    expiryDate: '2026-10-15',
    isActive: true,
    usageCount: 310,
    description: 'New customer welcome treat: 15% discount on your first order'
  }
];

export const INITIAL_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr-1',
    name: 'Julian Vance',
    phone: '+1 (555) 234-8901',
    street: '742 Evergreen Terrace',
    apartment: 'Suite 4B',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'United States',
    isDefault: true,
    type: 'home'
  },
  {
    id: 'addr-2',
    name: 'Julian Vance (Design Studio)',
    phone: '+1 (555) 234-8902',
    street: '120 Pike Street',
    apartment: 'Floor 3',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98104',
    country: 'United States',
    isDefault: false,
    type: 'work'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9842',
    userId: 'user-demo-customer',
    customerName: 'Julian Vance',
    customerEmail: 'julian.vance@example.com',
    customerPhone: '+1 (555) 234-8901',
    items: [
      {
        productId: 'prod-1',
        name: 'Velvet Reserve Ethiopian Geisha',
        quantity: 1,
        price: 24.50,
        size: '250g (8.8 oz)',
        optionsSummary: 'Whole Bean • Light Roast',
        image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-3',
        name: 'Roasted Hazelnut Praline Latte',
        quantity: 2,
        price: 6.25,
        size: '12 oz Cup',
        optionsSummary: 'Oat Milk • Half Sweet • Crushed Hazelnuts',
        image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=300&q=80'
      }
    ],
    shippingAddress: INITIAL_ADDRESSES[0],
    shippingMethod: 'express',
    shippingCost: 4.99,
    subtotal: 37.00,
    tax: 2.96,
    discount: 7.40,
    couponCode: 'VELVET20',
    total: 37.55,
    paymentMethod: 'stripe',
    paymentStatus: 'paid',
    orderStatus: 'roasting',
    createdAt: '2026-09-12T14:22:00Z',
    estimatedDelivery: '2026-09-15T18:00:00Z',
    trackingNumber: 'VR-8492048-US',
    notes: 'Please leave in package locker with doorman.'
  },
  {
    id: 'ORD-9751',
    userId: 'user-demo-customer',
    customerName: 'Julian Vance',
    customerEmail: 'julian.vance@example.com',
    customerPhone: '+1 (555) 234-8901',
    items: [
      {
        productId: 'prod-2',
        name: 'Artisan Golden Crema Espresso',
        quantity: 1,
        price: 4.75,
        size: 'Double Shot (2.5 oz)',
        optionsSummary: 'No Sugar • Cacao Nibs Dusting',
        image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=300&q=80'
      },
      {
        productId: 'prod-8',
        name: 'French Butter Croissant & Espresso Marmalade',
        quantity: 2,
        price: 4.50,
        size: '1 Piece',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80'
      }
    ],
    shippingAddress: INITIAL_ADDRESSES[0],
    shippingMethod: 'standard',
    shippingCost: 0,
    subtotal: 13.75,
    tax: 1.10,
    discount: 0,
    total: 14.85,
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
    orderStatus: 'delivered',
    createdAt: '2026-09-04T09:15:00Z',
    estimatedDelivery: '2026-09-07T14:30:00Z',
    trackingNumber: 'VR-7102941-US'
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Golden Extraction: Mastering Water Temperature for Pour-Over',
    excerpt: 'Why 92°C to 96°C unlocks nuanced floral aromatics while avoiding harsh tannin over-extraction.',
    content: 'Brewing specialty coffee is an exact science as much as an art. The volatile floral esters in light roasts like our Ethiopian Geisha demand precise thermal kinetic energy...',
    author: 'Mateo Morales, Master Roaster',
    date: 'September 8, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    category: 'Brewing Guides'
  },
  {
    id: 'blog-2',
    title: 'From Cherry to Cup: Sustainable Direct Trade in Gesha Village',
    excerpt: 'How shade-grown agroforestry preserves native bird habitats and creates the worlds most coveted coffees.',
    content: 'High in the mist-veiled forests of southwest Ethiopia, indigenous heirloom coffee trees flourish under dense canopies of indigenous acacia and ficus trees...',
    author: 'Clara Lindqvist, Green Bean Buyer',
    date: 'August 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80',
    category: 'Roastery Journal'
  },
  {
    id: 'blog-3',
    title: 'Microfoam Physics: The Chemistry Behind Glossy Latte Art',
    excerpt: 'Transforming cold milk proteins into silky microbubbles that glide effortlessly atop dark crema.',
    content: 'When steaming milk, you are simultaneously denaturing whey proteins and creating micro-vesicles of air suspended in a stable lipid matrix...',
    author: 'Kenji Sato, Head Barista',
    date: 'August 14, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=800&q=80',
    category: 'Barista Craft'
  }
];
