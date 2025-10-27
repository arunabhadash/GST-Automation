import { Router } from 'express';

const router = Router();

const kpiData = {
  revenue: 482590,
  rtoRate: 18.5,
  pendingGst: 12750,
};

const salesData = [
  { name: '1-7 May', Sales: 95000, RTOs: 18000 },
  { name: '8-14 May', Sales: 110000, RTOs: 22000 },
  { name: '15-21 May', Sales: 125000, RTOs: 21000 },
  { name: '22-28 May', Sales: 152590, RTOs: 25000 },
];

const rtoHotspots = [
  { location: 'New Delhi (110092)', rate: 32 },
  { location: 'Mumbai (400058)', rate: 28 },
  { location: 'Bangalore (560078)', rate: 25 },
];

const syncActivity = [
  { id: 'sa1', description: 'RTO for Order #DS-1048 synced.', timestamp: '2 minutes ago' },
  { id: 'sa2', description: 'Credit Note #CN5678 created.', timestamp: '2 minutes ago' },
  { id: 'sa3', description: 'GST return draft updated for May 2024.', timestamp: '1 minute ago' },
  { id: 'sa4', description: 'RTO for Order #DS-1045 synced.', timestamp: '1 hour ago' },
];

router.get('/', (_req, res) => {
  res.json({ kpiData, salesData, rtoHotspots, syncActivity });
});

export default router;

