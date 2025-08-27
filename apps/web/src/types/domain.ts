export type GstActionItem = {
  id: string;
  customerName: string;
  originalInvoiceDate: string;
  rtoDate: string | null;
  products: string;
  orderValue: number;
  gstToReclaim: number;
  status: 'Pending' | 'In Process' | 'Completed';
};

