import { useEffect, useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type NavItem = {
	label: string
	icon: string
	path: string
}

const navItems: NavItem[] = [
	{ label: 'Overview', icon: 'O', path: '/dashboard' },
	{ label: 'Board', icon: 'B', path: '/board' },
	{ label: 'Analytics', icon: 'A', path: '/analytics' },
]

type AppShellProps = {
	children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const [isDark, setIsDark] = useState(() =>
		document.documentElement.classList.contains('dark'),
	)

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDark)
	}, [isDark])

	return (
		<div className="min-h-screen bg-stone-50 text-stone-950 transition-colors dark:bg-stone-950 dark:text-stone-50">
			{isSidebarOpen && (
				<button
					aria-label="Close navigation"
					className="fixed inset-0 z-20 bg-stone-950/40 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
					type="button"
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-30 flex w-72 flex-col border-r border-stone-200 bg-white px-5 py-6 transition-transform dark:border-stone-800 dark:bg-stone-900 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
			>
				<div className="flex items-center justify-between px-2">
					<a className="flex items-center gap-3" href="#overview">
						<span className="grid size-10 place-items-center bg-amber-400 text-lg font-black text-stone-950">S</span>
						<span>
							<span className="block text-lg font-black tracking-tight">SprintDesk</span>
							<span className="block text-xs font-medium text-stone-500 dark:text-stone-400">Team workspace</span>
						</span>
					</a>
					<button
						aria-label="Close navigation"
						className="rounded-md p-2 text-stone-500 hover:bg-stone-100 lg:hidden dark:hover:bg-stone-800"
						onClick={() => setIsSidebarOpen(false)}
						type="button"
					>
						X
					</button>
				</div>

				<div className="mt-10 rounded-lg border border-stone-200 bg-stone-50 p-4 dark:border-stone-700 dark:bg-stone-800/60">
					<div className="flex items-center justify-between">
						<span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Current sprint</span>
						<span className="size-2 rounded-full bg-emerald-500" />
					</div>
					<p className="mt-2 font-bold">Sprint 24</p>
					<div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
						<div className="h-full w-3/5 bg-amber-400" />
					</div>
					<p className="mt-2 text-xs text-stone-500 dark:text-stone-400">12 of 20 points complete</p>
				</div>

				<nav aria-label="Primary navigation" className="mt-8 space-y-1">
					{navItems.map((item) => (
						<NavLink
							className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold transition-colors ${isActive ? 'bg-stone-950 text-white dark:bg-amber-400 dark:text-stone-950' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white'}`}
							to={item.path}
							key={item.label}
							onClick={() => {
								setIsSidebarOpen(false)
							}}
						>
							<span aria-hidden="true" className="grid size-6 place-items-center border border-current text-xs font-black">{item.icon}</span>
							{item.label}
						</NavLink>
					))}
				</nav>

				<div className="mt-auto border-t border-stone-200 pt-5 dark:border-stone-800">
					<div className="flex items-center gap-3 px-2">
						<span className="grid size-9 place-items-center rounded-full bg-sky-100 text-sm font-bold text-sky-800">JD</span>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-bold">Jordan Davis</p>
							<p className="truncate text-xs text-stone-500 dark:text-stone-400">Product engineer</p>
						</div>
						<button aria-label="Open account menu" className="text-stone-500" type="button">...</button>
					</div>
				</div>
			</aside>

			<div className="lg:pl-72">
				<header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-stone-200 bg-stone-50/95 px-5 backdrop-blur dark:border-stone-800 dark:bg-stone-950/95 sm:px-8">
					<div className="flex items-center gap-4">
						<button aria-label="Open navigation" className="rounded-md border border-stone-200 bg-white px-3 py-2 font-bold lg:hidden dark:border-stone-700 dark:bg-stone-900" onClick={() => setIsSidebarOpen(true)} type="button">Menu</button>
						<div>
							<p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">Workspace</p>
							<h1 className="text-xl font-black tracking-tight">Good morning, Jordan</h1>
						</div>
					</div>
					<div className="flex items-center gap-2 sm:gap-4">
						<button aria-label="Toggle dark mode" className="rounded-md border border-stone-200 bg-white px-3 py-2 text-sm font-bold hover:border-stone-400 dark:border-stone-700 dark:bg-stone-900" onClick={() => setIsDark((value) => !value)} type="button">
							{isDark ? 'Light' : 'Dark'}
						</button>
						<button aria-label="View notifications" className="relative grid size-10 place-items-center rounded-md border border-stone-200 bg-white text-lg dark:border-stone-700 dark:bg-stone-900" type="button">
							!<span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
						</button>
					</div>
				</header>
				<main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">{children}</main>
			</div>
		</div>
	)
}
