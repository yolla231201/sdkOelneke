import { clsx } from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'publish' | 'draft' | 'info' | 'success' | 'warning' | 'danger'
  className?: string
}

export default function Badge({ children, variant = 'info', className }: BadgeProps) {
  const variants = {
    publish: 'bg-emerald-100 text-emerald-700',
    draft: 'bg-slate-100 text-slate-600',
    info: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
  }

  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
