import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const items = [
  { id: 'gst1', customerName: 'Rohan Sharma', originalInvoiceDate: '2024-04-28', rtoDate: '2024-05-02', products: 'T-Shirt, Cap', orderValue: 1299, gstToReclaim: 233.82, status: 'Pending' },
  { id: 'gst2', customerName: 'Priya Gupta', originalInvoiceDate: '2024-04-30', rtoDate: '2024-05-05', products: 'Hoodie', orderValue: 1999, gstToReclaim: 359.82, status: 'Pending' },
  { id: 'gst3', customerName: 'Amit Patel', originalInvoiceDate: '2024-05-01', rtoDate: '2024-05-06', products: 'Sneakers', orderValue: 2499, gstToReclaim: 449.82, status: 'Pending' },
  { id: 'gst4', customerName: 'Sneha Singh', originalInvoiceDate: '2024-03-25', rtoDate: '2024-04-02', products: 'Jeans', orderValue: 2199, gstToReclaim: 395.82, status: 'Completed' },
  { id: 'gst5', customerName: 'Vikram Kumar', originalInvoiceDate: '2024-03-28', rtoDate: '2024-04-04', products: 'Watch', orderValue: 3499, gstToReclaim: 629.82, status: 'Completed' },
];

export async function GET() {
  return NextResponse.json(items);
}

const syncBody = z.object({ ids: z.array(z.string()) });

export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null);
  const parsed = syncBody.safeParse(json);
  if (!parsed.success) return NextResponse.json({ message: 'Bad Request' }, { status: 400 });
  return NextResponse.json({ success: true, updatedIds: parsed.data.ids });
}

