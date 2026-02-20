import { useState, useEffect, useRef } from 'react'
import Card from '../components/Card'
import { 
  Activity, Heart, Zap, Brain, AlertTriangle, CheckCircle, TrendingUp,
  Pause, Play, RefreshCw, ChevronDown, ChevronUp, Volume2
} from 'lucide-react'

interface LiveFeedbackData {
  confidence: number
  tone: 'positive' | 'neutral' | 'negative'
  pace: 'slow' | 'optimal' | 'fast'
  fillerWords: number
  keywords: string[]
  stressLevel: number
  clarity: number
  energy: number
  engagement: number
  feedback: string[]
}

interface LiveFeedbackProps {
  isListening: boolean
  transcript: string
  onPause?: () => void
  onResume?: () => void
}

const TONE_COLORS = {
  positive: 'text-green-400',
  neutral: 'text-yellow-400', 
  negative: 'text-red-400'
}

const PACE_COLORS = {
  slow: 'text-blue-400',
  optimal: 'text-green-400',
  fast: 'text-yellow-400'
}

const TONE_LABELS = {
  positive: 'Positive & Confident',
  neutral: 'Neutral',
  negative: 'Needs Improvement'
}

const PACE_LABELS = {
  slow: 'Too Slow',
  optimal: 'Good Pace',
  fast: 'Too Fast'
}

export default function LiveFeedback({ isListening, transcript, onPause, onResume }: LiveFeedbackProps) {
  const [feedback, setFeedback] = useState<LiveFeedbackData | null>(null)
  const [expanded, setExpanded] = useState(true)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const transcriptRef = useRef('')
  const analysisTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (transcript) {
      transcriptRef.current = transcript
      if (isListening && !isAnalyzing) {
        debouncedAnalyze(transcript)
      }
    }
  }, [transcript, isListening])

  const debouncedAnalyze = (text: string) => {
    if (analysisTimeoutRef.current) {
      clearTimeout(analysisTimeoutRef.current)
    }
    analysisTimeoutRef.current = setTimeout(() => {
      analyzeSpeech(text)
    }, 2000)
  }

  const analyzeSpeech = (text: string) => {
    if (!text || text.length < 10) return
    
    setIsAnalyzing(true)
    
    const words = text.toLowerCase().split(/\s+/)
    const wordCount = words.length
    
    const fillerWords = ['um', 'uh', 'like', 'you know', 'basically', 'actually', 'literally', 'so', 'well', 'i mean']
    const fillerCount = words.filter(w => fillerWords.some(f => w.includes(f))).length
    
    const positiveWords = ['great', 'excellent', 'amazing', 'love', 'happy', 'excited', 'proud', 'successful', 'achieved', 'improved', 'grew', 'learned', 'helped', 'led', 'created', 'built', 'developed']
    const positiveCount = words.filter(w => positiveWords.some(p => w.includes(p))).length
    
    const fillerRatio = fillerCount / Math.max(wordCount, 1)
    const positiveRatio = positiveCount / Math.max(wordCount, 1)
    
    let tone: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (positiveRatio > 0.08) tone = 'positive'
    else if (positiveRatio < 0.02 && fillerRatio > 0.15) tone = 'negative'
    
    let pace: 'slow' | 'optimal' | 'fast' = 'optimal'
    if (wordCount < 30) pace = 'slow'
    else if (wordCount > 80) pace = 'fast'
    
    const confidence = Math.min(95, Math.max(40, 75 + (positiveRatio * 200) - (fillerRatio * 50)))
    const stressLevel = Math.min(100, Math.max(10, 30 + (fillerRatio * 100)))
    const clarity = Math.min(95, Math.max(30, 85 - (fillerRatio * 80) + (positiveRatio * 30)))
    const energy = Math.min(100, Math.max(20, 60 + (positiveRatio * 100) - (pace === 'fast' ? 20 : 0)))
    const engagement = Math.min(95, Math.max(35, 70 + (positiveRatio * 80) - (stressLevel > 60 ? 20 : 0)))
    
    const keywords = words.filter(w => 
      positiveWords.some(p => w.includes(p)) ||
      w.length > 6
    ).slice(0, 5)
    
    const feedbackMessages: string[] = []
    
    if (fillerRatio > 0.12) {
      feedbackMessages.push('Try to reduce filler words like "um", "uh", "like"')
    }
    if (pace === 'fast') {
      feedbackMessages.push('Slow down a bit - you\'re speaking too fast')
    }
    if (pace === 'slow') {
      feedbackMessages.push('Pick up the pace a little - you\'re pausing too much')
    }
    if (tone === 'negative') {
      feedbackMessages.push('Try to use more positive language')
    }
    if (stressLevel > 70) {
      feedbackMessages.push('Take a deep breath - you seem stressed')
    }
    if (confidence < 60) {
      feedbackMessages.push('Project more confidence in your answers')
    }
    if (engagement > 80) {
      feedbackMessages.push('Great engagement and energy!')
    }
    if (clarity > 85) {
      feedbackMessages.push('Your answers are very clear')
    }
    
    const newFeedback: LiveFeedbackData = {
      confidence: Math.round(confidence),
      tone,
      pace,
      fillerWords: fillerCount,
      keywords,
      stressLevel: Math.round(stressLevel),
      clarity: Math.round(clarity),
      energy: Math.round(energy),
      engagement: Math.round(engagement),
      feedback: feedbackMessages
    }
    
    setFeedback(newFeedback)
    setIsAnalyzing(false)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  if (!isListening && !feedback) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white">
            <Activity className="h-4 w-4 text-[var(--color-primary)]" />
            Live Feedback
          </h3>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)] text-center py-4">
          Start speaking to see real-time feedback on your interview performance
        </p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4"
      >
        <h3 className="flex items-center gap-2 text-sm font-medium text-white">
          <Activity className="h-4 w-4 text-[var(--color-primary)]" />
          Live Feedback
          {isListening && (
            <span className="flex h-2 w-2">
              <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400"></span>
            </span>
          )}
        </h3>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-[var(--color-muted)]" />
        ) : (
          <ChevronDown className="h-4 w-4 text-[var(--color-muted)]" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {isAnalyzing && (
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Analyzing speech...
            </div>
          )}

          {feedback && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Confidence</span>
                    <Brain className="h-3 w-3 text-[var(--color-primary)]" />
                  </div>
                  <p className={`mt-1 text-lg font-bold ${getScoreColor(feedback.confidence)}`}>
                    {feedback.confidence}%
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Clarity</span>
                    <Volume2 className="h-3 w-3 text-[var(--color-primary)]" />
                  </div>
                  <p className={`mt-1 text-lg font-bold ${getScoreColor(feedback.clarity)}`}>
                    {feedback.clarity}%
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Energy</span>
                    <Zap className="h-3 w-3 text-yellow-400" />
                  </div>
                  <p className={`mt-1 text-lg font-bold ${getScoreColor(feedback.energy)}`}>
                    {feedback.energy}%
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Engagement</span>
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  </div>
                  <p className={`mt-1 text-lg font-bold ${getScoreColor(feedback.engagement)}`}>
                    {feedback.engagement}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <span className="text-xs text-[var(--color-muted)]">Tone</span>
                  <p className={`mt-1 text-sm font-medium ${TONE_COLORS[feedback.tone]}`}>
                    {TONE_LABELS[feedback.tone]}
                  </p>
                </div>
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <span className="text-xs text-[var(--color-muted)]">Pace</span>
                  <p className={`mt-1 text-sm font-medium ${PACE_COLORS[feedback.pace]}`}>
                    {PACE_LABELS[feedback.pace]}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-[var(--color-surface)] p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-muted)]">Stress Level</span>
                  <Heart className={`h-3 w-3 ${feedback.stressLevel > 70 ? 'text-red-400' : feedback.stressLevel > 40 ? 'text-yellow-400' : 'text-green-400'}`} />
                </div>
                <div className="mt-2 h-2 rounded-full bg-[var(--color-border)]">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      feedback.stressLevel > 70 ? 'bg-red-400' : 
                      feedback.stressLevel > 40 ? 'bg-yellow-400' : 'bg-green-400'
                    }`}
                    style={{ width: `${feedback.stressLevel}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-right text-[var(--color-muted)]">
                  {feedback.stressLevel > 70 ? 'High - Try to relax' : feedback.stressLevel > 40 ? 'Moderate' : 'Calm'}
                </p>
              </div>

              {feedback.fillerWords > 0 && (
                <div className="rounded-lg bg-[var(--color-surface)] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">Filler Words</span>
                    <AlertTriangle className={`h-3 w-3 ${feedback.fillerWords > 3 ? 'text-yellow-400' : 'text-green-400'}`} />
                  </div>
                  <p className="mt-1 text-sm text-white">
                    {feedback.fillerWords} detected
                    {feedback.fillerWords > 3 && ' - try to reduce'}
                  </p>
                </div>
              )}

              {feedback.feedback.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-[var(--color-muted)]">Tips</span>
                  {feedback.feedback.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-[var(--color-primary-muted)]/20 p-2">
                      {tip.includes('Great') || tip.includes('Your') ? (
                        <CheckCircle className="mt-0.5 h-3 w-3 shrink-0 text-green-400" />
                      ) : (
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-yellow-400" />
                      )}
                      <p className="text-xs text-white">{tip}</p>
                    </div>
                  ))}
                </div>
              )}

              {feedback.keywords.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-medium text-[var(--color-muted)]">Key Terms Used</span>
                  <div className="flex flex-wrap gap-1">
                    {feedback.keywords.map((kw, i) => (
                      <span key={i} className="rounded-full bg-[var(--color-surface)] px-2 py-1 text-xs text-white">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {!isListening && feedback && (
            <button
              onClick={onResume}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-primary-muted)] py-2 text-sm text-[var(--color-primary)]"
            >
              <Play className="h-4 w-4" />
              Resume Analysis
            </button>
          )}

          {isListening && (
            <button
              onClick={onPause}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] py-2 text-sm text-[var(--color-muted)]"
            >
              <Pause className="h-4 w-4" />
              Pause Analysis
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
