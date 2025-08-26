import { KpiData, SalesDataPoint, ActionItem, RtoHotspot, SyncActivity, GstActionItem, Order, OrderStatus, RtoRiskLevel } from '../types';

// --- MOCK DATA GENERATION ---

// Dashboard Data
const mockKpiData: KpiData = {
  revenue: 482590,
  rtoRate: 18.5,
  pendingGst: 12750,
};

const mockSalesData: SalesDataPoint[] = [
  { name: '1-7 May', Sales: 95000, RTOs: 18000 },
  { name: '8-14 May', Sales: 110000, RTOs: 22000 },
  { name: '15-21 May', Sales: 125000, RTOs: 21000 },
  { name: '22-28 May', Sales: 152590, RTOs: 25000 },
];

const mockActionItems: ActionItem[] = [
  { id: '1', description: '3 Credit Notes are ready to issue for May RTOs', type: 'Credit Note' },
  { id: '2', description: 'Shiprocket integration needs re-authentication', type: 'Authentication' },
];

const mockRtoHotspots: RtoHotspot[] = [
  { location: 'New Delhi (110092)', rate: 32 },
  { location: 'Mumbai (400058)', rate: 28 },
  { location: 'Bangalore (560078)', rate: 25 },
];

const mockSyncActivity: SyncActivity[] = [
  { id: 'sa1', description: 'RTO for Order #DS-1048 synced.', timestamp: '2 minutes ago' },
  { id: 'sa2', description: 'Credit Note #CN5678 created.', timestamp: '2 minutes ago' },
  { id: 'sa3', description: 'GST return draft updated for May 2024.', timestamp: '1 minute ago' },
  { id: 'sa4', description: 'RTO for Order #DS-1045 synced.', timestamp: '1 hour ago' },
];


// GST Automation Hub Data
const mockGstItems: GstActionItem[] = [
  { id: 'gst1', customerName: 'Rohan Sharma', originalInvoiceDate: '2024-04-28', rtoDate: '2024-05-02', products: 'T-Shirt, Cap', orderValue: 1299, gstToReclaim: 233.82, status: 'Pending' },
  { id: 'gst2', customerName: 'Priya Gupta', originalInvoiceDate: '2024-04-30', rtoDate: '2024-05-05', products: 'Hoodie', orderValue: 1999, gstToReclaim: 359.82, status: 'Pending' },
  { id: 'gst3', customerName: 'Amit Patel', originalInvoiceDate: '2024-05-01', rtoDate: '2024-05-06', products: 'Sneakers', orderValue: 2499, gstToReclaim: 449.82, status: 'Pending' },
  { id: 'gst4', customerName: 'Sneha Singh', originalInvoiceDate: '2024-03-25', rtoDate: '2024-04-02', products: 'Jeans', orderValue: 2199, gstToReclaim: 395.82, status: 'Completed' },
  { id: 'gst5', customerName: 'Vikram Kumar', originalInvoiceDate: '2024-03-28', rtoDate: '2024-04-04', products: 'Watch', orderValue: 3499, gstToReclaim: 629.82, status: 'Completed' },
];

const mockRecentOrders: Order[] = Array.from({ length: 25 }, (_, i) => {
    const orderValue = 1000 + Math.random() * 4000;
    const productCost = orderValue * (0.4 + Math.random() * 0.2);
    const shippingFee = 80 + Math.random() * 40;
    const taxAmount = orderValue * 0.18;
    const isRto = Math.random() < 0.2;
    const rtoCost = isRto ? (shippingFee * 1.5) : 0;
    const profitability = orderValue - productCost - shippingFee - taxAmount - rtoCost;
    const statuses = Object.values(OrderStatus);
    const riskLevels = Object.values(RtoRiskLevel);
    
    return {
        id: `DS-${1050 - i}`,
        source: Math.random() > 0.5 ? 'Shopify' : 'WooCommerce',
        customer: {
            name: ['Ravi Kumar', 'Sunita Sharma', 'Amit Singh', 'Priya Patel', 'Vijay Gupta', 'Anjali Devi', 'Sanjay Verma'][i % 7],
            email: `customer${i}@example.com`,
            phone: '9876543210',
            address: {
                street: `${123 + i} Main St`,
                city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'][i % 5],
                state: 'State',
                pinCode: `${100001 + i}`,
            },
        },
        orderValue: orderValue,
        taxAmount: taxAmount,
        status: isRto ? (Math.random() > 0.5 ? OrderStatus.RTO_INITIATED : OrderStatus.RTO_DELIVERED) : statuses[Math.floor(Math.random() * 5)],
        shipment: {
            awbNumber: `AWB${987654321 - i}`,
            logisticsProvider: Math.random() > 0.5 ? 'Shiprocket' : 'Delhivery',
            status: isRto ? (Math.random() > 0.5 ? OrderStatus.RTO_INITIATED : OrderStatus.RTO_DELIVERED) : statuses[Math.floor(Math.random() * 5)],
            chargedWeightKg: 0.5 + Math.random(),
        },
        profitability: profitability,
        rtoRisk: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        productCost: productCost,
        shippingFee: shippingFee,
        rtoCost: rtoCost,
    };
});


// --- MOCK API FUNCTIONS ---
const mockFetch = <T>(data: T, delay: number = 300): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), delay));

export const getDashboardData = async () => {
  return Promise.all([
    mockFetch(mockKpiData, 400),
    mockFetch(mockSalesData, 600),
    mockFetch(mockActionItems, 500),
    mockFetch(mockRtoHotspots, 700),
    mockFetch(mockSyncActivity, 800),
  ]);
};

export const getGstData = async () => mockFetch(mockGstItems);

export const getRecentOrders = async (page: number, limit: number): Promise<{ orders: Order[], total: number }> => {
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedOrders = mockRecentOrders.slice(start, end);
    return mockFetch({ orders: paginatedOrders, total: mockRecentOrders.length }, 500);
};

export const syncGstItem = async (itemId: string): Promise<{ success: boolean }> => {
    console.log(`Simulating sync for GST item: ${itemId}`);
    // Simulate a network request that takes between 1 to 2 seconds
    const delay = 1000 + Math.random() * 1000;
    return mockFetch({ success: true }, delay);
};
