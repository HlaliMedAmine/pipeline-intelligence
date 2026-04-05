import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pipelinesRouter from './routes/pipelines.js';
import aiRouter from './routes/ai.js';
import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/pipelines', pipelinesRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Pipeline Intelligence Backend running on port ${PORT}`);
});
