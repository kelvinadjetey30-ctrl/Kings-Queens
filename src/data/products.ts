export type Variant = { id: string; name: string; price: number; stock: number };
export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'chains' | 'watches' | 'clothes' | 'slippers' | 'bracelets';
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

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    slug: 'royal-gold-cuban-chain',
    name: 'Royal Gold Cuban Chain',
    category: 'chains',
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
    tags: ['gold', 'cuban', 'bestseller'],
    featured: true,
    flash: true,
  },
  {
    id: 'p2',
    slug: 'diamond-cut-ice-chain',
    name: 'Diamond-Cut Ice Chain',
    category: 'chains',
    description: 'Iced-out diamond-cut links. Maximum shine under any light.',
    price: 420,
    compareAt: 520,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'],
    variants: [
      { id: '20', name: '20 inch', price: 420, stock: 6 },
      { id: '24', name: '24 inch', price: 480, stock: 4 },
    ],
    tags: ['ice', 'diamond'],
    featured: true,
  },
  {
    id: 'p3',
    slug: 'luxury-chronograph-watch',
    name: 'Luxury Chronograph Watch',
    category: 'watches',
    description: 'Stainless steel chronograph with gold accents. Water resistant. Ghana drip approved.',
    price: 580,
    compareAt: 750,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'],
    tags: ['watch', 'luxury'],
    featured: true,
    flash: true,
  },
  {
    id: 'p4',
    slug: 'classic-gold-bracelet',
    name: 'Classic Gold Bracelet',
    category: 'bracelets',
    description: 'Solid gold-plated bracelet with secure clasp. Everyday royalty.',
    price: 150,
    compareAt: 200,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800&q=80'],
    variants: [
      { id: 's', name: 'Small', price: 150, stock: 15 },
      { id: 'm', name: 'Medium', price: 150, stock: 10 },
      { id: 'l', name: 'Large', price: 160, stock: 8 },
    ],
    tags: ['bracelet', 'gold'],
    featured: true,
  },
  {
    id: 'p5',
    slug: 'premium-slide-slippers',
    name: 'Premium Slide Slippers',
    category: 'slippers',
    description: 'Soft cushion slides with gold logo. Comfort + status.',
    price: 180,
    image: 'https://images.unsplash.com/photo-1603808033192-082d2951a8da?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1603808033192-082d2951a8da?w=800&q=80'],
    variants: [
      { id: '40', name: 'Size 40', price: 180, stock: 10 },
      { id: '42', name: 'Size 42', price: 180, stock: 12 },
      { id: '44', name: 'Size 44', price: 180, stock: 7 },
    ],
    tags: ['slippers', 'slides'],
  },
  {
    id: 'p6',
    slug: 'kings-oversized-tee',
    name: 'Kings Oversized Tee',
    category: 'clothes',
    description: 'Heavyweight cotton oversized tee with embroidered crown. Limited drop.',
    price: 220,
    compareAt: 280,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    variants: [
      { id: 'm', name: 'M', price: 220, stock: 20 },
      { id: 'l', name: 'L', price: 220, stock: 18 },
      { id: 'xl', name: 'XL', price: 230, stock: 12 },
    ],
    tags: ['tee', 'streetwear'],
    featured: true,
  },
  {
    id: 'p7',
    slug: 'queens-silk-scarf',
    name: 'Queens Silk Scarf',
    category: 'clothes',
    description: 'Luxury silk scarf with royal pattern. Perfect gift for queens.',
    price: 190,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80'],
    tags: ['scarf', 'silk'],
  },
  {
    id: 'p8',
    slug: 'executive-leather-watch',
    name: 'Executive Leather Watch',
    category: 'watches',
    description: 'Genuine leather strap, minimalist dial. Boardroom ready.',
    price: 450,
    compareAt: 550,
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
    images: ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80'],
    tags: ['watch', 'leather'],
    featured: true,
  },
];

export const CATEGORIES = [
  { id: 'all', name: 'All', slug: 'all' },
  { id: 'chains', name: 'Chains', slug: 'chains' },
  { id: 'watches', name: 'Watches', slug: 'watches' },
  { id: 'bracelets', name: 'Bracelets', slug: 'bracelets' },
  { id: 'clothes', name: 'Clothes', slug: 'clothes' },
  { id: 'slippers', name: 'Slippers', slug: 'slippers' },
] as const;

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeatured() {
  return PRODUCTS.filter((p) => p.featured);
}

export function getFlash() {
  return PRODUCTS.filter((p) => p.flash);
}
