import { clsx } from 'clsx'

interface SectionTitleProps {
  label?: string
  title: string
  subtitle?: string
  center?: boolean
  light?: boolean
  className?: string
}

export default function SectionTitle({ label, title, subtitle, center = false, light = false, className }: SectionTitleProps) {
  return (
    <div className={clsx('mb-10', center && 'text-center', className)}>
      {label && (
        <span className={clsx(
          'inline-block mb-3 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full',
          light ? 'bg-white/20 text-white' : 'bg-blue-100 text-[#1E3A8A]'
        )}>
          {label}
        </span>
      )}
      <h2 className={clsx(
        'font-display font-bold text-3xl md:text-4xl leading-tight',
        light ? 'text-white' : 'text-slate-900'
      )}>
        {title}
      </h2>
      {subtitle && (
        <p className={clsx(
          'mt-3 text-base md:text-lg max-w-2xl',
          center && 'mx-auto',
          light ? 'text-blue-100' : 'text-slate-500'
        )}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
