import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { interviewRouter } from './routes/interview.js';
import { resumeRouter } from './routes/resume.js';
import { jobRouter } from './routes/job.js';
import { behavioralRouter } from './routes/behavioral.js';
import { analyticsRouter } from './routes/analytics.js';
import { stripeRouter, handleStripeWebhook } from './routes/stripe.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));

// Stripe webhook needs raw body
app.use(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    const sig = (req.headers['stripe-signature'] as string) || '';
    const rawBody = req.body instanceof Buffer ? req.body : Buffer.from('');
    handleStripeWebhook(rawBody, sig, res);
  }
);

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ai-interview-coach-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/resume', resumeRouter);
app.use('/api/job', jobRouter);
app.use('/api/behavioral', behavioralRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/stripe', stripeRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
