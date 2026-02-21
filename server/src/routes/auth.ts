import { Router } from 'express';
import { verifyIdToken } from '../lib/firebase.js';
import { prisma } from '../lib/db.js';
import { requireAuth, type AuthReq } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { idToken } = req.body as { idToken?: string };
  if (!idToken || typeof idToken !== 'string') {
    res.status(400).json({ error: 'idToken required' });
    return;
  }
  const decoded = await verifyIdToken(idToken);
  if (!decoded?.uid) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
  const email = (decoded.email as string) || `${decoded.uid}@firebase.local`;
  const name = (decoded.name as string) || (decoded.email as string) || null;
  const avatar = (decoded.picture as string) || null;
  let user = await prisma.user.findFirst({
    where: { firebaseUid: decoded.uid },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name,
        avatar,
        firebaseUid: decoded.uid,
        plan: 'free',
      },
    });
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { email, name, avatar },
    });
  }
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      plan: user.plan as 'free' | 'premium',
    },
  });
});

authRouter.get('/me', requireAuth, (req: AuthReq, res) => {
  const u = req.userRecord!;
  res.json({
    user: {
      id: req.userId,
      email: u.email,
      name: u.name,
      plan: u.plan,
    },
  });
});
