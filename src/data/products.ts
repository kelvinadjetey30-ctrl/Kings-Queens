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

/** Empty by default — admin lists products so buyers see only what you upload */
export const SEED_PRODUCTS: Product[] = [];
