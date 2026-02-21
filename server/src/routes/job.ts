import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { matchJob } from '../lib/openai.js';
import { requireAuth, type AuthReq } from '../middleware/auth.js';

export const jobRouter = Router();

jobRouter.use(requireAuth);

jobRouter.post('/match', async (req: AuthReq, res) => {
  const userId = req.userId!;
  const { jobDescription, resumeText } = req.body as { jobDescription?: string; resumeText?: string };
  if (!jobDescription?.trim()) {
    res.status(400).json({ error: 'jobDescription required' });
    return;
  }
  let text = resumeText?.trim();
  if (!text) {
    const last = await prisma.resumeAnalysis.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (last) {
      const lastResume = await prisma.resumeAnalysis.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
      if (lastResume) text = ''; // We don't store raw resume text; use placeholder or require paste
    }
  }
  const result = await matchJob({
    resumeText: text || 'No resume provided. User should paste resume or analyze one first.',
    jobDescription: jobDescription.trim(),
  });
  await prisma.jobMatch.create({
    data: {
      userId,
      jobDescription: jobDescription.slice(0, 20000),
      matchPercent: result.matchPercent,
      missingSkills: result.missingSkills as unknown as object,
      suggestedAnswers: result.suggestedAnswers as unknown as object,
    },
  });
  res.json({
    matchPercent: result.matchPercent,
    missingSkills: result.missingSkills,
    suggestedAnswers: result.suggestedAnswers,
  });
});
