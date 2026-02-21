import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function getNextInterviewQuestion(params: {
  role: string;
  difficulty: string;
  previousQuestion?: string;
  userAnswer?: string;
  conversationHistory: { role: string; content: string }[];
}): Promise<string> {
  const { role, difficulty, previousQuestion, userAnswer, conversationHistory } = params;
  if (!openai) {
    return userAnswer
      ? 'Can you give a specific example with metrics?'
      : 'Tell me about yourself and your relevant experience.';
  }
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You are an AI interviewer for a ${role} role. Difficulty: ${difficulty}. Ask one clear question at a time. For follow-ups, dig deeper (metrics, outcomes, lessons). Be concise.`,
    },
    ...conversationHistory.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
  ];
  if (previousQuestion && userAnswer) {
    messages.push({ role: 'user', content: `Q: ${previousQuestion}\nA: ${userAnswer}` });
    messages.push({ role: 'user', content: 'Generate only the next follow-up question, nothing else.' });
  } else {
    messages.push({ role: 'user', content: 'Generate only the first interview question, nothing else.' });
  }
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 150,
  });
  return res.choices[0]?.message?.content?.trim() || 'Tell me about yourself.';
}

export async function getInterviewFeedback(params: {
  question: string;
  answer: string;
  role: string;
}): Promise<{ communicationScore: number; confidenceScore: number; technicalScore: number; starScore: number; fillerCount: number; suggestions: string[] }> {
  if (!openai) {
    return {
      communicationScore: 72,
      confidenceScore: 68,
      technicalScore: 70,
      starScore: 65,
      fillerCount: 8,
      suggestions: ['Add specific metrics.', 'Use STAR structure.'],
    };
  }
  const { question, answer, role } = params;
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an interview coach. For the given Q&A, respond with a JSON object only (no markdown): {
  "communicationScore": 0-100,
  "confidenceScore": 0-100,
  "technicalScore": 0-100,
  "starScore": 0-100 (STAR method),
  "fillerCount": number of um/like/you know,
  "suggestions": ["string", "string"]
}`,
      },
      { role: 'user', content: `Role: ${role}\nQ: ${question}\nA: ${answer}` },
    ],
    max_tokens: 400,
  });
  const text = res.choices[0]?.message?.content?.trim() || '{}';
  try {
    const parsed = JSON.parse(text.replace(/```json?\s*|\s*```/g, '')) as Record<string, unknown>;
    return {
      communicationScore: Number(parsed.communicationScore) || 70,
      confidenceScore: Number(parsed.confidenceScore) || 70,
      technicalScore: Number(parsed.technicalScore) || 70,
      starScore: Number(parsed.starScore) || 65,
      fillerCount: Number(parsed.fillerCount) || 5,
      suggestions: Array.isArray(parsed.suggestions) ? (parsed.suggestions as string[]) : [],
    };
  } catch {
    return {
      communicationScore: 70,
      confidenceScore: 70,
      technicalScore: 70,
      starScore: 65,
      fillerCount: 5,
      suggestions: ['Add specific metrics.', 'Use STAR structure.'],
    };
  }
}

export async function analyzeResume(params: {
  resumeText: string;
  jobDescription?: string;
}): Promise<{ atsScore: number; keywordMatch: number; skillGaps: string[]; suggestions: string[] }> {
  if (!openai) {
    return {
      atsScore: 78,
      keywordMatch: 70,
      skillGaps: ['TypeScript', 'System Design'],
      suggestions: ['Add a Technical Skills section.', 'Quantify achievements.'],
    };
  }
  const { resumeText, jobDescription } = params;
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are an ATS and resume coach. Based on the resume (and optional job description), respond with a JSON object only (no markdown): {
  "atsScore": 0-100 (ATS compatibility),
  "keywordMatch": 0-100 (if job description provided, else 70),
  "skillGaps": ["skill1", "skill2"],
  "suggestions": ["string", "string"]
}`,
      },
      { role: 'user', content: jobDescription ? `Resume:\n${resumeText.slice(0, 12000)}\n\nJob description:\n${jobDescription.slice(0, 4000)}` : resumeText.slice(0, 12000) },
    ],
    max_tokens: 500,
  });
  const text = res.choices[0]?.message?.content?.trim() || '{}';
  try {
    const parsed = JSON.parse(text.replace(/```json?\s*|\s*```/g, '')) as Record<string, unknown>;
    return {
      atsScore: Number(parsed.atsScore) || 75,
      keywordMatch: Number(parsed.keywordMatch) ?? (jobDescription ? 70 : 75),
      skillGaps: Array.isArray(parsed.skillGaps) ? (parsed.skillGaps as string[]) : [],
      suggestions: Array.isArray(parsed.suggestions) ? (parsed.suggestions as string[]) : [],
    };
  } catch {
    return {
      atsScore: 75,
      keywordMatch: 70,
      skillGaps: ['TypeScript', 'System Design'],
      suggestions: ['Add a Technical Skills section.', 'Quantify achievements.'],
    };
  }
}

export async function matchJob(params: {
  resumeText: string;
  jobDescription: string;
}): Promise<{ matchPercent: number; missingSkills: string[]; suggestedAnswers: { question: string; answer: string }[] }> {
  if (!openai) {
    return {
      matchPercent: 72,
      missingSkills: ['Kubernetes'],
      suggestedAnswers: [],
    };
  }
  const { resumeText, jobDescription } = params;
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a career coach. Compare resume to job description. Respond with JSON only (no markdown): {
  "matchPercent": 0-100,
  "missingSkills": ["skill1", "skill2"],
  "suggestedAnswers": [{"question": "Why this company?", "answer": "brief suggested answer"}]
}`,
      },
      { role: 'user', content: `Resume:\n${resumeText.slice(0, 8000)}\n\nJob:\n${jobDescription.slice(0, 4000)}` },
    ],
    max_tokens: 600,
  });
  const text = res.choices[0]?.message?.content?.trim() || '{}';
  try {
    const parsed = JSON.parse(text.replace(/```json?\s*|\s*```/g, '')) as Record<string, unknown>;
    return {
      matchPercent: Number(parsed.matchPercent) || 70,
      missingSkills: Array.isArray(parsed.missingSkills) ? (parsed.missingSkills as string[]) : [],
      suggestedAnswers: Array.isArray(parsed.suggestedAnswers) ? (parsed.suggestedAnswers as { question: string; answer: string }[]) : [],
    };
  } catch {
    return {
      matchPercent: 70,
      missingSkills: ['Kubernetes'],
      suggestedAnswers: [],
    };
  }
}

export async function improveBehavioralAnswer(answer: string): Promise<string> {
  if (!openai) {
    return 'In my previous role (Situation), I was responsible for X (Task). I did Y (Action), which led to Z (Result).';
  }
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'Rewrite the user\'s behavioral interview answer using the STAR method (Situation, Task, Action, Result). Keep it concise and professional. Output only the rewritten answer.',
      },
      { role: 'user', content: answer },
    ],
    max_tokens: 400,
  });
  return res.choices[0]?.message?.content?.trim() || answer;
}
