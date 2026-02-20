interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
  className?: string
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  label = 'Score',
  className = '',
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const pct = Math.min(100, Math.max(0, score))
  const offset = circumference - (pct / 100) * circumference
  const color = pct >= 70 ? 'var(--color-success)' : pct >= 40 ? 'var(--color-warning)' : 'var(--color-danger)'

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-2xl font-bold text-white">{Math.round(pct)}</span>
        <span className="text-xs text-[var(--color-muted)]">{label}</span>
      </div>
    </div>
  )
}
