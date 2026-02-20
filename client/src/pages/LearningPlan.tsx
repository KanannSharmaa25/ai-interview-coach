import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'
import Button from '../components/Button'
import { BookOpen, Target, Calendar, FileText } from 'lucide-react'
import { getAnalyticsOverview } from '../lib/api'

export default function LearningPlan() {
  const [hasData, setHasData] = useState<boolean | null>(null)

  useEffect(() => {
    getAnalyticsOverview()
      .then((d) => {
        const hasInterviews = Array.isArray(d.interviews) && d.interviews.length > 0
        const hasWeakTopics = Array.isArray(d.weakTopics) && d.weakTopics.length > 0 && (d.weakTopics as { score?: number }[]).some((t) => (t.score ?? 0) > 0)
        setHasData(hasInterviews || hasWeakTopics)
      })
      .catch(() => setHasData(false))
  }, [])

  if (hasData === null) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-white">Personalized Learning Plan</h1>
        <p className="mt-1 text-[var(--color-muted)]">Loading…</p>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-white">Personalized Learning Plan</h1>
        <p className="mt-1 text-[var(--color-muted)]">Weak areas, practice questions, and suggested schedule</p>
        <Card className="mt-8 flex flex-col items-center justify-center py-16 text-center">
          <Target className="h-16 w-16 text-[var(--color-muted)]" />
          <h2 className="mt-4 text-lg font-semibold text-white">No data yet</h2>
          <p className="mt-2 max-w-md text-sm text-[var(--color-muted)]">
            Complete a mock interview or analyze your resume to get a personalized plan with weak areas, practice questions, and a suggested schedule.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/app/interview">
              <Button variant="primary">Start Mock Interview</Button>
            </Link>
            <Link to="/app/resume">
              <Button variant="secondary">
                <FileText className="mr-2 h-4 w-4" />
                Analyze Resume
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const weakAreas = [
    { name: 'System Design', score: 45 },
    { name: 'Behavioral (STAR)', score: 65 },
    { name: 'Algorithms', score: 58 },
  ]
  const practiceQuestions = [
    'Explain microservices vs monolith.',
    'Design a URL shortener.',
    'Describe a conflict with a stakeholder.',
  ]
  const schedule = [
    { day: 'Mon', type: 'Mock interview', topic: 'Frontend' },
    { day: 'Wed', type: 'Concept review', topic: 'System Design' },
    { day: 'Fri', type: 'Mock interview', topic: 'Behavioral' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Personalized Learning Plan</h1>
      <p className="mt-1 text-[var(--color-muted)]">Weak areas, practice questions, and suggested schedule</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Target className="h-5 w-5 text-[var(--color-primary)]" />
            Weak areas detected
          </h2>
          <div className="mt-4 space-y-4">
            {weakAreas.map((a) => (
              <ProgressBar key={a.name} label={a.name} value={a.score} variant={a.score >= 60 ? 'default' : 'warning'} />
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <BookOpen className="h-5 w-5 text-[var(--color-primary)]" />
            Practice questions
          </h2>
          <ul className="mt-4 space-y-2">
            {practiceQuestions.map((q, i) => (
              <li key={i} className="text-sm text-[var(--color-muted)]">• {q}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Calendar className="h-5 w-5 text-[var(--color-primary)]" />
          Suggested mock interview schedule
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {schedule.map((s) => (
            <div key={s.day} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
              <p className="font-medium text-white">{s.day}</p>
              <p className="text-sm text-[var(--color-muted)]">{s.type} · {s.topic}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
