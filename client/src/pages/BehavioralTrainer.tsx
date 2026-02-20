import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import LiveFeedback from '../components/LiveFeedback'
import { Star, Sparkles, ArrowLeft, Mic, MicOff, Lightbulb, Target, Zap, RefreshCw } from 'lucide-react'
import { improveAnswer } from '../lib/api'
import { useSpeechRecognition } from '../hooks/useSpeech'
import { useSpeechSynthesis } from '../hooks/useSpeech'

const BEHAVIORAL_CATEGORIES: Record<string, string[]> = {
  'Leadership': [
    'Tell me about a time you demonstrated leadership.',
    'Describe a situation where you had to lead a team through a challenge.',
    'Tell me about a time you motivated a team to achieve a goal.',
    'Describe a time you took initiative on a project.',
    'Tell me about a time you had to mentor someone.',
  ],
  'Conflict Resolution': [
    'Tell me about a time you had a conflict with a coworker.',
    'Describe a situation where you disagreed with your manager.',
    'Tell me about a time you had to handle a difficult stakeholder.',
    'Describe how you resolved a team disagreement.',
    'Tell me about a time you had to give difficult feedback.',
  ],
  'Problem Solving': [
    'Tell me about a complex problem you solved.',
    'Describe a time you had to make a difficult decision with limited information.',
    'Tell me about a time you improved a process.',
    'Describe a situation where you had to think creatively.',
    'Tell me about a time you identified and solved a problem before it escalated.',
  ],
  'Adaptability': [
    'Tell me about a time you had to learn something quickly.',
    'Describe a situation where you had to adapt to change.',
    'Tell me about a time you handled unexpected challenges.',
    'Describe a time you had to switch priorities quickly.',
    'Tell me about a time you worked outside your comfort zone.',
  ],
  'Teamwork': [
    'Tell me about a successful team project you were part of.',
    'Describe a time you contributed to a team\'s success.',
    'Tell me about a time you helped a struggling teammate.',
    'Describe how you collaborate with others.',
    'Tell me about a time you had to rely on others to complete a project.',
  ],
  'Failure & Growth': [
    'Tell me about a time you failed.',
    'Describe a mistake you made and how you handled it.',
    'Tell me about a time you received constructive criticism.',
    'Describe a time you learned from a difficult experience.',
    'Tell me about a time you had to admit you were wrong.',
  ],
  'Achievements': [
    'Tell me about your greatest professional achievement.',
    'Describe a project you\'re particularly proud of.',
    'Tell me about a time you exceeded expectations.',
    'Describe a goal you reached and how you achieved it.',
    'Tell me about something you accomplished that others thought was difficult.',
  ],
  'Work Ethic': [
    'Tell me about a time you went above and beyond.',
    'Describe how you handle working under pressure.',
    'Tell me about a time you met a tight deadline.',
    'Describe your approach to managing multiple priorities.',
    'Tell me about a time you had to work with minimal supervision.',
  ],
}

const STAR_TIPS = [
  { icon: Target, title: 'Situation', text: 'Set the context. Where were you? What was your role?' },
  { icon: Zap, title: 'Task', text: 'What was your responsibility or challenge you faced?' },
  { icon: Lightbulb, title: 'Action', text: 'What specific steps did YOU take? Use "I", not "we"' },
  { icon: Star, title: 'Result', text: 'What was the outcome? Quantify with numbers if possible' },
]

function getShuffledArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export default function BehavioralTrainer() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [improved, setImproved] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTips, setShowTips] = useState(true)
  const [questionNumber, setQuestionNumber] = useState(1)
  const [sessionStats, setSessionStats] = useState({ practiced: 0, improved: 0 })
  
  const questionQueue = useRef<string[]>([])
  const currentCategory = useRef<string>('')
  const answerRef = useRef('')

  const { listening, transcript, start: startMic, stop: stopMic, supported: voiceSupported, setTranscript } = useSpeechRecognition()
  const { speak } = useSpeechSynthesis()

  useEffect(() => {
    if (transcript) {
      answerRef.current = transcript
      setAnswer(transcript)
    }
  }, [transcript])

  useEffect(() => {
    if (!listening && answerRef.current) {
      answerRef.current = ''
    }
  }, [listening])

  const selectCategory = (category: string) => {
    setSelectedCategory(category)
    currentCategory.current = category
    const questions = getShuffledArray(BEHAVIORAL_CATEGORIES[category])
    questionQueue.current = questions
    const firstQ = questionQueue.current.shift()
    if (firstQ) {
      setCurrentQuestion(firstQ)
      setQuestionNumber(1)
    }
    setAnswer('')
    setImproved(null)
    setError(null)
    setShowTips(true)
    speak(firstQ || '')
  }

  const nextQuestion = () => {
    const nextQ = questionQueue.current.shift()
    if (nextQ) {
      setCurrentQuestion(nextQ)
      setQuestionNumber((n) => n + 1)
      setAnswer('')
      setImproved(null)
      setShowTips(true)
      speak(nextQ)
      setSessionStats((s) => ({ ...s, practiced: s.practiced + 1 }))
    } else {
      const questions = getShuffledArray(BEHAVIORAL_CATEGORIES[currentCategory.current])
      questionQueue.current = questions.slice(1)
      const firstQ = questionQueue.current.shift()
      if (firstQ) {
        setCurrentQuestion(firstQ)
        setQuestionNumber(1)
        setAnswer('')
        setImproved(null)
        setShowTips(true)
        speak(firstQ)
      }
    }
  }

  const handleRewrite = async () => {
    if (!answer.trim()) return
    setError(null)
    setLoading(true)
    setImproved(null)
    try {
      const data = await improveAnswer(answer.trim())
      setImproved(data.improved)
      setShowTips(false)
      setSessionStats((s) => ({ ...s, improved: s.improved + 1 }))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Improve failed')
    } finally {
      setLoading(false)
    }
  }

  const toggleMic = () => {
    if (listening) {
      stopMic()
    } else {
      setTranscript('')
      answerRef.current = ''
      startMic()
    }
  }

  const resetSession = () => {
    setSelectedCategory(null)
    setCurrentQuestion(null)
    setAnswer('')
    setImproved(null)
    setSessionStats({ practiced: 0, improved: 0 })
    setQuestionNumber(1)
  }

  if (!selectedCategory) {
    return (
      <div className="p-6 lg:p-8">
        <Link to="/app" className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-muted)] hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white">Behavioral Interview Trainer</h1>
        <p className="mt-1 text-[var(--color-muted)]">Practice STAR method answers with real behavioral questions</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(BEHAVIORAL_CATEGORIES).map(([category, questions]) => (
            <Card 
              key={category}
              className="cursor-pointer hover:border-[var(--color-primary)]/40"
              onClick={() => selectCategory(category)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-white">{category}</p>
                  <p className="text-xs text-[var(--color-muted)]">{questions.length} questions</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={resetSession} className="text-[var(--color-muted)] hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-white">Behavioral Trainer</h1>
            <p className="text-sm text-[var(--color-muted)]">
              {selectedCategory} · Question {questionNumber}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-[var(--color-muted)]">
            Practiced: {sessionStats.practiced} | Improved: {sessionStats.improved}
          </div>
          <Button variant="ghost" size="sm" onClick={resetSession}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {currentQuestion && (
        <Card className="mt-4 bg-[var(--color-primary-muted)]/20 border-[var(--color-primary)]/30">
          <p className="text-lg font-medium text-white">{currentQuestion}</p>
        </Card>
      )}

      {showTips && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STAR_TIPS.map((tip) => (
            <div key={tip.title} className="flex gap-2 rounded-lg bg-[var(--color-surface)] p-3">
              <tip.icon className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
              <div>
                <p className="text-xs font-medium text-white">{tip.title}</p>
                <p className="text-xs text-[var(--color-muted)]">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-4 text-sm text-[var(--color-danger)]">{error}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Star className="h-5 w-5 text-[var(--color-primary)]" />
            Your Answer (STAR)
          </h2>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Start with: At my previous job... / In my current role... / During a project..."
            rows={8}
            className="mt-4 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]"
          />
          <div className="mt-4 flex gap-2">
            <Button 
              variant="primary" 
              onClick={handleRewrite} 
              disabled={!answer.trim() || loading}
            >
              {loading ? 'Improving...' : 'Improve with AI'}
            </Button>
            {voiceSupported && (
              <Button variant="ghost" onClick={toggleMic}>
                {listening ? <MicOff className="h-5 w-5 text-[var(--color-danger)]" /> : <Mic className="h-5 w-5" />}
              </Button>
            )}
            <Button variant="secondary" onClick={nextQuestion}>
              Skip / Next
            </Button>
          </div>
        </Card>
        <div className="lg:col-span-1">
          <LiveFeedback 
            isListening={listening} 
            transcript={transcript}
            onPause={() => stopMic()}
            onResume={() => startMic()}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5 text-[var(--color-accent)]" />
            AI-Improved Answer
          </h2>
          {!improved ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-[var(--color-muted)]">
                Write your answer and click "Improve with AI" to get a STAR-structured rewrite with better impact.
              </p>
              <div className="mt-4 rounded-lg bg-[var(--color-surface)] p-4 text-left">
                <p className="text-xs font-medium text-white">Pro tips:</p>
                <ul className="mt-2 space-y-1 text-xs text-[var(--color-muted)]">
                  <li>• Use specific numbers (e.g., "increased by 40%")</li>
                  <li>• Focus on YOUR actions, not just the team's</li>
                  <li>• Start with the result for impact</li>
                  <li>• Keep answers concise (1-2 minutes)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="whitespace-pre-wrap text-sm text-white leading-relaxed">{improved}</div>
              <Button 
                variant="secondary" 
                className="mt-4" 
                onClick={nextQuestion}
              >
                Next Question →
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
