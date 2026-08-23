type SkeletonProps = { className?: string; label?: string }

export function Skeleton({ className = '', label = 'Loading' }: SkeletonProps) {
  return <span aria-label={label} className={`block animate-pulse rounded bg-stone-200 dark:bg-stone-800 ${className}`} />
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return <div aria-label="Loading text" className="space-y-2">{Array.from({ length: lines }, (_, index) => <Skeleton className={`h-3 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`} key={index} />)}</div>
}

export function LoadingScreen({ label = 'Loading' }: { label?: string }) {
  return <main aria-label={label} className="grid min-h-48 place-items-center"><div className="flex items-center gap-3 text-sm font-bold"><span className="size-4 animate-spin rounded-full border-2 border-stone-300 border-t-amber-500" />{label}</div></main>
}
