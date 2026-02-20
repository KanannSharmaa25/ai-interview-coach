import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import ScoreRing from '../components/ScoreRing'
import { MessageCircle, FileText, BarChart3, Target, Sparkles, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { getAnalyticsOverview } from '../lib/api'

const quickActions = [
  { to: '/app/interview', label: 'Start Interview', icon: MessageCircle, desc: 'AI mock interview' },
  { to: '/app/resume', label: 'Resume Analyzer', icon: FileText, desc: 'ATS & keywords' },
  { to: '/app/analytics', label: 'Progress Analytics', icon: BarChart3, desc: 'Track improvement' },
  { to: '/app/career-coach', label: 'Career Coach', icon: Sparkles, desc: 'Get personalized guidance' },
  { to: '/app/learning-plan', label: 'Practice Weak Areas', icon: Target, desc: 'Personalized plan' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [readinessScore, setReadinessScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalyticsOverview()
      .then((d) => {
        setReadinessScore(d.readinessScore)
        setStreak(d.streak)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="mt-1 text-[var(--color-muted)]">Overview of your interview readiness</p>
        </div>
        <div className="rounded-lg border border-[var(--color-primary)]/50 bg-[var(--color-primary-muted)] px-4 py-2 text-sm text-[var(--color-primary)]">
          {user?.plan === 'premium' ? 'Premium' : 'Free tier'} · {user?.plan !== 'premium' && <Link to="/app/settings" className="underline">Upgrade to Premium</Link>}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center py-8">
          {loading ? <span className="text-[var(--color-muted)]">Loading…</span> : <ScoreRing score={readinessScore} size={140} label="Readiness" />}
          <p className="mt-4 text-sm text-[var(--color-muted)]">Overall interview readiness score</p>
        </Card>
        <Card className="lg:col-span-2 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Quick actions</h2>
              <p className="text-sm text-[var(--color-muted)]">Jump into practice or analysis</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-[var(--color-primary-muted)] px-3 py-1.5 text-sm text-[var(--color-primary)]">
              <span className="font-medium">{streak} day streak</span>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {quickActions.map(({ to, label, icon: Icon, desc }) => (
              <Link key={to} to={to}>
                <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 transition hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-hover)]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{label}</p>
                    <p className="text-xs text-[var(--color-muted)]">{desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-[var(--color-muted)]" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-white">Upcoming</h2>
        <Card className="mt-3">
          <div className="flex items-center justify-between">
            <p className="text-[var(--color-muted)]">No scheduled mock interviews. Start one when you’re ready.</p>
            <Link to="/app/interview">
              <Button variant="primary">Start Mock Interview</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
