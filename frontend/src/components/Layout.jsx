import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import {
  LayoutDashboard, GitBranch, Sparkles, BarChart3,
  Settings, Activity, Bell, LogOut, ChevronRight, Zap
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Overview' },
  { path: '/pipelines', icon: GitBranch, label: 'Pipelines' },
  { path: '/ai-insights', icon: Sparkles, label: 'AI Insights' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
]

export default function Layout() {
  const { auth, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const getPageTitle = () => {
    const item = navItems.find(n => n.path === location.pathname)
    return item?.label || 'Overview'
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white/90 backdrop-blur-sm border-r border-slate-100 flex flex-col h-full">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-azure-600 rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm leading-none mb-0.5">Pipeline</div>
              <div className="font-bold text-azure-600 text-sm leading-none">Intelligence</div>
            </div>
          </div>
        </div>

        {/* Project badge */}
        <div className="px-4 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2 px-3 py-2 bg-azure-50 rounded-xl">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-slow flex-shrink-0" />
            <span className="text-azure-700 font-semibold text-xs truncate">{auth?.project || 'Demo'}</span>
            {auth?.demoMode && (
              <span className="ml-auto text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md font-bold flex-shrink-0">DEMO</span>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Main</div>
          {navItems.slice(0, 4).map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={active ? 'sidebar-link-active w-full' : 'sidebar-link w-full'}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 opacity-60 flex-shrink-0" />}
              </button>
            )
          })}

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3 pt-4">System</div>
          {navItems.slice(4).map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={active ? 'sidebar-link-active w-full' : 'sidebar-link w-full'}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 border-t border-slate-100">
          <div className="card p-3 mb-3 bg-gradient-to-br from-azure-50 to-slate-50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-azure-600" />
              <span className="text-xs font-bold text-azure-700">Pro Tip</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">Run AI analysis weekly to catch new bottlenecks before they compound.</p>
          </div>
          <button
            onClick={logout}
            className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-100 px-8 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{getPageTitle()}</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {auth?.demoMode ? 'Viewing demo data — ' : `${auth?.orgUrl} · `}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <Bell className="w-4 h-4 text-slate-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-azure-600 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-azure-500 to-azure-700 flex items-center justify-center text-white font-bold text-sm shadow-glow">
              {auth?.orgUrl?.[0]?.toUpperCase() || 'D'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
