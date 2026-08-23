import { useEffect, type ReactNode } from 'react'

type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode }

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!open) return null
  return <div aria-modal="true" className="fixed inset-0 z-50 grid place-items-center bg-stone-950/50 p-4" role="dialog"><button aria-label="Close modal" className="absolute inset-0 cursor-default" onClick={onClose} type="button" /><section aria-labelledby="modal-title" className="relative z-10 w-full max-w-lg rounded-lg border border-stone-200 bg-white p-6 shadow-xl dark:border-stone-800 dark:bg-stone-900"><div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-black" id="modal-title">{title}</h2><button aria-label="Close modal" className="rounded p-2 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800" onClick={onClose} type="button">X</button></div>{children}</section></div>
}
