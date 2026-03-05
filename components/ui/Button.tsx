import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  href?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-[#1E3A8A] text-white hover:bg-blue-800 active:scale-95 focus:ring-blue-500 shadow-md hover:shadow-lg hover:-translate-y-0.5',
      secondary: 'bg-[#FBBF24] text-[#1E3A8A] hover:bg-amber-400 active:scale-95 focus:ring-amber-400 shadow-md hover:shadow-lg hover:-translate-y-0.5',
      outline: 'border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white active:scale-95 focus:ring-blue-500',
      ghost: 'text-[#1E3A8A] hover:bg-blue-50 active:scale-95 focus:ring-blue-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-95 focus:ring-red-500',
    }

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }

    return (
      <button
        ref={ref}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
