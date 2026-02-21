import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/db.js';
import { analyzeResume } from '../lib/openai.js';
import { requireAuth, type AuthReq } from '../middleware/auth.js';

export const resumeRouter = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

resumeRouter.use(requireAuth);

resumeRouter.post('/analyze', upload.single('resume'), async (req: AuthReq, res) => {
  const userId = req.userId!;
  const file = req.file;
  const jobDescription = (req.body.jobDescription as string)?.trim() || undefined;
  let resumeText = (req.body.resumeText as string)?.trim();

  if (!resumeText && file) {
    if (file.mimetype !== 'application/pdf') {
      res.status(400).json({ error: 'Only PDF resumes are supported' });
      return;
    }
    try {
      const { PDFParse } = await import('pdf-parse');
      const parser = new PDFParse({ data: new Uint8Array(file.buffer) });
      const textResult = await parser.getText();
      resumeText = textResult.text;
      await parser.destroy();
    } catch (e) {
      res.status(400).json({ error: 'Could not parse PDF' });
      return;
    }
  }

  if (!resumeText || resumeText.length < 50) {
    res.status(400).json({ error: 'Provide a resume file (PDF) or paste resume text (min 50 chars)' });
    return;
  }

  const result = await analyzeResume({ resumeText, jobDescription });
  await prisma.resumeAnalysis.create({
    data: {
      userId,
      fileName: file?.originalname || 'pasted.txt',
      atsScore: result.atsScore,
      keywordMatch: result.keywordMatch,
      skillGaps: result.skillGaps as unknown as object,
      suggestions: result.suggestions as unknown as object,
      jobDescription: jobDescription || null,
    },
  });
  res.json({
    atsScore: result.atsScore,
    keywordMatch: result.keywordMatch,
    skillGaps: result.skillGaps,
    suggestions: result.suggestions,
  });
});

resumeRouter.get('/history', async (req: AuthReq, res) => {
  const list = await prisma.resumeAnalysis.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });
  res.json({ analyses: list });
});
