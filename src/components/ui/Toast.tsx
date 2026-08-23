import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { ToastContext, type Toast } from './toastContext'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const toast = useCallback((message: string, tone: Toast['tone'] = 'info') => setItems((current) => [...current, { id: Date.now() + Math.random(), message, tone }]), [])
  const dismiss = useCallback((id: number) => setItems((current) => current.filter((item) => item.id !== id)), [])
  const value = useMemo(() => ({ toast, dismiss }), [dismiss, toast])
  return <ToastContext.Provider value={value}>{children}<div aria-label="Notifications" className="fixed bottom-5 right-5 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">{items.map((item) => <div className="flex items-center justify-between gap-3 rounded-md border border-stone-200 bg-white p-4 text-sm font-semibold shadow-lg dark:border-stone-700 dark:bg-stone-900" key={item.id} role="status"><span>{item.message}</span><button aria-label={`Dismiss ${item.message}`} className="text-stone-500" onClick={() => dismiss(item.id)} type="button">X</button></div>)}</div></ToastContext.Provider>
}
