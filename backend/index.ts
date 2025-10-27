// Main backend entry point
import express from 'express';
import cors from 'cors';
import ordersRouter from './api/orders';
import dashboardRouter from './api/dashboard';
import gstRouter from './api/gst';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// API Routes
app.use('/api/orders', ordersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/gst', gstRouter);

app.listen(PORT, () => {
  console.log(`D2C-Sync backend running on port ${PORT}`);
});
