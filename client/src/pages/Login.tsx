import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../hooks/useAuth'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOAuth = async (provider: 'google' | 'linkedin') => {
    setLoading(true)
    setError(null)
    try {
      await login(provider)
      navigate('/app', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-surface)] px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-primary-muted)] opacity-50 pointer-events-none" />
      <Card className="relative z-10 w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary)] font-semibold text-white">
            AI
          </div>
          <h1 className="text-xl font-semibold text-white">Sign in to Interview Coach</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Use Google or LinkedIn to get started quickly.
          </p>
        </div>
        
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => handleOAuth('google')}
            disabled={loading}
          >
            <Mail className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Continue with Google'}
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => handleOAuth('linkedin')}
            disabled={loading}
          >
            <Lock className="mr-2 h-5 w-5" />
            {loading ? 'Signing in...' : 'Continue with LinkedIn'}
          </Button>
        </div>
        <p className="mt-4 text-center text-xs text-[var(--color-muted)]">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </Card>
      <Link to="/" className="mt-6 text-sm text-[var(--color-muted)] hover:text-white">
        ← Back to home
      </Link>
    </div>
  )
}
