import { useAuth } from '../hooks/useAuth.jsx'
import { mockPipelines, mockOverview } from '../lib/mockData.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Download, FileText, Trophy, AlertTriangle, Flame, TrendingUp } from 'lucide-react'

export default function ReportsPage() {
  const { auth } = useAuth()

  const fastest = [...mockPipelines].sort((a, b) => a.avgDuration - b.avgDuration)[0]
  const slowest = [...mockPipelines].sort((a, b) => b.avgDuration - a.avgDuration)[0]
  const mostFailing = [...mockPipelines].sort((a, b) => b.failureCount - a.failureCount)[0]

  const barData = mockPipelines.map(p => ({ name: p.name.split(' ').slice(0, 2).join(' '), duration: p.avgDuration, success: p.successRate }))

  const COLORS = ['#0e8de9', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="card p-6 flex items-center justify-between bg-gradient-to-br from-slate-50 to-azure-50 border-azure-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Monthly Report</h2>
          <p className="text-sm text-slate-500">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {auth?.project || 'Demo'} project</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button className="btn-primary flex items-center gap-2">
            <FileText className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-3 gap-5">
        <div className="card-hover p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
              <Trophy className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Fastest Pipeline</span>
          </div>
          <div className="font-bold text-slate-800 mb-1 text-sm leading-snug">{fastest?.name}</div>
          <div className="text-2xl font-bold text-emerald-600">{fastest?.avgDuration}m</div>
          <div className="text-xs text-slate-400 mt-1">average duration</div>
        </div>

        <div className="card-hover p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center border border-amber-100">
              <Flame className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Slowest Pipeline</span>
          </div>
          <div className="font-bold text-slate-800 mb-1 text-sm leading-snug">{slowest?.name}</div>
          <div className="text-2xl font-bold text-amber-600">{slowest?.avgDuration}m</div>
          <div className="text-xs text-slate-400 mt-1">average duration</div>
        </div>

        <div className="card-hover p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center border border-red-100">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wide">Most Failing</span>
          </div>
          <div className="font-bold text-slate-800 mb-1 text-sm leading-snug">{mostFailing?.name}</div>
          <div className="text-2xl font-bold text-red-600">{mostFailing?.failureCount}</div>
          <div className="text-xs text-slate-400 mt-1">failures this month</div>
        </div>
      </div>

      {/* Duration chart */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-800">Duration by Pipeline</h3>
            <p className="text-xs text-slate-400 mt-0.5">Average minutes per run</p>
          </div>
          <span className="badge-info">This month</span>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }} />
            <Bar dataKey="duration" name="Avg Duration (min)" radius={[6, 6, 0, 0]}>
              {barData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-azure-600" />
          <h3 className="font-bold text-slate-800">Pipeline Summary</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {mockPipelines.map((p, i) => (
            <div key={i} className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors">
              <div className="col-span-2 font-semibold text-slate-800 text-sm">{p.name}</div>
              <div className="text-center">
                <span className="font-bold text-slate-700">{p.avgDuration}m</span>
                <span className="text-xs text-slate-400 ml-1">avg</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${p.successRate >= 80 ? 'bg-emerald-500' : p.successRate >= 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${p.successRate}%` }} />
                </div>
                <span className={`text-xs font-bold ${p.successRate >= 80 ? 'text-emerald-600' : p.successRate >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{p.successRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
