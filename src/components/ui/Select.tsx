import type { SelectHTMLAttributes } from 'react'

type SelectOption = { label: string; value: string }
type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: SelectOption[] }

export function Select({ id, label, options, className = '', ...props }: SelectProps) {
  return <label className="block text-sm font-bold" htmlFor={id}>{label}{' '}<select className={`mt-2 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 font-normal text-stone-950 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 dark:border-stone-700 dark:bg-stone-950 dark:text-white ${className}`} id={id} {...props}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
}
