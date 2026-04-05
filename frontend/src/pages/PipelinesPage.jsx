import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { pipelinesAPI } from '../lib/api.js'
import { mockPipelines } from '../lib/mockData.js'
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts'
import { Search, Filter, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

function Sparkline({ runs }) {
  const data = runs?.slice(0, 10).reverse().map((r, i) => ({ i, v: r.duration })) || []
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={data}>
        <Line type="monotone" dataKey="v" stroke="#0e8de9" strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

function StatusBadge({ status }) {
  const s = status === 'succeeded' ? 'badge-success' : status === 'failed' ? 'badge-danger' : 'badge-warning'
  const Icon = status === 'succeeded' ? CheckCircle2 : status === 'failed' ? XCircle : AlertCircle
  return (
    <span className={s}>
      <Icon className="w-3 h-3" />
      {status || 'unknown'}
    </span>
  )
}

export default function PipelinesPage() {
  const { auth } = useAuth()
  const [pipelines, setPipelines] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const load = async () => {
      try {
        if (auth.demoMode) {
          await new Promise(r => setTimeout(r, 500))
          setPipelines(mockPipelines)
        } else {
          const res = await pipelinesAPI.getList(auth.project)
          setPipelines(res.data)
        }
      } catch {
        setPipelines(mockPipelines)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = pipelines.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' ||
      (filter === 'success' && p.successRate >= 80) ||
      (filter === 'warning' && p.successRate >= 60 && p.successRate < 80) ||
      (filter === 'critical' && p.successRate < 60)
    return matchSearch && matchFilter
  })

  if (loading) return (
    <div className="space-y-4">
      <div className="skeleton h-12 w-full" />
      {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-20" />)}
    </div>
  )

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="card p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="input pl-10 h-10"
            placeholder="Search pipelines..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          {['all', 'success', 'warning', 'critical'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f
                  ? 'bg-azure-600 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-400 font-medium ml-auto">{filtered.length} pipelines</div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-4">Pipeline</div>
          <div className="col-span-2 text-center">Avg Duration</div>
          <div className="col-span-2 text-center">Success Rate</div>
          <div className="col-span-2 text-center">Trend</div>
          <div className="col-span-2 text-center">Status</div>
        </div>

        <div className="divide-y divide-slate-50">
          {filtered.map((p, i) => (
            <div key={p.id || i} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/70 transition-colors cursor-pointer group">
              <div className="col-span-4">
                <div className="font-semibold text-slate-800 text-sm group-hover:text-azure-600 transition-colors">{p.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{p.failureCount} failures • {p.runs?.length || 0} runs</div>
              </div>
              <div className="col-span-2 text-center">
                <div className="font-bold text-slate-700">{p.avgDuration}m</div>
                <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />avg
                </div>
              </div>
              <div className="col-span-2 text-center">
                <div className={`font-bold text-base ${p.successRate >= 80 ? 'text-emerald-600' : p.successRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {p.successRate}%
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5 mx-auto max-w-16">
                  <div
                    className={`h-1 rounded-full ${p.successRate >= 80 ? 'bg-emerald-500' : p.successRate >= 60 ? 'bg-amber-400' : 'bg-red-500'}`}
                    style={{ width: `${p.successRate}%` }}
                  />
                </div>
              </div>
              <div className="col-span-2 flex justify-center">
                <Sparkline runs={p.runs} />
              </div>
              <div className="col-span-2 flex justify-center">
                <StatusBadge status={p.lastRun?.status} />
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No pipelines match your filter</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
