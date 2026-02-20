import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { Mic, FileSearch, Sparkles } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[var(--color-surface)] via-[var(--color-surface)] to-[var(--color-primary-muted)] opacity-60 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />

      <header className="relative z-10 flex h-16 items-center justify-between border-b border-[var(--color-border-soft)] px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] font-semibold text-white">
            AI
          </div>
          <span className="text-lg font-semibold text-white">Interview Coach</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-[var(--color-muted)] hover:text-white transition-colors">
            Sign in
          </Link>
          <Link to="/login">
            <Button variant="primary" size="sm">
              Get started
            </Button>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          Practice Interviews.{' '}
          <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
            Get Hired Faster.
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-muted)]">
          AI-powered mock interviews, resume analysis, and personalized feedback. Build confidence and land your dream role.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/login">
            <Button variant="primary" size="lg" className="shadow-[var(--shadow-glow)]">
              Start Mock Interview
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="secondary" size="lg">
              Analyze Resume
            </Button>
          </Link>
        </div>

        <div className="mt-24 grid gap-6 sm:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--color-primary)]/40">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-white">AI Mock Interviews</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Role-based practice with real-time follow-ups and difficulty levels.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--color-primary)]/40">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
              <FileSearch className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-white">Resume & Job Match</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              ATS compatibility, keyword match, and skill gap analysis.
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 text-left shadow-[var(--shadow-soft)] transition hover:border-[var(--color-primary)]/40">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-semibold text-white">Smart Feedback</h3>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Communication, confidence, and STAR method evaluation.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
