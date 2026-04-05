import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import ConnectPage from './pages/ConnectPage.jsx'
import Layout from './components/Layout.jsx'
import OverviewPage from './pages/OverviewPage.jsx'
import PipelinesPage from './pages/PipelinesPage.jsx'
import AIInsightsPage from './pages/AIInsightsPage.jsx'
import ReportsPage from './pages/ReportsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'

function AppRoutes() {
  const { auth, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-azure-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!auth) return (
    <Routes>
      <Route path="*" element={<ConnectPage />} />
    </Routes>
  )

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<OverviewPage />} />
        <Route path="pipelines" element={<PipelinesPage />} />
        <Route path="ai-insights" element={<AIInsightsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
