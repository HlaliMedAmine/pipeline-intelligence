import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { pipelinesAPI } from '../lib/api.js'
import { mockOverview, mockTrend } from '../lib/mockData.js'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
  GitBranch, Clock, CheckCircle2, AlertTriangle,
  TrendingUp, TrendingDown, ArrowRight, RefreshCw
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function StatCard({ label, value, sub, trend, trendUp, icon: Icon, color, delay }) {
  return (
    <div className={`card-hover p-6 animate-fade-up stagger-${delay}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className={trendUp ? 'stat-up' : 'stat-down'}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{value}</div>
      <div className="text-sm font-semibold text-slate-700 mb-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400">{sub}</div>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card px-4 py-3 text-sm">
      <div className="font-bold text-slate-800 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-slate-500">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}:</span>
          <span className="font-semibold text-slate-700">{p.value}{p.name === 'duration' ? 'm' : ''}</span>
        </div>
      ))}
    </div>
  )
}

export default function OverviewPage() {
  const { auth } = useAuth()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      if (auth.demoMode) {
        await new Promise(r => setTimeout(r, 600))
        setData(mockOverview)
      } else {
        const res = await pipelinesAPI.getOverview(auth.project)
        setData(res.data)
      }
    } catch (e) {
      setData(mockOverview)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const pieData = data ? [
    { name: 'Success', value: data.successRate },
    { name: 'Failed', value: 100 - data.successRate },
  ] : []

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-5">
        {[1,2,3,4].map(i => <div key={i} className="skeleton h-36" />)}
      </div>
      <div className="grid grid-cols-3 gap-5">
        <div className="skeleton h-72 col-span-2" />
        <div className="skeleton h-72" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard label="Total Pipelines" value={data?.totalPipelines} sub={`${data?.totalRuns} total runs`} trend="+2 this month" trendUp icon={GitBranch} color="bg-azure-600" delay={1} />
        <StatCard label="Avg Duration" value={`${data?.avgDuration}m`} sub="Per pipeline run" trend="-0.8m vs last week" trendUp icon={Clock} color="bg-violet-500" delay={2} />
        <StatCard label="Success Rate" value={`${data?.successRate}%`} sub={`${data?.totalRuns} total runs`} trend="+2.1%" trendUp icon={CheckCircle2} color="bg-emerald-500" delay={3} />
        <StatCard label="Time Wasted" value={`${data?.timeWasted}h`} sub="This month" trend="+1.9h vs last" trendUp={false} icon={AlertTriangle} color="bg-rose-500" delay={4} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-5">
        {/* Trend chart */}
        <div className="card p-6 col-span-2 animate-fade-up stagger-1">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Pipeline Duration Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Average minutes per run, last 7 days</p>
            </div>
            <span className="badge-info">Weekly</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockTrend}>
              <defs>
                <linearGradient id="durationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0e8de9" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#0e8de9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="duration" name="duration" stroke="#0e8de9" strokeWidth={2.5} fill="url(#durationGrad)" dot={{ fill: '#0e8de9', r: 4, strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Success rate donut */}
        <div className="card p-6 animate-fade-up stagger-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800">Success Rate</h3>
              <p className="text-xs text-slate-400 mt-0.5">All pipelines</p>
            </div>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={52} outerRadius={72} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  <Cell fill="#0e8de9" />
                  <Cell fill="#f1f5f9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-3xl font-bold text-slate-900">{data?.successRate}%</span>
              <span className="text-xs text-slate-400 font-medium">success</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-azure-500" />Passed
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />Failed
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline list */}
      <div className="card p-6 animate-fade-up stagger-3">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-slate-800">Recent Pipelines</h3>
            <p className="text-xs text-slate-400 mt-0.5">Sorted by last run time</p>
          </div>
          <button onClick={() => navigate('/pipelines')} className="btn-secondary flex items-center gap-1.5 text-xs py-2 px-3">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {data?.pipelines?.map((p, i) => (
            <div key={p.id || i} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${p.lastRun?.status === 'succeeded' ? 'bg-emerald-500' : p.lastRun?.status === 'failed' ? 'bg-red-500' : 'bg-amber-400'}`} />
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 text-sm truncate">{p.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {p.lastRun?.startTime ? new Date(p.lastRun.startTime).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="text-center hidden md:block">
                <div className="font-bold text-slate-700 text-sm">{p.avgDuration}m</div>
                <div className="text-xs text-slate-400">avg</div>
              </div>
              <div className="text-center hidden md:block">
                <div className={`font-bold text-sm ${p.successRate >= 80 ? 'text-emerald-600' : p.successRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{p.successRate}%</div>
                <div className="text-xs text-slate-400">success</div>
              </div>
              <span className={p.lastRun?.status === 'succeeded' ? 'badge-success' : p.lastRun?.status === 'failed' ? 'badge-danger' : 'badge-warning'}>
                {p.lastRun?.status || 'unknown'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
