import { AppShell } from './components/Layout/AppShell'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AnalyticPage } from './pages/AnalyticPage'
import { BoardPage } from './pages/BoardPage'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'

function LoadingScreen() {
  return <main aria-label="Validating session" className="grid min-h-screen place-items-center bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-50"><p className="font-bold">Validating session...</p></main>
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />} path="/login" />
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<BoardPage />} path="/board" />
          <Route element={<AnalyticPage />} path="/analytics" />
        </Route>
      </Route>
      <Route element={<Navigate replace to="/dashboard" />} path="*" />
    </Routes>
  )
}

function AuthGate() {
  const status = useAuthStore((state) => state.status)
  const initialize = useAuthStore((state) => state.initialize)

  useEffect(() => {
    void initialize()
  }, [initialize])

  if (status === 'loading') return <LoadingScreen />
  return <AppRoutes />
}

function ProtectedRoute() {
  const status = useAuthStore((state) => state.status)
  return status === 'authenticated' ? <Outlet /> : <Navigate replace to="/login" />
}

function PublicRoute() {
  const status = useAuthStore((state) => state.status)
  return status === 'authenticated' ? <Navigate replace to="/dashboard" /> : <LoginPage />
}

function WorkspaceLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthGate />
    </BrowserRouter>
  )
}

export default App
