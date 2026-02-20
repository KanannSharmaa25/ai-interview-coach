import clsx from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        variant === 'primary' &&
          'bg-[var(--color-primary)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--color-primary-hover)]',
        variant === 'secondary' &&
          'bg-[var(--color-surface-elevated)] text-white border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]',
        variant === 'ghost' && 'text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-white',
        variant === 'danger' && 'bg-[var(--color-danger)]/20 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/30',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-4 py-2.5 text-sm',
        size === 'lg' && 'px-6 py-3 text-base',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
