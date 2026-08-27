export type OrderStatus = 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  variantName?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  customer: {
    name: string;
    phone: string;
    email?: string;
    region: string;
    city: string;
    address: string;
  };
  payment: {
    method: 'momo';
    momoName: string;
    momoNumber: string;
    txId?: string;
  };
  timeline: { at: string; status: OrderStatus; note?: string }[];
  userId?: string;
};

const KEY = 'kq_orders';

export function loadOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(KEY, JSON.stringify(orders));
}

export function addOrder(order: Order) {
  const orders = loadOrders();
  orders.unshift(order);
  saveOrders(orders);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return loadOrders().find((o) => o.id === id);
}

export function updateOrderStatus(id: string, status: OrderStatus, note?: string) {
  const orders = loadOrders();
  const idx = orders.findIndex((o) => o.id === id);
  if (idx < 0) return null;
  orders[idx].status = status;
  orders[idx].timeline.push({ at: new Date().toISOString(), status, note });
  if (status === 'paid' && !orders[idx].payment.txId && note) {
    orders[idx].payment.txId = note;
  }
  saveOrders(orders);
  return orders[idx];
}

export function getOrdersByUser(userId: string) {
  return loadOrders().filter((o) => o.userId === userId);
}

export function getAllOrders() {
  return loadOrders();
}
