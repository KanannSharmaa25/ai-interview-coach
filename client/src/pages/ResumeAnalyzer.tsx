import { useState } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import { Upload, FileText } from 'lucide-react'
import { analyzeResume as apiAnalyzeResume } from '../lib/api'

function mockAnalysis(fileName?: string, resumeText?: string, jobDesc?: string): {
  atsScore: number
  keywordMatch: number
  skillGaps: string[]
  suggestions: string[]
} {
  const text = resumeText || fileName || ''
  const hasTech = /react|javascript|python|java|typescript|api|database/i.test(text)
  return {
    atsScore: Math.min(92, 65 + (text.length > 100 ? 15 : 0) + (hasTech ? 12 : 0)),
    keywordMatch: jobDesc ? Math.min(88, 60 + Math.floor(text.length / 50)) : 72,
    skillGaps: hasTech ? ['System Design', 'Leadership'] : ['Technical Skills', 'Quantified achievements', 'System Design'],
    suggestions: [
      'Add a clear Technical Skills section with keywords from the job description.',
      'Quantify achievements with metrics (e.g., "reduced load time by 40%").',
      'Keep resume to 1–2 pages for most roles.',
    ],
  }
}

export default function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    atsScore: number
    keywordMatch: number
    skillGaps: string[]
    suggestions: string[]
  } | null>(null)
  const [usedFallback, setUsedFallback] = useState(false)

  const canAnalyze = file !== null || resumeText.trim().length >= 50

  const handleAnalyze = async () => {
    if (!canAnalyze) return
    setError(null)
    setResult(null)
    setUsedFallback(false)
    setLoading(true)
    try {
      const formData = new FormData()
      if (file) formData.append('resume', file)
      if (resumeText.trim()) formData.append('resumeText', resumeText.trim())
      if (jobDesc.trim()) formData.append('jobDescription', jobDesc.trim())
      const data = await apiAnalyzeResume(formData)
      setResult(data)
    } catch (_e) {
      setUsedFallback(true)
      setResult(
        mockAnalysis(file?.name, resumeText.trim() || undefined, jobDesc.trim() || undefined)
      )
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Resume Analyzer</h1>
      <p className="mt-1 text-[var(--color-muted)]">Upload your resume (PDF) or paste text for ATS compatibility and keyword match</p>

      {usedFallback && (
        <p className="mt-2 text-sm text-[var(--color-warning)]">
          Showing offline analysis (server unavailable).
        </p>
      )}
      {error && !usedFallback && <p className="mt-2 text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Upload or paste resume</h2>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface)] py-8 transition hover:border-[var(--color-primary)]/50">
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <Upload className="h-10 w-10 text-[var(--color-muted)]" />
            <span className="mt-2 text-sm text-[var(--color-muted)]">
              {file ? file.name : 'Drop PDF or click to upload'}
            </span>
          </label>
          <p className="mt-2 text-xs text-[var(--color-muted)]">Or paste resume text below (min 50 chars for text-only)</p>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text..."
            rows={4}
            className="mt-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-white">Job description (optional)</label>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              placeholder="Paste job description for keyword match..."
              rows={4}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
            />
          </div>
          <Button variant="primary" className="mt-4 w-full" onClick={handleAnalyze} disabled={!canAnalyze || loading}>
            {loading ? 'Analyzing…' : 'Analyze Resume'}
          </Button>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Analysis results</h2>
          {!result ? (
            <div className="mt-8 flex flex-col items-center justify-center py-8 text-[var(--color-muted)]">
              <FileText className="h-12 w-12" />
              <p className="mt-2 text-sm">Upload a PDF or paste resume text (50+ chars), then click Analyze.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <ProgressBar label="ATS compatibility" value={result.atsScore} variant={result.atsScore >= 70 ? 'success' : 'warning'} />
              <ProgressBar label="Keyword match" value={result.keywordMatch} variant="default" />
              <div>
                <p className="text-sm font-medium text-white">Skill gaps</p>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{result.skillGaps.length ? result.skillGaps.join(', ') : 'None identified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white">Suggestions</p>
                <ul className="mt-1 list-inside list-disc text-sm text-[var(--color-muted)]">
                  {result.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
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
