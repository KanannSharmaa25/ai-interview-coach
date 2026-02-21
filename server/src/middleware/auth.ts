import type { Request, Response, NextFunction } from 'express';
import { verifyIdToken } from '../lib/firebase.js';
import { prisma } from '../lib/db.js';

export interface AuthReq extends Request {
  userId?: string;
  userRecord?: { id: string; email: string; name: string | null; plan: string };
}

export async function requireAuth(req: AuthReq, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    res.status(401).json({ error: 'Missing or invalid authorization' });
    return;
  }
  const decoded = await verifyIdToken(token);
  if (!decoded?.uid) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const user = await prisma.user.findFirst({
    where: { firebaseUid: decoded.uid },
    select: { id: true, email: true, name: true, plan: true },
  });
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }
  req.userId = user.id;
  req.userRecord = user;
  next();
}

/** Optional auth: sets req.userId if valid token, does not 401 */
export async function optionalAuth(req: AuthReq, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    next();
    return;
  }
  const decoded = await verifyIdToken(token);
  if (!decoded?.uid) {
    next();
    return;
  }
  const user = await prisma.user.findFirst({
    where: { firebaseUid: decoded.uid },
    select: { id: true, email: true, name: true, plan: true },
  });
  if (user) {
    req.userId = user.id;
    req.userRecord = user;
  }
  next();
}

export function requirePremium(req: AuthReq, res: Response, next: NextFunction): void {
  if (req.userRecord?.plan !== 'premium') {
    res.status(403).json({ error: 'Premium subscription required' });
    return;
  }
  next();
}
