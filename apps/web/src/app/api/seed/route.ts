import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { hash } from "bcryptjs";

export async function POST(_req: NextRequest) {
  // Create a default user
  const email = "demo@d2c.local";
  const password = await hash("password", 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Demo User", hashedPassword: password },
  });

  // Seed a few orders and credit notes
  const orders = await prisma.$transaction(
    Array.from({ length: 8 }).map((_, i) =>
      prisma.order.create({
        data: {
          id: `DS-${1050 - i}`,
          userId: user.id,
          source: i % 2 === 0 ? "SHOPIFY" : "WOOCOMMERCE",
          customerName: ["Ravi Kumar","Sunita Sharma","Amit Singh","Priya Patel"][i % 4],
          products: ["T-Shirt","Hoodie","Sneakers","Jeans"][i % 4],
          orderValue: (1200 + i * 250).toFixed(2),
          taxAmount: (1200 * 0.18).toFixed(2),
          status: i % 3 === 0 ? "RTO_DELIVERED" : "DELIVERED",
          originalInvoiceDate: new Date(Date.now() - (i + 10) * 86400000),
          rtoDate: i % 3 === 0 ? new Date(Date.now() - (i + 5) * 86400000) : null,
          shippingFee: (100 + i * 10).toFixed(2),
          rtoCost: i % 3 === 0 ? (150 + i * 15).toFixed(2) : "0.00",
        },
      })
    )
  );

  // Create credit notes for RTO-delivered orders
  await prisma.$transaction(
    orders
      .filter((o) => o.status === "RTO_DELIVERED")
      .map((o) =>
        prisma.creditNote.upsert({
          where: { id: `CN-${o.id}` },
          update: {},
          create: {
            id: `CN-${o.id}`,
            orderId: o.id,
            amount: (Number(o.orderValue) * 0.18).toFixed(2),
            status: "PENDING",
          },
        })
      )
  );

  return Response.json({ ok: true });
}

