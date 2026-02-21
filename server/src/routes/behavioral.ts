import { Router } from 'express';
import { improveBehavioralAnswer } from '../lib/openai.js';
import { requireAuth } from '../middleware/auth.js';

export const behavioralRouter = Router();

behavioralRouter.use(requireAuth);

behavioralRouter.post('/improve', async (req, res) => {
  const { answer } = req.body as { answer?: string };
  if (!answer || typeof answer !== 'string') {
    res.status(400).json({ error: 'answer required' });
    return;
  }
  const improved = await improveBehavioralAnswer(answer.trim());
  res.json({ improved });
});
