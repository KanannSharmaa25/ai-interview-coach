import { useState, useEffect, useRef } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import LiveFeedback from '../components/LiveFeedback'
import { Mic, MicOff, Search, MessageSquare, Volume2, VolumeX, RefreshCw } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeech'
import { useSpeechSynthesis } from '../hooks/useSpeech'

const EXAMPLE_RESPONSES = [
  "That's a great question! In a full implementation, I'd provide a detailed response based on your interview goals.",
  "I understand. Let me help you with that. What specific area would you like to practice?",
  "Thanks for sharing! That's the kind of answer that shows real experience.",
  "I see. Let's try to make that even stronger using the STAR method.",
  "Good start! Can you tell me more about the outcome of that situation?",
]

export default function VoiceAssistant() {
  const { listening, transcript, error, start, stop, supported, setTranscript } = useSpeechRecognition()
  const { speak, speaking } = useSpeechSynthesis()
  const [log, setLog] = useState<{ role: 'user' | 'assistant'; text: string }[]>([])
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing'>('idle')
  const lastTranscriptRef = useRef('')
  const processingRef = useRef(false)

  useEffect(() => {
    if (!listening && lastTranscriptRef.current && !processingRef.current) {
      const finalText = lastTranscriptRef.current.trim()
      if (finalText) {
        setLog((l) => [...l, { role: 'user', text: finalText }])
        
        setStatus('processing')
        const response = EXAMPLE_RESPONSES[Math.floor(Math.random() * EXAMPLE_RESPONSES.length)]
        
        setTimeout(() => {
          speak(response)
          setLog((l) => [...l, { role: 'assistant', text: response }])
          setStatus('idle')
        }, 500)
      }
      lastTranscriptRef.current = ''
    }
  }, [listening, speak])

  useEffect(() => {
    if (transcript) {
      lastTranscriptRef.current = transcript
      setStatus('listening')
    }
  }, [transcript])

  const toggleListening = async () => {
    if (listening) {
      stop()
      setStatus('idle')
    } else {
      setTranscript('')
      lastTranscriptRef.current = ''
      await start()
    }
  }

  const handleClear = () => {
    setLog([])
    setTranscript('')
    lastTranscriptRef.current = ''
    setStatus('idle')
  }

  const handleTestVoice = () => {
    speak("Hello! This is a test of the text to speech system. Your voice assistant is working correctly.")
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Voice Assistant</h1>
          <p className="mt-1 text-[var(--color-muted)]">Speech-to-text practice with voice feedback</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={handleTestVoice} title="Test voice">
            {speaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} title="Clear">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 p-3">
          <p className="text-sm text-[var(--color-danger)]">{error}</p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">Make sure you've granted microphone permissions in your browser.</p>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="flex flex-col items-center justify-center py-12">
          <button
            type="button"
            onClick={toggleListening}
            disabled={!supported}
            className={`flex h-28 w-28 items-center justify-center rounded-full transition-all duration-300 ${
              listening 
                ? 'bg-[var(--color-danger)] text-white animate-pulse shadow-lg shadow-[var(--color-danger)]/30' 
                : 'bg-[var(--color-primary-muted)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white hover:scale-105'
            } disabled:opacity-50 disabled:hover:scale-100`}
          >
            {listening ? <MicOff className="h-12 w-12" /> : <Mic className="h-12 w-12" />}
          </button>
          
          <div className="mt-6 text-center">
            {!supported ? (
              <p className="text-sm text-[var(--color-danger)]">
                Speech recognition not supported.<br />
                <span className="text-xs">Use Chrome, Edge, or Safari on desktop.</span>
              </p>
            ) : status === 'processing' ? (
              <p className="text-sm text-[var(--color-accent)]">Processing...</p>
            ) : (
              <p className="text-sm text-[var(--color-muted)]">
                {listening ? 'Listening... Tap to stop' : 'Tap to start speaking'}
              </p>
            )}
          </div>

          {(transcript || lastTranscriptRef.current) && (
            <div className="mt-4 max-w-xs rounded-lg bg-[var(--color-surface)] p-3 text-center">
              <p className="text-sm text-white">{lastTranscriptRef.current || transcript}</p>
            </div>
          )}

          {listening && (
            <div className="mt-4 flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-primary)]" style={{ animationDelay: '0ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-primary)]" style={{ animationDelay: '150ms' }} />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--color-primary)]" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </Card>
        
        <div className="space-y-6">
          <Card>
            <h2 className="text-lg font-semibold text-white">Features</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
              <li className="flex items-start gap-2">
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                <span>Practice interview answers with voice input</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                <span>Get AI feedback on your responses</span>
              </li>
              <li className="flex items-start gap-2">
                <Volume2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-primary)]" />
                <span>Hear the AI speak responses aloud</span>
              </li>
            </ul>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-white">Tips</h2>
            <ul className="mt-3 space-y-2 text-xs text-[var(--color-muted)]">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Use Chrome or Edge for best results</li>
              <li>• Allow microphone access when prompted</li>
              <li>• Make sure you're in a quiet environment</li>
            </ul>
          </Card>

          <LiveFeedback 
            isListening={listening} 
            transcript={transcript}
            onPause={() => stop()}
            onResume={() => start()}
          />
        </div>
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-white">Conversation</h2>
        <div className="mt-3 max-h-64 space-y-3 overflow-y-auto">
          {log.length === 0 && (
            <p className="py-4 text-center text-sm text-[var(--color-muted)]">
              Tap the microphone and start speaking to begin your practice session.
            </p>
          )}
          {log.map((entry, i) => (
            <div key={i} className={`flex ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                entry.role === 'user' 
                  ? 'bg-[var(--color-primary-muted)] text-white' 
                  : 'bg-[var(--color-surface)] text-white border border-[var(--color-border)]'
              }`}>
                <p className="text-xs font-medium mb-1 opacity-60">{entry.role === 'user' ? 'You' : 'AI Assistant'}</p>
                <p className="text-sm">{entry.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
