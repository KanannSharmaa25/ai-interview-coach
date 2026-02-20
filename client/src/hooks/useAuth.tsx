import { createContext, useContext, useState, useCallback } from 'react'
import type { ReactNode } from 'react'

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  plan: 'free' | 'premium'
}

interface AuthContextValue {
  user: User | null
  login: (provider: 'google' | 'linkedin') => Promise<void>
  logout: () => void
  getIdToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'ai-interview-coach-user'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) try {
      return JSON.parse(stored) as User
    } catch { return null }
    return null
  })

  const getIdToken = useCallback(async (): Promise<string | null> => {
    return 'mock-token'
  }, [])

  const login = useCallback(async (provider: 'google' | 'linkedin') => {
    // Always use mock user for now (no Firebase)
    const mockUser: User = {
      id: Date.now().toString(),
      name: provider === 'google' ? 'Google User' : 'LinkedIn User',
      email: provider === 'google' ? 'user@gmail.com' : 'user@linkedin.com',
      plan: 'free',
    }
    setUser(mockUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
