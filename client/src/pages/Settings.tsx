import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import { 
  Shield, Palette, CreditCard, Bell, Globe, Target, Sparkles,
  Download, Trash2, Share2, HelpCircle, Mail
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { createCheckoutSession } from '../lib/api'

const ALL_ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Data Engineer',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Security Engineer',
  'QA Engineer',
  'Product Manager',
  'Product Designer',
  'UX Researcher',
  'Data Analyst',
  'Business Analyst',
  'Engineering Manager',
  'Solutions Architect',
  'Scrum Master',
  'Project Manager',
  'Technical Writer',
  'Consultant',
  'Marketing',
  'Sales',
  'HR',
  'Mobile Developer',
]

const LANGUAGES = [
  { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
  { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳' },
]

const VOICE_OPTIONS = [
  { id: 'default', name: 'Default Voice', desc: 'Standard system voice' },
  { id: 'natural', name: 'Natural Voice', desc: 'More human-like speech' },
  { id: 'professional', name: 'Professional', desc: 'Clear, formal tone' },
  { id: 'friendly', name: 'Friendly', desc: 'Warm, casual tone' },
]

const INTERVIEWER_AVATARS = [
  { id: 'neutral', name: 'Professional', emoji: '👔', desc: 'Neutral, balanced' },
  { id: 'friendly', name: 'Friendly', emoji: '😊', desc: 'Warm, encouraging' },
  { id: 'strict', name: 'Strict', emoji: '🎯', desc: 'Challenging' },
  { id: 'technical', name: 'Technical', emoji: '💻', desc: 'Deep diving' },
  { id: 'hr', name: 'HR Manager', emoji: '👤', desc: 'Culture focused' },
]

const COMPANY_PRESETS = [
  { id: 'faang', name: 'FAANG (Big Tech)', desc: 'Google, Meta, Amazon, Apple, Netflix' },
  { id: 'startup', name: 'Startup', desc: 'Fast-paced, versatile roles' },
  { id: 'enterprise', name: 'Enterprise/Corporate', desc: 'Traditional corporate culture' },
  { id: 'consulting', name: 'Consulting', desc: 'McKinsey, BCG, Bain style' },
  { id: 'finance', name: 'Finance/Banking', desc: 'Wall Street, investment banking' },
  { id: 'custom', name: 'Custom', desc: 'Create your own style' },
]

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [searchParams] = useSearchParams()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  
  const [targetRole, setTargetRole] = useState('Frontend Developer')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [language, setLanguage] = useState('en-US')
  const [voice, setVoice] = useState('natural')
  const [interviewerAvatar, setInterviewerAvatar] = useState('neutral')
  const [companyPreset, setCompanyPreset] = useState('faang')
  const [aiSpeakingRate, setAiSpeakingRate] = useState(0.9)
  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    weeklyProgress: true,
    newFeatures: false,
    emailUpdates: true,
  })
  const [privacy, setPrivacy] = useState({
    saveLocally: true,
    allowAnalytics: true,
    shareProgress: false,
    saveRecordings: false,
  })
  const [displaySettings, setDisplaySettings] = useState({
    showTranscripts: true,
    autoPlayAudio: true,
    compactMode: false,
    showTimer: true,
    enableAnimations: true,
  })

  useEffect(() => {
    const success = searchParams.get('success')
    const cancel = searchParams.get('cancel')
    if (success === '1') setMessage('Thank you! You now have Premium.')
    if (cancel === '1') setMessage('Checkout was cancelled.')
  }, [searchParams])

  const handleUpgrade = async () => {
    setCheckoutLoading(true)
    setMessage(null)
    try {
      const origin = window.location.origin
      const { url } = await createCheckoutSession(
        `${origin}/app/settings?success=1`,
        `${origin}/app/settings?cancel=1`
      )
      if (url) window.location.href = url
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Checkout unavailable')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const handleSave = () => {
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(null), 3000)
  }

  const handleExportData = () => {
    setMessage('Preparing your data for export...')
    setTimeout(() => setMessage('Data exported successfully!'), 1500)
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
      setMessage('All data cleared.')
      setTimeout(() => setMessage(null), 3000)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Settings</h1>
      <p className="mt-1 text-[var(--color-muted)]">Customize your interview preparation experience</p>

      {message && (
        <div className="mt-4 rounded-lg bg-[var(--color-primary-muted)]/20 border border-[var(--color-primary)]/30 p-3 text-sm text-[var(--color-primary)]">
          {message}
        </div>
      )}

      <div className="mt-6 space-y-6">
        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Target className="h-5 w-5 text-[var(--color-primary)]" />
            Target Role & Difficulty
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-white">Target Role</label>
              <select 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
              >
                {ALL_ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Difficulty Level</label>
              <select 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Company Preset</label>
              <select 
                value={companyPreset} 
                onChange={(e) => setCompanyPreset(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
              >
                {COMPANY_PRESETS.map(preset => (
                  <option key={preset.id} value={preset.id}>{preset.name}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
            AI Interviewer
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white">Interviewer Persona</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {INTERVIEWER_AVATARS.map(avatar => (
                  <button
                    key={avatar.id}
                    onClick={() => setInterviewerAvatar(avatar.id)}
                    className={`rounded-lg border p-2 text-center transition ${
                      interviewerAvatar === avatar.id 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary-muted)]' 
                        : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                    }`}
                  >
                    <span className="text-xl">{avatar.emoji}</span>
                    <p className="mt-1 text-xs text-white">{avatar.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">AI Speaking Rate</label>
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.1"
                value={aiSpeakingRate}
                onChange={(e) => setAiSpeakingRate(parseFloat(e.target.value))}
                className="mt-3 w-full"
              />
              <div className="flex justify-between text-xs text-[var(--color-muted)]">
                <span>Slower</span>
                <span>Current: {aiSpeakingRate}x</span>
                <span>Faster</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Globe className="h-5 w-5 text-[var(--color-primary)]" />
            Language & Voice
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white">Interface Language</label>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.flag} {lang.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white">AI Voice</label>
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-white focus:border-[var(--color-primary)] focus:outline-none"
              >
                {VOICE_OPTIONS.map(v => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Bell className="h-5 w-5 text-[var(--color-primary)]" />
            Notifications
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Daily practice reminders</span>
              <input 
                type="checkbox" 
                checked={notifications.dailyReminders}
                onChange={(e) => setNotifications({...notifications, dailyReminders: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Weekly progress reports</span>
              <input 
                type="checkbox" 
                checked={notifications.weeklyProgress}
                onChange={(e) => setNotifications({...notifications, weeklyProgress: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">New feature updates</span>
              <input 
                type="checkbox" 
                checked={notifications.newFeatures}
                onChange={(e) => setNotifications({...notifications, newFeatures: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Email updates</span>
              <input 
                type="checkbox" 
                checked={notifications.emailUpdates}
                onChange={(e) => setNotifications({...notifications, emailUpdates: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Shield className="h-5 w-5 text-[var(--color-primary)]" />
            Privacy & Data
          </h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="text-sm text-white">Save practice history locally</span>
                <p className="text-xs text-[var(--color-muted)]">Data stays on your device</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacy.saveLocally}
                onChange={(e) => setPrivacy({...privacy, saveLocally: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="text-sm text-white">Allow analytics for improvement tips</span>
                <p className="text-xs text-[var(--color-muted)]">Helps personalize recommendations</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacy.allowAnalytics}
                onChange={(e) => setPrivacy({...privacy, allowAnalytics: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="text-sm text-white">Share progress with peers</span>
                <p className="text-xs text-[var(--color-muted)]">Compare with others anonymously</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacy.shareProgress}
                onChange={(e) => setPrivacy({...privacy, shareProgress: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <div>
                <span className="text-sm text-white">Save interview recordings</span>
                <p className="text-xs text-[var(--color-muted)]">Review your practice sessions later</p>
              </div>
              <input 
                type="checkbox" 
                checked={privacy.saveRecordings}
                onChange={(e) => setPrivacy({...privacy, saveRecordings: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
          </div>
          <div className="mt-4 flex gap-3">
            <Button variant="secondary" size="sm" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClearData} className="text-[var(--color-danger)]">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All Data
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Palette className="h-5 w-5 text-[var(--color-primary)]" />
            Display Settings
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Show transcripts</span>
              <input 
                type="checkbox" 
                checked={displaySettings.showTranscripts}
                onChange={(e) => setDisplaySettings({...displaySettings, showTranscripts: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Auto-play AI audio</span>
              <input 
                type="checkbox" 
                checked={displaySettings.autoPlayAudio}
                onChange={(e) => setDisplaySettings({...displaySettings, autoPlayAudio: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Show timer</span>
              <input 
                type="checkbox" 
                checked={displaySettings.showTimer}
                onChange={(e) => setDisplaySettings({...displaySettings, showTimer: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
            <label className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <span className="text-sm text-white">Enable animations</span>
              <input 
                type="checkbox" 
                checked={displaySettings.enableAnimations}
                onChange={(e) => setDisplaySettings({...displaySettings, enableAnimations: e.target.checked})}
                className="h-4 w-4 rounded" 
              />
            </label>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Palette className="h-5 w-5 text-[var(--color-primary)]" />
            Theme
          </h2>
          <div className="mt-4 flex gap-2">
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme('dark')}
            >
              Dark
            </Button>
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme('light')}
            >
              Light
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <CreditCard className="h-5 w-5 text-[var(--color-primary)]" />
            Subscription
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Free tier: limited mocks. Premium: full AI analysis, unlimited practice, and advanced features.
          </p>
          <div className="mt-4 flex gap-2">
            <Button variant="secondary" size="sm">
              {user?.plan === 'premium' ? 'Premium' : 'Free'} (current)
            </Button>
            {user?.plan !== 'premium' && (
              <Button variant="primary" size="sm" onClick={handleUpgrade} disabled={checkoutLoading}>
                {checkoutLoading ? 'Redirecting…' : 'Upgrade to Premium'}
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <HelpCircle className="h-5 w-5 text-[var(--color-primary)]" />
            Support
          </h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </Button>
            <Button variant="secondary" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
            <Button variant="secondary" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share App
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
