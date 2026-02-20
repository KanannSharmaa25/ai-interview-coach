import { Link } from 'react-router-dom'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'
import { ArrowLeft, Lightbulb } from 'lucide-react'

const metrics = [
  { label: 'Communication clarity', value: 82, variant: 'success' as const },
  { label: 'Confidence', value: 71, variant: 'default' as const },
  { label: 'Technical accuracy', value: 78, variant: 'success' as const },
  { label: 'STAR structure', value: 65, variant: 'warning' as const },
  { label: 'Filler words (lower is better)', value: 12, variant: 'warning' as const },
]
const suggestions = [
  'Add specific metrics to your answers (e.g., "reduced load time by 40%").',
  'Practice the STAR method: Situation, Task, Action, Result.',
  'Reduce "um" and "like" by pausing briefly instead.',
]

export default function Feedback() {
  return (
    <div className="p-6 lg:p-8">
      <Link to="/app" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-white">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="text-2xl font-bold text-white">Interview Feedback</h1>
      <p className="mt-1 text-[var(--color-muted)]">Review your scores and improvement areas</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Scores</h2>
          <div className="mt-4 space-y-4">
            {metrics.map((m) => (
              <ProgressBar key={m.label} label={m.label} value={m.value} variant={m.variant} />
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Lightbulb className="h-5 w-5 text-[var(--color-warning)]" />
            Suggestions for improvement
          </h2>
          <ul className="mt-4 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-[var(--color-muted)]">
                <span className="text-[var(--color-primary)]">•</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-white">Body language (when video enabled)</h2>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Eye contact and posture analysis will appear here after a video practice session.
        </p>
      </Card>
    </div>
  )
}
