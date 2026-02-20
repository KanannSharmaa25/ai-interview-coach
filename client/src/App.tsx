import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Interview from './pages/Interview'
import Feedback from './pages/Feedback'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import JobMatch from './pages/JobMatch'
import LearningPlan from './pages/LearningPlan'
import VideoPractice from './pages/VideoPractice'
import InterviewBanks from './pages/InterviewBanks'
import BehavioralTrainer from './pages/BehavioralTrainer'
import Analytics from './pages/Analytics'
import CodingMode from './pages/CodingMode'
import VoiceAssistant from './pages/VoiceAssistant'
import Settings from './pages/Settings'
import CareerCoach from './pages/CareerCoach'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="interview" element={<Interview />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
        <Route path="job-match" element={<JobMatch />} />
        <Route path="learning-plan" element={<LearningPlan />} />
        <Route path="video-practice" element={<VideoPractice />} />
        <Route path="interview-banks" element={<InterviewBanks />} />
        <Route path="behavioral" element={<BehavioralTrainer />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="coding" element={<CodingMode />} />
        <Route path="voice-assistant" element={<VoiceAssistant />} />
        <Route path="career-coach" element={<CareerCoach />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
