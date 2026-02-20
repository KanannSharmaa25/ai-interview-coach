import { useState, useRef, useEffect, useCallback } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'
import LiveFeedback from '../components/LiveFeedback'
import { Video, VideoOff, Circle, Camera } from 'lucide-react'
import { useSpeechRecognition } from '../hooks/useSpeech'

export default function VideoPractice() {
  const [cameraPrompt, setCameraPrompt] = useState<'idle' | 'allowed' | 'rejected'>('idle')
  const [recording, setRecording] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  
  const { listening, transcript, start, stop } = useSpeechRecognition()

  const setVideoRef = useCallback((el: HTMLVideoElement | null) => {
    videoRef.current = el
    if (el && stream) {
      el.srcObject = stream
      el.play().catch(() => {})
    }
  }, [stream])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      videoRef.current.play().catch(() => {})
    }
  }, [stream])

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [stream])

  const handleAllowCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(mediaStream)
      setCameraPrompt('allowed')
    } catch (err) {
      setCameraPrompt('rejected')
    }
  }

  const handleRejectCamera = () => {
    setCameraPrompt('rejected')
  }

  const handleStopCamera = () => {
    stream?.getTracks().forEach((t) => t.stop())
    setStream(null)
    setRecording(false)
    setCameraPrompt('idle')
  }

  const toggleRecording = () => {
    if (recording) {
      setRecording(false)
      stop()
    } else if (cameraPrompt === 'allowed') {
      setRecording(true)
      start()
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Video Interview Practice</h1>
      <p className="mt-1 text-[var(--color-muted)]">Record yourself — AI analyzes eye contact, filler words, and pace</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Record</h2>

          {cameraPrompt === 'idle' && (
            <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
              <Camera className="mx-auto h-12 w-12 text-[var(--color-primary)]" />
              <p className="mt-3 text-sm text-white">This feature uses your camera and microphone.</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">Choose whether to allow access.</p>
              <div className="mt-4 flex justify-center gap-3">
                <Button variant="primary" onClick={handleAllowCamera}>
                  Allow camera
                </Button>
                <Button variant="secondary" onClick={handleRejectCamera}>
                  Don&apos;t allow
                </Button>
              </div>
            </div>
          )}

          {cameraPrompt === 'rejected' && (
            <div className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
              <VideoOff className="mx-auto h-12 w-12 text-[var(--color-muted)]" />
              <p className="mt-3 text-sm text-[var(--color-muted)]">Camera access was denied or is unavailable.</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">You can try again or use another device.</p>
              <Button variant="secondary" className="mt-4" onClick={() => setCameraPrompt('idle')}>
                Ask again
              </Button>
            </div>
          )}

          {cameraPrompt === 'allowed' && (
            <>
              <div className="mt-4 flex aspect-video items-center justify-center overflow-hidden rounded-xl border border-[var(--color-border)] bg-black">
                <div className="relative h-full w-full min-h-[200px]">
                  <video
                    ref={setVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {recording && (
                    <div className="absolute right-2 top-2 flex items-center gap-1 rounded bg-red-600/90 px-2 py-1 text-xs text-white">
                      <Circle className="h-2 w-2 animate-pulse fill-current" /> Recording
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button
                  variant={recording ? 'danger' : 'primary'}
                  className="flex-1"
                  onClick={toggleRecording}
                >
                  {recording ? <><VideoOff className="mr-2 h-5 w-5" /> Stop</> : <><Video className="mr-2 h-5 w-5" /> Start recording</>}
                </Button>
                <Button variant="ghost" onClick={handleStopCamera}>
                  Turn off camera
                </Button>
              </div>
            </>
          )}
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Live Analysis</h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {recording ? 'Recording and analyzing your responses...' : 'Start recording to see live feedback'}
          </p>
          
          {recording && (
            <div className="mt-4 space-y-2">
              <ProgressBar label="Eye contact" value={75} showValue={true} />
              <ProgressBar label="Posture" value={80} showValue={true} />
            </div>
          )}
          
          <div className="mt-4">
            <LiveFeedback 
              isListening={recording && listening} 
              transcript={transcript}
              onPause={stop}
              onResume={start}
            />
          </div>
        </Card>
      </div>
    </div>
  )
}
