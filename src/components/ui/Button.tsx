import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }

const variants = {
  primary: 'border border-stone-300 bg-white text-stone-950 hover:bg-stone-100 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-700',
  secondary: 'border border-stone-300 bg-white text-stone-900 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-white dark:hover:bg-stone-800',
  danger: 'border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-950/40',
  ghost: 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800',
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return <button className={`inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />
}
