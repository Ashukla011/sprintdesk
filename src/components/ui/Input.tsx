import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }

export function Input({ id, label, error, className = '', ...props }: InputProps) {
  return <label className="block text-sm font-bold" htmlFor={id}>{label}{' '}<input aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} className={`mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 font-normal text-stone-950 outline-none placeholder:text-stone-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-950 dark:text-white dark:placeholder:text-stone-400 ${className}`} id={id} {...props} />{error && <span className="mt-1 block text-xs font-semibold text-rose-600" id={`${id}-error`}>{error}</span>}</label>
}
