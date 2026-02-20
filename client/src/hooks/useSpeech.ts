import { useState, useCallback, useRef, useEffect } from 'react'

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

interface SpeechRecognition {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
  start: () => void
  stop: () => void
  abort: () => void
}

const SpeechRecognitionAPI = typeof window !== 'undefined'
  ? (window.SpeechRecognition || window.webkitSpeechRecognition)
  : null

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setSupported(!!SpeechRecognitionAPI)
  }, [])

  const start = useCallback(async () => {
    if (!SpeechRecognitionAPI) {
      setError('Speech recognition not supported in this browser')
      return
    }

    setError(null)
    setTranscript('')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      setError('Microphone access denied. Please allow microphone permissions.')
      return
    }

    const rec = new SpeechRecognitionAPI()
    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'
    rec.maxAlternatives = 1

    rec.onstart = () => {
      setListening(true)
      setError(null)
    }

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscript += result[0].transcript
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (finalTranscript) {
        setTranscript((prev) => prev + (prev ? ' ' : '') + finalTranscript)
      } else if (interimTranscript) {
        setTranscript(interimTranscript)
      }
    }

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      if (event.error === 'no-speech') {
        setError('No speech detected. Try again.')
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow permissions.')
      } else if (event.error === 'network') {
        setError('Network error. Check your connection.')
      } else {
        setError(`Speech error: ${event.error}`)
      }
      setListening(false)
    }

    rec.onend = () => {
      setListening(false)
    }

    try {
      rec.start()
      recognitionRef.current = rec
    } catch (err) {
      console.error('Failed to start recognition:', err)
      setError('Could not start speech recognition')
    }
  }, [])

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (err) {
        console.error('Error stopping recognition:', err)
      }
      recognitionRef.current = null
    }
    setListening(false)
  }, [])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [])

  return { 
    listening, 
    transcript, 
    error, 
    start, 
    stop, 
    supported,
    setTranscript 
  }
}

export function useSpeechSynthesis() {
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
      }
    }

    loadVoices()
    
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1

    const englishVoice = voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) 
      || voices.find((v) => v.lang.startsWith('en') && v.name.includes('Microsoft'))
      || voices.find((v) => v.lang.startsWith('en'))
      || voices[0]

    if (englishVoice) {
      utterance.voice = englishVoice
    }

    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }, [voices])

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    setSpeaking(false)
  }, [])

  return { speak, stop, speaking }
}
