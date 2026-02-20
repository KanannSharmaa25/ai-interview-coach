import { useEffect, useState } from 'react'
import Card from '../components/Card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'
import { getAnalyticsOverview } from '../lib/api'

interface InterviewItem {
  id: string
  role: string
  startedAt: string
  feedback: unknown
}

export default function Analytics() {
  const [trendData, setTrendData] = useState<{ week: string; score: number }[]>([])
  const [heatmapData, setHeatmapData] = useState<{ topic: string; score: number; fill: string }[]>([])
  const [history, setHistory] = useState<InterviewItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalyticsOverview()
      .then((d) => {
        const weak = (d.weakTopics || []).map((t: { name: string; score: number }) => ({
          topic: t.name,
          score: t.score,
          fill: t.score >= 70 ? '#34d399' : t.score >= 50 ? '#fbbf24' : '#f87171',
        }))
        setHeatmapData(weak.length ? weak : [{ topic: 'General', score: d.readinessScore || 0, fill: '#6366f1' }])
        const interviews = (d.interviews || []) as InterviewItem[]
        setHistory(interviews)
        if (interviews.length >= 2) {
          const trend = interviews.slice(0, 8).map((i, idx) => {
            const f = i.feedback as { technicalScore?: number; communicationScore?: number } | null
            const s = f ? ((f.technicalScore ?? 0) + (f.communicationScore ?? 0)) / 2 : 0
            return { week: `W${idx + 1}`, score: Math.round(s) || 0 }
          })
          setTrendData(trend)
        } else {
          setTrendData([{ week: 'W1', score: d.readinessScore || 0 }])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-white">Progress Analytics</h1>
      <p className="mt-1 text-[var(--color-muted)]">Improvement graph, weak topic heatmap, interview history</p>

      <div className="mt-6">
        <Card>
          <h2 className="text-lg font-semibold text-white">Improvement over time</h2>
          <div className="h-64 w-full mt-4">
            {loading ? (
              <div className="flex h-full items-center justify-center text-[var(--color-muted)]">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData.length ? trendData : [{ week: 'W1', score: 0 }]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" stroke="var(--color-muted)" fontSize={12} />
                  <YAxis stroke="var(--color-muted)" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-surface-elevated)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}
                    labelStyle={{ color: 'var(--color-muted)' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: 'var(--color-primary)' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Weak topic heatmap</h2>
          <div className="mt-4 h-48">
            {loading ? (
              <div className="flex h-full items-center justify-center text-[var(--color-muted)]">Loading…</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={heatmapData} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis type="number" domain={[0, 100]} stroke="var(--color-muted)" fontSize={12} />
                  <YAxis type="category" dataKey="topic" stroke="var(--color-muted)" fontSize={12} width={70} />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {heatmapData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Interview history</h2>
          <div className="mt-4 space-y-2">
            {loading ? (
              <p className="text-sm text-[var(--color-muted)]">Loading…</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">No interviews yet.</p>
            ) : (
              history.map((h) => {
                const f = h.feedback as { communicationScore?: number } | null
                const score = f?.communicationScore ?? 0
                return (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
                    <div>
                      <p className="font-medium text-white">Mock · {h.role}</p>
                      <p className="text-xs text-[var(--color-muted)]">{new Date(h.startedAt).toLocaleDateString()}</p>
                    </div>
                    <span className="font-semibold text-[var(--color-primary)]">{score}%</span>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
