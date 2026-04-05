import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { authAPI } from '../lib/api.js'
import { Activity, Eye, EyeOff, Zap, Shield, TrendingUp, ArrowRight, Sparkles } from 'lucide-react'

export default function ConnectPage() {
  const { login, loginDemo } = useAuth()
  const [orgUrl, setOrgUrl] = useState('')
  const [pat, setPat] = useState('')
  const [project, setProject] = useState('')
  const [projects, setProjects] = useState([])
  const [step, setStep] = useState(1)
  const [showPat, setShowPat] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleConnect = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await authAPI.connect(orgUrl, pat)
      setProjects(res.data.projects)
      localStorage.setItem('pi_token_tmp', res.data.token)
      setStep(2)
    } catch (e) {
      setError(e.response?.data?.error || 'Connection failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProject = () => {
    const token = localStorage.getItem('pi_token_tmp')
    login(token, orgUrl, project)
  }

  const features = [
    { icon: Activity, text: 'Real-time pipeline monitoring' },
    { icon: TrendingUp, text: 'AI-powered bottleneck detection' },
    { icon: Shield, text: 'JWT-secured connection' },
    { icon: Zap, text: 'Gemini AI recommendations' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-azure-600 via-azure-700 to-slate-900 p-16 flex-col justify-between relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-azure-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-700/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-azure-500/10 rounded-full blur-2xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '48px 48px'}} />
        </div>

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Pipeline Intelligence</span>
          </div>

          <h1 className="text-5xl font-bold text-white leading-tight mb-6">
            Stop guessing.<br />
            <span className="text-azure-200">Start optimizing.</span>
          </h1>
          <p className="text-azure-100/80 text-lg leading-relaxed mb-12">
            Connect to Azure DevOps and get AI-powered insights into your pipeline performance in seconds.
          </p>

          <div className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-4">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center border border-white/10 flex-shrink-0">
                  <Icon className="w-4 h-4 text-azure-200" />
                </div>
                <span className="text-azure-100 text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="card bg-white/10 border-white/15 p-5">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <TrendingUp className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm mb-1">Average result</p>
                <p className="text-azure-200 text-sm">Teams using Pipeline Intelligence reduce CI/CD time by <span className="text-white font-bold">42%</span> in the first week.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-azure-600 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">Pipeline Intelligence</span>
          </div>

          {step === 1 ? (
            <>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Connect your workspace</h2>
                <p className="text-slate-500">Enter your Azure DevOps credentials to get started</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Organization URL</label>
                  <input
                    className="input"
                    placeholder="https://dev.azure.com/your-org"
                    value={orgUrl}
                    onChange={e => setOrgUrl(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Personal Access Token</label>
                  <div className="relative">
                    <input
                      className="input pr-12"
                      type={showPat ? 'text' : 'password'}
                      placeholder="Your PAT token"
                      value={pat}
                      onChange={e => setPat(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleConnect()}
                    />
                    <button
                      onClick={() => setShowPat(!showPat)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPat ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Need a PAT? <a href="https://learn.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate" target="_blank" className="text-azure-600 hover:underline">Learn how to create one →</a>
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={!orgUrl || !pat || loading}
                className="btn-primary w-full flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Connect to Azure DevOps <ArrowRight className="w-4 h-4" /></>
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-slate-50 text-xs text-slate-400 font-medium">or</span>
                </div>
              </div>

              <button
                onClick={loginDemo}
                className="btn-secondary w-full flex items-center justify-center gap-2 h-12"
              >
                <Sparkles className="w-4 h-4 text-azure-500" />
                Try with demo data
              </button>
            </>
          ) : (
            <>
              <div className="mb-8">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 border border-emerald-100">
                  <Shield className="w-5 h-5 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Select a project</h2>
                <p className="text-slate-500">Found <span className="font-semibold text-slate-700">{projects.length}</span> projects in your organization</p>
              </div>

              <div className="space-y-2 mb-6 max-h-72 overflow-y-auto">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setProject(p.name)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      project === p.name
                        ? 'bg-azure-50 border-azure-300 text-azure-700'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-azure-200 hover:bg-azure-50/50'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <button
                onClick={handleSelectProject}
                disabled={!project}
                className="btn-primary w-full flex items-center justify-center gap-2 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Open Dashboard <ArrowRight className="w-4 h-4" />
              </button>

              <button onClick={() => setStep(1)} className="mt-3 w-full text-center text-sm text-slate-400 hover:text-slate-600 transition-colors py-2">
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
