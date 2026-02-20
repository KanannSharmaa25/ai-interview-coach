import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import { Briefcase } from 'lucide-react'
import { matchJob } from '../lib/api'

export default function JobMatch() {
  const [jobDesc, setJobDesc] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    matchPercent: number
    missingSkills: string[]
    suggestedAnswers: { question: string; answer: string }[]
  } | null>(null)

  const handleAnalyze = async () => {
    if (!jobDesc.trim()) return
    setError(null)
    setLoading(true)
    setResult(null)
    try {
      const data = await matchJob(jobDesc.trim(), resumeText.trim() || undefined)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Match failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Job Description Match</h1>
      <p className="mt-1 text-[var(--color-muted)]">Paste job description (and optional resume text) for match %, missing skills, and suggested answers</p>

      {error && <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Briefcase className="h-5 w-5 text-[var(--color-primary)]" />
            Job description & resume
          </h2>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <label className="mt-2 block text-sm text-[var(--color-muted)]">Optional: paste your resume text for better match</label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text..."
            rows={4}
            className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <Button variant="primary" className="mt-4 w-full" onClick={handleAnalyze} disabled={!jobDesc.trim() || loading}>
            {loading ? 'Analyzing…' : 'Analyze match'}
          </Button>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Match results</h2>
          {!result ? (
            <p className="mt-6 text-sm text-[var(--color-muted)]">Paste a job description and click Analyze.</p>
          ) : (
            <div className="mt-4 space-y-4">
              <ProgressBar label="Probability match" value={result.matchPercent} variant="default" />
              <div>
                <p className="text-sm font-medium text-white">Missing skills</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{result.missingSkills.length ? result.missingSkills.join(', ') : 'None'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Suggested answers (common questions)</p>
                <ul className="mt-2 space-y-2 text-sm text-[var(--color-muted)]">
                  {result.suggestedAnswers.map((a, i) => (
                    <li key={i} className="rounded-lg bg-[var(--color-surface)] p-3">
                      <strong>{a.question}</strong> — {a.answer}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
