import type { Response, NextFunction } from 'express';
import type { AuthReq } from './auth.js';
import { prisma } from '../lib/db.js';

const FREE_MOCKS_PER_MONTH = 3;

export async function checkMockLimit(req: AuthReq, res: Response, next: NextFunction): Promise<void> {
  if (req.userRecord?.plan === 'premium') {
    next();
    return;
  }
  if (!req.userId) {
    next();
    return;
  }
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const count = await prisma.interview.count({
    where: { userId: req.userId, startedAt: { gte: startOfMonth } },
  });
  if (count >= FREE_MOCKS_PER_MONTH) {
    res.status(403).json({
      error: 'Free tier limit reached',
      message: `You have used ${FREE_MOCKS_PER_MONTH} mock interviews this month. Upgrade to Premium for unlimited access.`,
    });
    return;
  }
  next();
}
