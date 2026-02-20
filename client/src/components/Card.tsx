import clsx from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export default function Card({ children, className, padding = 'md', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-soft)]',
        padding === 'none' && 'p-0',
        padding === 'sm' && 'p-4',
        padding === 'md' && 'p-5',
        padding === 'lg' && 'p-6',
        onClick && 'cursor-pointer hover:border-[var(--color-primary)]/40 transition-colors',
        className
      )}
    >
      {children}
    </div>
  )
}
