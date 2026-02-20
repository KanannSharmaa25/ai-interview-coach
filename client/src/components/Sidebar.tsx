import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import {
  LayoutDashboard,
  MessageCircle,
  FileText,
  BarChart3,
  Settings,
  Briefcase,
  BookOpen,
  Video,
  Library,
  Star,
  Code,
  Mic,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

const nav = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/interview', label: 'Interview', icon: MessageCircle },
  { to: '/app/resume', label: 'Resume', icon: FileText },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/career-coach', label: 'Career Coach', icon: Sparkles },
  { to: '/app/job-match', label: 'Job Match', icon: Briefcase },
  { to: '/app/learning-plan', label: 'Learning Plan', icon: BookOpen },
  { to: '/app/video-practice', label: 'Video Practice', icon: Video },
  { to: '/app/interview-banks', label: 'Interview Banks', icon: Library },
  { to: '/app/behavioral', label: 'Behavioral', icon: Star },
  { to: '/app/coding', label: 'Coding', icon: Code },
  { to: '/app/voice-assistant', label: 'Voice', icon: Mic },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar() {
  const { user, logout } = useAuth()

  return (
    <aside className="flex w-56 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="flex h-14 items-center gap-2 border-b border-[var(--color-border)] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)] text-white font-semibold">
          AI
        </div>
        <span className="font-semibold text-white">Interview Coach</span>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {nav.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-[var(--color-border)] p-3">
        <div className="flex items-center gap-2 rounded-lg bg-[var(--color-surface-hover)] px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-sm font-medium text-white">
            {user?.name?.charAt(0) ?? 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-[var(--color-muted)]">{user?.plan}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-2 w-full rounded-lg py-2 text-sm text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
