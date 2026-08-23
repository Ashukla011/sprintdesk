import { createContext } from 'react'

export type Toast = { id: number; message: string; tone: 'info' | 'success' | 'error' }
export type ToastContextValue = { toast: (message: string, tone?: Toast['tone']) => void; dismiss: (id: number) => void }
export const ToastContext = createContext<ToastContextValue | null>(null)