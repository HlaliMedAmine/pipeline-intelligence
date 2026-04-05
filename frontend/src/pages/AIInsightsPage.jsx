import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { aiAPI } from '../lib/api.js'
import { mockRecommendations } from '../lib/mockData.js'
import { Sparkles, AlertTriangle, Zap, ChevronDown, ChevronUp, Clock, Terminal, RefreshCw } from 'lucide-react'

function RecommendationCard({ rec, color, bg, border }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`rounded-2xl border ${bg} ${border} p-5 transition-all duration-300`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${color}`}>{rec.pipeline}</span>
          </div>
          <h4 className="font-bold text-slate-800 text-sm leading-snug mb-1">{rec.title}</h4>
          <p className="text-xs text-slate-500 leading-relaxed">{rec.description}</p>
        </div>
        <button onClick={() => setExpanded(!expanded)} className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/80 hover:bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all border border-white shadow-sm">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-slate-600">
        <Clock className="w-3.5 h-3.5" />
        <span>{rec.impact}</span>
      </div>

      {expanded && rec.solution && (
        <div className="mt-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Solution</span>
          </div>
          <pre className="bg-slate-900 text-emerald-400 text-xs p-4 rounded-xl overflow-x-auto font-mono leading-relaxed border border-slate-800">
            {rec.solution}
          </pre>
        </div>
      )}
    </div>
  )
}

export default function AIInsightsPage() {
  const { auth } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      if (auth.demoMode) {
        await new Promise(r => setTimeout(r, 1200))
        setData(mockRecommendations)
      } else {
        const res = await aiAPI.getRecommendations(auth.project)
        setData(res.data)
      }
    } catch {
      setData(mockRecommendations)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="skeleton h-28 rounded-2xl" />
      <div className="space-y-3">
        {[1,2,3].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
      </div>
    </div>
  )

  const sections = [
    { key: 'critical', label: 'Critical Issues', icon: AlertTriangle, emoji: '🔴', color: 'text-red-700 bg-red-50', bg: 'bg-red-50/50', border: 'border-red-100', badgeColor: 'bg-red-100 text-red-700', count: data?.critical?.length },
    { key: 'medium', label: 'Medium Priority', icon: Zap, emoji: '🟡', color: 'text-amber-700 bg-amber-50', bg: 'bg-amber-50/50', border: 'border-amber-100', badgeColor: 'bg-amber-100 text-amber-700', count: data?.medium?.length },
    { key: 'quickWins', label: 'Quick Wins', icon: Sparkles, emoji: '🟢', color: 'text-emerald-700 bg-emerald-50', bg: 'bg-emerald-50/50', border: 'border-emerald-100', badgeColor: 'bg-emerald-100 text-emerald-700', count: data?.quickWins?.length },
  ]

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Summary card */}
      <div className="card p-6 bg-gradient-to-br from-azure-50 to-slate-50 border-azure-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-azure-600 rounded-2xl flex items-center justify-center shadow-glow flex-shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-slate-900">AI Analysis Summary</h3>
              <button onClick={load} className="btn-secondary flex items-center gap-1.5 text-xs py-1.5 px-3">
                <RefreshCw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{data?.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {sections.map(s => (
            <div key={s.key} className="bg-white/80 rounded-xl p-3 text-center border border-white">
              <div className="text-2xl font-bold text-slate-900">{s.count}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation sections */}
      {sections.map(({ key, label, icon: Icon, emoji, color, bg, border, badgeColor }) => (
        <div key={key}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${color.split(' ')[1]} border`} style={{borderColor: 'transparent'}}>
              <Icon className={`w-4 h-4 ${color.split(' ')[0]}`} />
            </div>
            <h3 className="font-bold text-slate-800">{label}</h3>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>{data?.[key]?.length}</span>
          </div>
          <div className="space-y-3">
            {data?.[key]?.map((rec, i) => (
              <RecommendationCard key={i} rec={rec} color={badgeColor} bg={bg} border={border} />
            ))}
            {(!data?.[key] || data[key].length === 0) && (
              <div className="card p-6 text-center text-slate-400 text-sm">
                ✅ No issues in this category
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
