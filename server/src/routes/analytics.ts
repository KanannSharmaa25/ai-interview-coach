import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { requireAuth, type AuthReq } from '../middleware/auth.js';

export const analyticsRouter = Router();

analyticsRouter.use(requireAuth);

analyticsRouter.get('/overview', async (req: AuthReq, res) => {
  const userId = req.userId!;
  const interviews = await prisma.interview.findMany({
    where: { userId },
    orderBy: { startedAt: 'desc' },
    take: 100,
    select: { id: true, feedback: true, role: true, startedAt: true },
  });
  type InterviewRow = { id: string; feedback: unknown; role: string; startedAt: Date };
  const withScores = interviews.filter((i: InterviewRow) => i.feedback && typeof i.feedback === 'object');
  const avgScore =
    withScores.length > 0
      ? Math.round(
          (withScores as InterviewRow[]).reduce((acc: number, i: InterviewRow) => {
            const f = i.feedback as Record<string, number> | null;
            const s = f ? (f.communicationScore + f.confidenceScore + (f.technicalScore || 0) + (f.starScore || 0)) / 4 : 0;
            return acc + s;
          }, 0) / withScores.length
        )
      : 0;
  const roles = [...new Set(interviews.map((i: InterviewRow) => i.role))];
  const weakTopics = roles.map((role: string) => {
    const byRole = (withScores as InterviewRow[]).filter((i: InterviewRow) => i.role === role);
    const avg = byRole.length ? byRole.reduce((a: number, i: InterviewRow) => a + ((i.feedback as Record<string, number>)?.technicalScore ?? 0), 0) / byRole.length : 0;
    return { name: role, score: Math.round(avg) };
  });
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const thisMonth = interviews.filter((i: InterviewRow) => i.startedAt >= startOfMonth);
  const byDay = new Set(thisMonth.map((i: InterviewRow) => i.startedAt.toISOString().slice(0, 10)));
  res.json({
    readinessScore: avgScore || 0,
    streak: byDay.size,
    weakTopics: weakTopics.length ? weakTopics : [{ name: 'General', score: avgScore }],
    interviews: interviews.slice(0, 20).map((i: InterviewRow) => ({
      id: i.id,
      role: i.role,
      startedAt: i.startedAt,
      feedback: i.feedback,
    })),
  });
});
