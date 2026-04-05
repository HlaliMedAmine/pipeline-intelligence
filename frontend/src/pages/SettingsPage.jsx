import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { Settings, Key, Bell, Shield, LogOut, ChevronRight, Check } from 'lucide-react'

export default function SettingsPage() {
  const { auth, logout } = useAuth()
  const [saved, setSaved] = useState(false)
  const [geminiKey, setGeminiKey] = useState('')
  const [notifications, setNotifications] = useState(true)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const sections = [
    {
      title: 'Connection', icon: Shield,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <div className="font-semibold text-slate-800 text-sm">Organization</div>
              <div className="text-xs text-slate-400 mt-0.5 font-mono">{auth?.orgUrl || 'demo'}</div>
            </div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <div className="font-semibold text-slate-800 text-sm">Project</div>
              <div className="text-xs text-slate-400 mt-0.5">{auth?.project || 'demo'}</div>
            </div>
            <span className="badge-success"><Check className="w-3 h-3" />Connected</span>
          </div>
        </div>
      )
    },
    {
      title: 'AI Configuration', icon: Key,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Gemini API Key</label>
            <input className="input" type="password" placeholder="AIza..." value={geminiKey} onChange={e => setGeminiKey(e.target.value)} />
            <p className="text-xs text-slate-400 mt-1.5">
              Get a free key at <a href="https://aistudio.google.com" target="_blank" className="text-azure-600 hover:underline">aistudio.google.com</a>
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Notifications', icon: Bell,
      content: (
        <div className="space-y-3">
          {[
            { label: 'Pipeline failures', desc: 'Get notified when a pipeline fails' },
            { label: 'Weekly digest', desc: 'Weekly summary of pipeline health' },
            { label: 'New recommendations', desc: 'When AI finds new optimizations' },
          ].map(({ label, desc }) => (
            <div key={label} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div>
                <div className="font-semibold text-slate-800 text-sm">{label}</div>
                <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-11 h-6 rounded-full transition-all duration-300 relative ${notifications ? 'bg-azure-600' : 'bg-slate-200'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${notifications ? 'left-5.5 translate-x-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      )
    },
  ]

  return (
    <div className="space-y-5 max-w-2xl">
      {sections.map(({ title, icon: Icon, content }) => (
        <div key={title} className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 bg-azure-50 rounded-lg flex items-center justify-center border border-azure-100">
              <Icon className="w-4 h-4 text-azure-600" />
            </div>
            <h3 className="font-bold text-slate-800">{title}</h3>
          </div>
          <div className="p-6">{content}</div>
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button
          onClick={logout}
          className="flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Disconnect & Logout
        </button>
        <button onClick={handleSave} className={`btn-primary flex items-center gap-2 ${saved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
