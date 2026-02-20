import { auth } from './firebase'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function getToken(): Promise<string | null> {
  if (auth?.currentUser) return auth.currentUser.getIdToken()
  return localStorage.getItem('ai-interview-coach-token')
}

type ApiOptions = Omit<RequestInit, 'body'> & { body?: unknown }

export async function api<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const token = await getToken()
  const headers: HeadersInit = {
    ...(options.headers as HeadersInit),
  }
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`

  let body = options.body
  if (body instanceof FormData) {
    const { body: _b, ...rest } = options
    const res = await fetch(`${API_BASE}${path}`, { ...rest, headers, body })
    const data = await res.json().catch(() => ({})) as T & { error?: string }
    if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText)
    if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error)
      throw new Error((data as { error?: string }).error)
    return data as T
  }
  if (body != null && typeof body === 'object' && !(body instanceof FormData)) {
    (headers as Record<string, string>)['Content-Type'] = 'application/json'
    body = JSON.stringify(body)
  }
  const { body: _b, ...rest } = options
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers, body: body as BodyInit })
  const data = await res.json().catch(() => ({})) as T & { error?: string }
  if (!res.ok) throw new Error((data as { error?: string }).error || res.statusText)
  if (data && typeof data === 'object' && 'error' in data && (data as { error?: string }).error)
    throw new Error((data as { error?: string }).error)
  return data as T
}

// Auth
export async function loginWithIdToken(idToken: string): Promise<{ user: { id: string; email: string; name: string | null; avatar?: string; plan: string } }> {
  const data = await api<{ user: { id: string; email: string; name: string | null; avatar?: string; plan: string } }>('/auth/login', {
    method: 'POST',
    body: { idToken },
  })
  return data
}

// Interview
export async function startInterview(role: string, difficulty: string) {
  return api<{ interviewId: string; question: string; role: string; difficulty: string }>('/interview/start', {
    method: 'POST',
    body: { role, difficulty },
  })
}

export async function submitAnswer(interviewId: string, question: string, answer: string) {
  return api<{ nextQuestion: string; feedback: Record<string, unknown> }>('/interview/answer', {
    method: 'POST',
    body: { interviewId, question, answer },
  })
}

// Resume
export async function analyzeResume(formData: FormData) {
  return api<{ atsScore: number; keywordMatch: number; skillGaps: string[]; suggestions: string[] }>('/resume/analyze', {
    method: 'POST',
    body: formData,
  })
}

// Job match
export async function matchJob(jobDescription: string, resumeText?: string) {
  return api<{ matchPercent: number; missingSkills: string[]; suggestedAnswers: { question: string; answer: string }[] }>('/job/match', {
    method: 'POST',
    body: { jobDescription, resumeText },
  })
}

// Behavioral
export async function improveAnswer(answer: string) {
  return api<{ improved: string }>('/behavioral/improve', {
    method: 'POST',
    body: { answer },
  })
}

// Analytics
export async function getAnalyticsOverview() {
  return api<{ readinessScore: number; streak: number; weakTopics: { name: string; score: number }[]; interviews: unknown[] }>('/analytics/overview')
}

// Stripe
export async function createCheckoutSession(successUrl?: string, cancelUrl?: string) {
  return api<{ url: string }>('/stripe/create-checkout-session', {
    method: 'POST',
    body: { successUrl, cancelUrl },
  })
}

// AI Evaluation
export async function getEvaluation() {
  return api<{
    overallScore: number
    readinessLevel: string
    mockInterviewScore: number
    resumeScore: number
    behavioralScore: number
    voicePracticeScore: number
    targetRole: string
    strengths: string[]
    weaknesses: string[]
    recommendations: { priority: 'high' | 'medium' | 'low'; category: string; title: string; description: string; action: string; resource?: string }[]
    interviewInsights: { question: string; yourAnswer: string; feedback: string; improvement: string }[]
    skillGaps: { skill: string; importance: 'high' | 'medium' | 'low'; currentLevel: number; recommendedLevel: number }[]
    weeklyProgress: { day: string; score: number }[]
  }>('/evaluation/get')
}

export async function generateEvaluation(targetRole: string) {
  return api<{
    overallScore: number
    readinessLevel: string
    mockInterviewScore: number
    resumeScore: number
    behavioralScore: number
    voicePracticeScore: number
    targetRole: string
    strengths: string[]
    weaknesses: string[]
    recommendations: { priority: 'high' | 'medium' | 'low'; category: string; title: string; description: string; action: string; resource?: string }[]
    interviewInsights: { question: string; yourAnswer: string; feedback: string; improvement: string }[]
    skillGaps: { skill: string; importance: 'high' | 'medium' | 'low'; currentLevel: number; recommendedLevel: number }[]
    weeklyProgress: { day: string; score: number }[]
  }>('/evaluation/generate', {
    method: 'POST',
    body: { targetRole },
  })
}
