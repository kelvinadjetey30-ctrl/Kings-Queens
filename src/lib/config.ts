export const STORE = {
  name: 'THE KINGS AND QUEENS',
  tagline: 'Drip For Kings and Queens',
  momoName: process.env.NEXT_PUBLIC_MOMO_NAME || 'The Kings and Queens Enterprise',
  momoNumber: process.env.NEXT_PUBLIC_MOMO_NUMBER || '0550000000',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '0550000000',
  email: process.env.NEXT_PUBLIC_STORE_EMAIL || 'hello@thekingsandqueens.online',
  freeDeliveryThreshold: 500,
  deliveryAccra: 40,
  deliveryOutside: 70,
  expressAccra: 70,
  adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@thekingsandqueens.com',
  adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Admin@2024',
};
export const REGIONS = ['Greater Accra','Ashanti','Western','Eastern','Central','Volta','Northern','Upper East','Upper West','Bono','Bono East','Ahafo','Western North','Oti','Savannah','North East'] as const;
