import clsx from 'clsx'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  showValue?: boolean
  className?: string
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  variant = 'default',
  showValue = true,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={clsx('space-y-1', className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-[var(--color-muted)]">{label}</span>}
          {showValue && <span className="font-medium text-white">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            variant === 'default' && 'bg-[var(--color-primary)]',
            variant === 'success' && 'bg-[var(--color-success)]',
            variant === 'warning' && 'bg-[var(--color-warning)]',
            variant === 'danger' && 'bg-[var(--color-danger)]'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
