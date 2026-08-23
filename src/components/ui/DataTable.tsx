import type { ReactNode } from 'react'

type DataTableColumn<T> = { key: string; header: string; render: (row: T) => ReactNode }
type DataTableProps<T> = { columns: DataTableColumn<T>[]; data: T[]; rowKey: (row: T) => string | number; emptyMessage?: string }

export function DataTable<T>({ columns, data, rowKey, emptyMessage = 'No records found.' }: DataTableProps<T>) {
  return <div className="overflow-x-auto rounded-md border border-stone-200 dark:border-stone-800"><table className="min-w-full divide-y divide-stone-200 text-left text-sm dark:divide-stone-800"><thead className="bg-stone-50 dark:bg-stone-900"><tr>{columns.map((column) => <th className="whitespace-nowrap px-4 py-3 font-black" key={column.key} scope="col">{column.header}</th>)}</tr></thead><tbody className="divide-y divide-stone-200 bg-white dark:divide-stone-800 dark:bg-stone-950">{data.length ? data.map((row) => <tr className="hover:bg-stone-50 dark:hover:bg-stone-900" key={rowKey(row)}>{columns.map((column) => <td className="whitespace-nowrap px-4 py-3" key={column.key}>{column.render(row)}</td>)}</tr>) : <tr><td className="px-4 py-8 text-center text-stone-500" colSpan={columns.length}>{emptyMessage}</td></tr>}</tbody></table></div>
}
