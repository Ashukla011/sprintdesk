import { AppShell } from './components/Layout/AppShell'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { AnalyticPage } from './pages/AnalyticPage'
import { BoardPage } from './pages/BoardPage'
import { DashboardPage } from './pages/DashboardPage'

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
      <Routes>
        <Route element={<WorkspaceLayout />}>
          <Route element={<DashboardPage />} path="/dashboard" />
          <Route element={<BoardPage />} path="/board" />
          <Route element={<AnalyticPage />} path="/analytics" />
        </Route>
        <Route element={<Navigate replace to="/dashboard" />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}

export default App
