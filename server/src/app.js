import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import enquiryRoutes from './routes/enquiryRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'PAART Academy API is running.' });
});

app.use('/api/enquiries', enquiryRoutes);
app.use(errorHandler);

export default app;
