import type { ReactNode } from 'react';

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RTO_INITIATED = 'RTO Initiated',
  RTO_DELIVERED = 'RTO Delivered',
}

export enum RtoRiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}

// --- Dashboard Types ---
export interface KpiData {
  revenue: number;
  rtoRate: number;
  pendingGst: number;
}

export interface SalesDataPoint {
  name: string;
  Sales: number;
  RTOs: number;
}

export interface ActionItem {
  id: string;
  description: string;
  type: 'Credit Note' | 'Authentication';
}

export interface RtoHotspot {
  location: string;
  rate: number;
}

export interface SyncActivity {
  id: string;
  description: string;
  timestamp: string;
}

// --- GST Automation Hub Types ---
export interface GstActionItem {
    id: string;
    customerName: string;
    originalInvoiceDate: string;
    rtoDate: string;
    products: string;
    orderValue: number;
    gstToReclaim: number;
    status: 'Pending' | 'In Process' | 'Completed';
}

// --- Integrations Types ---
export interface Integration {
  id: string;
  name: string;
  logo: ReactNode;
  status: 'Connected' | 'Needs Re-authentication' | 'Not Connected';
  type: 'E-commerce' | 'Logistics';
}


// --- Original detailed types (can be used for drill-downs) ---
export interface CustomerDetails {
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

export interface Shipment {
  awbNumber: string;
  logisticsProvider: 'Shiprocket' | 'Delhivery';
  status: OrderStatus;
  chargedWeightKg: number;
}

export interface Order {
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

// --- New Dashboard Types for unused widgets ---
export interface HistoryDataPoint {
  name: string;
  value: number;
}

export interface CourierDataPoint {
  name: string;
  value: number;
}

export interface DashboardSummary {
  monthlyNetProfit: number;
  netProfitHistory: HistoryDataPoint[];
  rtoRate: number;
  rtoByCourier: CourierDataPoint[];
}

export interface GstReturn {
    id: string;
    type: string;
    dueDate: string;
    status: 'Draft' | 'Filed' | 'Due';
}
