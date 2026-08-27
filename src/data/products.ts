export type Variant = { id: string; name: string; price: number; stock: number };

/** Main shop categories (marketplace filters) */
export type CategoryId =
  | 'chains'
  | 'watches'
  | 'bracelets'
  | 'rings'
  | 'clothes'
  | 'shoes'
  | 'caps'
  | 'bags'
  | 'accessories';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  /** Optional fine type for admin listing (e.g. Cuban Link Chain) */
  subcategory?: string;
  description: string;
  price: number;
  compareAt?: number;
  image: string;
  images: string[];
  variants?: Variant[];
  tags: string[];
  featured?: boolean;
  flash?: boolean;
};

export const CATEGORIES = [
  { id: 'all', name: 'All', slug: 'all' },
  { id: 'chains', name: 'Chains / Necklaces', slug: 'chains' },
  { id: 'watches', name: 'Watches', slug: 'watches' },
  { id: 'bracelets', name: 'Bracelets', slug: 'bracelets' },
  { id: 'rings', name: 'Rings', slug: 'rings' },
  { id: 'clothes', name: 'Clothes', slug: 'clothes' },
  { id: 'shoes', name: 'Shoes / Footwear', slug: 'shoes' },
  { id: 'caps', name: 'Caps / Headwear', slug: 'caps' },
  { id: 'bags', name: 'Bags / Wallets', slug: 'bags' },
  { id: 'accessories', name: 'Eyewear / Belts / Others', slug: 'accessories' },
] as const;

export const CATEGORY_OPTIONS: { id: CategoryId; name: string }[] = [
  { id: 'chains', name: 'Chains / Necklaces' },
  { id: 'watches', name: 'Watches' },
  { id: 'bracelets', name: 'Bracelets' },
  { id: 'rings', name: 'Rings' },
  { id: 'clothes', name: 'Clothes' },
  { id: 'shoes', name: 'Shoes / Footwear' },
  { id: 'caps', name: 'Caps / Headwear' },
  { id: 'bags', name: 'Bags / Wallets' },
  { id: 'accessories', name: 'Eyewear / Belts / Others' },
];

/** Subcategories for admin product form (grouped by main category) */
export const SUBCATEGORIES: Record<CategoryId, string[]> = {
  chains: [
    'Cuban Link Chain',
    'Rope Chain',
    'Figaro Chain',
    'Tennis Chain',
    'Cross Pendant Chain',
    'Jesus Piece / Icon Chain',
    'Dog Tag Chain',
    'Beaded Chain',
    'Pearl Chain',
    'Silver Chain (925)',
    'Gold-plated Chain',
  ],
  watches: [
    'Rolex Style',
    'Patek Philippe Style',
    'Audemars Piguet Style',
    'G-Shock / Sports Watch',
    'Smart Watches',
    'Leather Strap Watches',
    'Steel Strap Watches',
    'Chronograph Watches',
    'Female Watches (For Queens)',
  ],
  bracelets: [
    'Cuban Link Bracelet',
    'Tennis Bracelet',
    'Beaded Bracelet',
    'Leather Bracelet',
    'Rope Bracelet',
    'Magnetic Bracelet',
  ],
  rings: [
    'Signet Rings',
    'Cuban Rings',
    'Cross Rings',
    'Knuckle Rings',
    'Silver Rings',
    'Gold Rings',
  ],
  clothes: [
    'Plain T-Shirts',
    'Oversized T-Shirts',
    'Designer Tees',
    'Polo Shirts',
    'Shirts / Button Shirts',
    'Hoodies',
    'Sweatshirts',
    'Jeans / Trousers',
    'Shorts / Nicker',
    'Jackets',
    'Two-Piece Sets',
    'Boxers / Innerwear',
  ],
  shoes: [
    'Sneakers / Trainers',
    'Slides',
    'Palm Slippers / GB Slippers',
    'Birkenstock / Boston',
    'Crocs / Clogs',
    'Leather Slippers',
    'Loafers',
    'Boots / Timberland Style',
    'Sandals',
  ],
  caps: [
    'Face Caps / Baseball Caps',
    'Snapbacks',
    'Beanies',
    'Bucket Hats',
    'Durags',
    'Designer Caps',
  ],
  bags: [
    'Crossbody Bags',
    'Side Bags / Sling Bags',
    'Backpacks',
    'Wallets',
    'Hand Purses (For Queens)',
  ],
  accessories: [
    'Sunglasses / Shades',
    'Eyeglasses (Fashion)',
    'Belts (Leather, Designer)',
    'Socks',
    'Key Holders / Chains',
  ],
};

/** Seed catalog — admin can change freely after load */
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'royal-gold-cuban-chain',
    name: 'Royal Gold Cuban Chain',
    category: 'chains',
    subcategory: 'Cuban Link Chain',
    description: 'Heavy 18K gold-plated Cuban link. Premium weight, anti-tarnish. Fit for kings.',
    price: 280,
    compareAt: 350,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80'],
    variants: [
      { id: '18', name: '18 inch', price: 280, stock: 12 },
      { id: '20', name: '20 inch', price: 320, stock: 8 },
      { id: '22', name: '22 inch', price: 360, stock: 5 },
    ],
    tags: ['gold', 'cuban'],
    featured: true,
    flash: true,
  },
  {
    id: 'p2',
    slug: 'diamond-cut-tennis-chain',
    name: 'Diamond-Cut Tennis Chain',
    category: 'chains',
    subcategory: 'Tennis Chain',
    description: 'Iced-out tennis links. Maximum shine under any light.',
    price: 420,
    compareAt: 520,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
    tags: ['ice', 'tennis'],
    featured: true,
  },
  {
    id: 'p3',
    slug: 'luxury-chronograph-watch',
    name: 'Luxury Chronograph Watch',
    category: 'watches',
    subcategory: 'Chronograph Watches',
    description: 'Stainless steel chronograph with gold accents. Water resistant.',
    price: 580,
    compareAt: 750,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    tags: ['watch'],
    featured: true,
    flash: true,
  },
  {
    id: 'p4',
    slug: 'classic-gold-bracelet',
    name: 'Classic Gold Bracelet',
    category: 'bracelets',
    subcategory: 'Cuban Link Bracelet',
    description: 'Solid gold-plated bracelet with secure clasp.',
    price: 150,
    compareAt: 200,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'],
    tags: ['bracelet'],
    featured: true,
  },
  {
    id: 'p5',
    slug: 'premium-slides',
    name: 'Premium Slides',
    category: 'shoes',
    subcategory: 'Slides',
    description: 'Soft cushion slides with gold logo. Comfort + status.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1603808033192-082d2951a8da?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1603808033192-082d2951a8da?w=800&q=80'],
    variants: [
      { id: '40', name: 'Size 40', price: 180, stock: 10 },
      { id: '42', name: 'Size 42', price: 180, stock: 12 },
      { id: '44', name: 'Size 44', price: 180, stock: 7 },
    ],
    tags: ['slides'],
  },
  {
    id: 'p6',
    slug: 'kings-oversized-tee',
    name: 'Kings Oversized Tee',
    category: 'clothes',
    subcategory: 'Oversized T-Shirts',
    description: 'Heavyweight cotton oversized tee with embroidered crown.',
    price: 220,
    compareAt: 280,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    variants: [
      { id: 'm', name: 'M', price: 220, stock: 20 },
      { id: 'l', name: 'L', price: 220, stock: 18 },
      { id: 'xl', name: 'XL', price: 230, stock: 12 },
    ],
    tags: ['tee'],
    featured: true,
  },
  {
    id: 'p7',
    slug: 'signet-gold-ring',
    name: 'Signet Gold Ring',
    category: 'rings',
    subcategory: 'Signet Rings',
    description: 'Bold signet ring for kings. Adjustable fit options.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'],
    tags: ['ring'],
    featured: true,
  },
  {
    id: 'p8',
    slug: 'executive-leather-watch',
    name: 'Executive Leather Watch',
    category: 'watches',
    subcategory: 'Leather Strap Watches',
    description: 'Genuine leather strap, minimalist dial. Boardroom ready.',
    price: 450,
    compareAt: 550,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'],
    tags: ['leather'],
    featured: true,
  },
];
