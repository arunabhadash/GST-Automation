import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// Create some orders
	const orders = Array.from({ length: 25 }, (_, i) => ({
		id: undefined as unknown as string,
		source: Math.random() > 0.5 ? 'Shopify' : 'WooCommerce',
		customerName: ['Ravi Kumar', 'Sunita Sharma', 'Amit Singh', 'Priya Patel', 'Vijay Gupta', 'Anjali Devi', 'Sanjay Verma'][i % 7],
		orderValue: 1000 + Math.random() * 4000,
		taxAmount: 120 + Math.random() * 500,
		status: ['Pending','Processing','Shipped','Delivered','Cancelled','RTO Initiated','RTO Delivered'][Math.floor(Math.random() * 7)],
		createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
	}));

	await prisma.order.createMany({
		data: orders.map(({ id, ...rest }) => rest),
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
		console.log('Seeded');
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});