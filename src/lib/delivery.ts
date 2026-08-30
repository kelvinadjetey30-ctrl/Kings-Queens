/**
 * Delivery pricing by Ghana region (Jumia-style zones from Accra hub).
 * Near = cheaper · Far = higher · Free above threshold.
 */

export type DeliveryZone = 'accra' | 'near' | 'mid' | 'far';

export const DELIVERY = {
  freeThreshold: 600,
  /** Greater Accra — same-city / metro */
  accra: { fee: 25, eta: '1–2 business days', label: 'Greater Accra' },
  /** Nearby regions */
  near: { fee: 35, eta: '2–4 business days', label: 'Nearby region' },
  /** Mid distance */
  mid: { fee: 45, eta: '3–5 business days', label: 'Mid region' },
  /** Far north / upper regions */
  far: { fee: 55, eta: '4–7 business days', label: 'Far region' },
} as const;

const ZONE_BY_REGION: Record<string, DeliveryZone> = {
  'Greater Accra': 'accra',
  Eastern: 'near',
  Central: 'near',
  Volta: 'near',
  Ashanti: 'mid',
  Western: 'mid',
  Bono: 'mid',
  'Bono East': 'mid',
  Ahafo: 'mid',
  'Western North': 'mid',
  Oti: 'mid',
  Northern: 'far',
  'Upper East': 'far',
  'Upper West': 'far',
  Savannah: 'far',
  'North East': 'far',
};

export function getDeliveryZone(region: string): DeliveryZone {
  return ZONE_BY_REGION[region] || 'mid';
}

export function getDeliveryQuote(region: string, subtotal: number) {
  const zone = getDeliveryZone(region);
  const tier = DELIVERY[zone];
  const free = subtotal >= DELIVERY.freeThreshold;
  const fee = free ? 0 : tier.fee;
  return {
    zone,
    fee,
    free,
    eta: tier.eta,
    label: tier.label,
    freeThreshold: DELIVERY.freeThreshold,
  };
}

/** For cart: show lowest fee (Accra) as “from” */
export function deliveryFromFee() {
  return DELIVERY.accra.fee;
}
