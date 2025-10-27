import { Router } from 'express';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'RTO Initiated' | 'RTO Delivered';
type RtoRiskLevel = 'Low' | 'Medium' | 'High';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
  };
}

interface Shipment {
  awbNumber: string;
  logisticsProvider: 'Shiprocket' | 'Delhivery';
  status: OrderStatus;
  chargedWeightKg: number;
}

interface Order {
  id: string;
  source: 'Shopify' | 'WooCommerce';
  customer: CustomerDetails;
  orderValue: number;
  taxAmount: number;
  status: OrderStatus;
  shipment: Shipment;
  profitability: number;
  rtoRisk: RtoRiskLevel;
  createdAt: string;
  productCost: number;
  shippingFee: number;
  rtoCost: number;
}

const router = Router();

const STATUSES: OrderStatus[] = ['Pending','Processing','Shipped','Delivered','Cancelled','RTO Initiated','RTO Delivered'];
const RISK_LEVELS: RtoRiskLevel[] = ['Low','Medium','High'];

const NAMES = ['Ravi Kumar', 'Sunita Sharma', 'Amit Singh', 'Priya Patel', 'Vijay Gupta', 'Anjali Devi', 'Sanjay Verma'];
const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];

const TOTAL_ORDERS = 250;
const ordersData: Order[] = Array.from({ length: TOTAL_ORDERS }, (_, i) => {
  const index = TOTAL_ORDERS - i; // Start from DS-1050-like numbering going down
  const orderValue = 1000 + Math.random() * 4000;
  const productCost = orderValue * (0.4 + Math.random() * 0.2);
  const shippingFee = 80 + Math.random() * 40;
  const taxAmount = orderValue * 0.18;
  const isRto = Math.random() < 0.2;
  const rtoCost = isRto ? (shippingFee * 1.5) : 0;
  const profitability = orderValue - productCost - shippingFee - taxAmount - rtoCost;
  const status = isRto ? (Math.random() > 0.5 ? 'RTO Initiated' as const : 'RTO Delivered' as const) : STATUSES[Math.floor(Math.random() * 5)];
  const shipmentStatus = status;

  return {
    id: `DS-${1050 - i}`,
    source: Math.random() > 0.5 ? 'Shopify' : 'WooCommerce',
    customer: {
      name: NAMES[i % NAMES.length],
      email: `customer${i}@example.com`,
      phone: '9876543210',
      address: {
        street: `${123 + i} Main St`,
        city: CITIES[i % CITIES.length],
        state: 'State',
        pinCode: `${100001 + i}`,
      },
    },
    orderValue,
    taxAmount,
    status,
    shipment: {
      awbNumber: `AWB${987654321 - i}`,
      logisticsProvider: Math.random() > 0.5 ? 'Shiprocket' : 'Delhivery',
      status: shipmentStatus,
      chargedWeightKg: 0.5 + Math.random(),
    },
    profitability,
    rtoRisk: RISK_LEVELS[Math.floor(Math.random() * RISK_LEVELS.length)],
    createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    productCost,
    shippingFee,
    rtoCost,
  };
});

router.get('/', (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedOrders = ordersData.slice(start, end);
  res.json({ orders: paginatedOrders, total: ordersData.length });
});

router.get('/:id', (req, res) => {
  const order = ordersData.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }
  res.json(order);
});

router.post('/:id/flag-rto', (req, res) => {
  // Simulate flagging an order; in a real app, persist this change
  const order = ordersData.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found.' });
  }
  res.json({ success: true, message: `Order ${order.id} flagged for RTO review.` });
});

export default router;
