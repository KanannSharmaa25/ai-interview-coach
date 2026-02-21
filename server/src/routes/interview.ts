import { Router } from 'express';
import { prisma } from '../lib/db.js';
import { getNextInterviewQuestion, getInterviewFeedback } from '../lib/openai.js';
import { requireAuth, type AuthReq } from '../middleware/auth.js';
import { checkMockLimit } from '../middleware/limits.js';

export const interviewRouter = Router();

interviewRouter.use(requireAuth);
interviewRouter.use(checkMockLimit);

interviewRouter.post('/start', async (req: AuthReq, res) => {
  const userId = req.userId!;
  const { role, difficulty } = req.body as { role?: string; difficulty?: string };
  const interview = await prisma.interview.create({
    data: {
      userId,
      role: role || 'Frontend',
      difficulty: difficulty || 'Intermediate',
      messages: [],
    },
  });
  const question = await getNextInterviewQuestion({
    role: interview.role,
    difficulty: interview.difficulty,
    conversationHistory: [],
  });
  const messages = [
    { role: 'assistant', content: question },
  ];
  await prisma.interview.update({
    where: { id: interview.id },
    data: { messages: messages as unknown as object },
  });
  res.json({
    interviewId: interview.id,
    question,
    role: interview.role,
    difficulty: interview.difficulty,
  });
});

interviewRouter.post('/answer', async (req: AuthReq, res) => {
  const userId = req.userId!;
  const { interviewId, question, answer } = req.body as { interviewId?: string; question?: string; answer?: string };
  if (!interviewId || !answer) {
    res.status(400).json({ error: 'interviewId and answer required' });
    return;
  }
  const interview = await prisma.interview.findFirst({
    where: { id: interviewId, userId },
  });
  if (!interview) {
    res.status(404).json({ error: 'Interview not found' });
    return;
  }
  const messages = (interview.messages as { role: string; content: string }[]) || [];
  const lastQuestion = question || (messages.filter((m) => m.role === 'assistant').pop()?.content) || 'Tell me about yourself.';
  const conversationHistory = messages.map((m) => ({ role: m.role, content: m.content }));
  conversationHistory.push({ role: 'assistant', content: lastQuestion });
  conversationHistory.push({ role: 'user', content: answer });

  const nextQuestion = await getNextInterviewQuestion({
    role: interview.role,
    difficulty: interview.difficulty,
    previousQuestion: lastQuestion,
    userAnswer: answer,
    conversationHistory,
  });

  const feedback = await getInterviewFeedback({
    question: lastQuestion,
    answer,
    role: interview.role,
  });

  conversationHistory.push({ role: 'assistant', content: nextQuestion });
  await prisma.interview.update({
    where: { id: interview.id },
    data: {
      messages: conversationHistory as unknown as object,
      feedback: feedback as unknown as object,
    },
  });

  res.json({
    nextQuestion,
    feedback: {
      communicationScore: feedback.communicationScore,
      confidenceScore: feedback.confidenceScore,
      technicalScore: feedback.technicalScore,
      starScore: feedback.starScore,
      fillerCount: feedback.fillerCount,
      suggestions: feedback.suggestions,
    },
  });
});

interviewRouter.get('/:id', async (req: AuthReq, res) => {
  const id = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
  if (!id) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const interview = await prisma.interview.findFirst({
    where: { id, userId: req.userId! },
  });
  if (!interview) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({
    id: interview.id,
    role: interview.role,
    difficulty: interview.difficulty,
    messages: interview.messages,
    feedback: interview.feedback,
    startedAt: interview.startedAt,
  });
});

interviewRouter.get('/', async (req: AuthReq, res) => {
  const list = await prisma.interview.findMany({
    where: { userId: req.userId! },
    orderBy: { startedAt: 'desc' },
    take: 50,
    select: { id: true, role: true, difficulty: true, startedAt: true, feedback: true },
  });
  res.json({ interviews: list });
});
