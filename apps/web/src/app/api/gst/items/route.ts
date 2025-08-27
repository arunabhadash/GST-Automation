import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  const items = await prisma.creditNote.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });

  const mapped = items.map((cn) => ({
    id: cn.id,
    customerName: cn.order.customerName,
    originalInvoiceDate: cn.order.originalInvoiceDate.toISOString().slice(0, 10),
    rtoDate: cn.order.rtoDate ? cn.order.rtoDate.toISOString().slice(0, 10) : null,
    products: cn.order.products,
    orderValue: Number(cn.order.orderValue),
    gstToReclaim: Number(cn.amount),
    status: cn.status === "COMPLETED" ? "Completed" : cn.status === "IN_PROCESS" ? "In Process" : "Pending",
  }));

  return Response.json(mapped);
}

const SyncBody = z.object({ itemIds: z.array(z.string()).min(1) });

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = SyncBody.safeParse(body);
  if (!parsed.success) return new Response("Invalid body", { status: 400 });

  const { itemIds } = parsed.data;
  try {
    await prisma.creditNote.updateMany({
      where: { id: { in: itemIds } },
      data: { status: "COMPLETED" },
    });
  } catch (e) {
    logger.error({ e }, "Failed to update credit notes");
    return new Response("Failed to update", { status: 500 });
  }
  return Response.json({ success: true });
}

