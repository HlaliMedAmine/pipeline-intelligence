export const mockOverview = {
  totalPipelines: 12,
  totalRuns: 847,
  avgDuration: 8.4,
  successRate: 78,
  timeWasted: 14.2,
  pipelines: [
    { id: 1, name: 'Build & Deploy Frontend', avgDuration: 12.3, successRate: 92, failureCount: 6, lastRun: { status: 'succeeded', startTime: new Date(Date.now() - 3600000).toISOString() } },
    { id: 2, name: 'Run Integration Tests', avgDuration: 18.7, successRate: 61, failureCount: 31, lastRun: { status: 'failed', startTime: new Date(Date.now() - 7200000).toISOString() } },
    { id: 3, name: 'Deploy to Production', avgDuration: 6.1, successRate: 88, failureCount: 9, lastRun: { status: 'succeeded', startTime: new Date(Date.now() - 1800000).toISOString() } },
    { id: 4, name: 'Security Scan', avgDuration: 4.8, successRate: 95, failureCount: 3, lastRun: { status: 'succeeded', startTime: new Date(Date.now() - 900000).toISOString() } },
    { id: 5, name: 'Build Backend API', avgDuration: 9.2, successRate: 74, failureCount: 19, lastRun: { status: 'failed', startTime: new Date(Date.now() - 5400000).toISOString() } },
  ]
}

export const mockTrend = [
  { day: 'Mon', duration: 10.2, runs: 28 },
  { day: 'Tue', duration: 8.7, runs: 35 },
  { day: 'Wed', duration: 14.1, runs: 42 },
  { day: 'Thu', duration: 9.3, runs: 38 },
  { day: 'Fri', duration: 7.8, runs: 31 },
  { day: 'Sat', duration: 6.2, runs: 18 },
  { day: 'Sun', duration: 5.9, runs: 12 },
]

export const mockPipelines = [
  { id: 1, name: 'Build & Deploy Frontend', avgDuration: 12.3, successRate: 92, failureCount: 6, runs: Array.from({length: 20}, (_, i) => ({ duration: 10 + Math.random() * 5, status: Math.random() > 0.08 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 3600000).toISOString() })), lastRun: { status: 'succeeded' } },
  { id: 2, name: 'Run Integration Tests', avgDuration: 18.7, successRate: 61, failureCount: 31, runs: Array.from({length: 20}, (_, i) => ({ duration: 15 + Math.random() * 8, status: Math.random() > 0.39 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 3600000).toISOString() })), lastRun: { status: 'failed' } },
  { id: 3, name: 'Deploy to Production', avgDuration: 6.1, successRate: 88, failureCount: 9, runs: Array.from({length: 20}, (_, i) => ({ duration: 5 + Math.random() * 3, status: Math.random() > 0.12 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 7200000).toISOString() })), lastRun: { status: 'succeeded' } },
  { id: 4, name: 'Security Scan', avgDuration: 4.8, successRate: 95, failureCount: 3, runs: Array.from({length: 20}, (_, i) => ({ duration: 4 + Math.random() * 2, status: Math.random() > 0.05 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 86400000).toISOString() })), lastRun: { status: 'succeeded' } },
  { id: 5, name: 'Build Backend API', avgDuration: 9.2, successRate: 74, failureCount: 19, runs: Array.from({length: 20}, (_, i) => ({ duration: 7 + Math.random() * 5, status: Math.random() > 0.26 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 3600000).toISOString() })), lastRun: { status: 'failed' } },
  { id: 6, name: 'E2E Test Suite', avgDuration: 22.4, successRate: 55, failureCount: 38, runs: Array.from({length: 20}, (_, i) => ({ duration: 18 + Math.random() * 10, status: Math.random() > 0.45 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 3600000).toISOString() })), lastRun: { status: 'failed' } },
  { id: 7, name: 'Lint & Type Check', avgDuration: 2.1, successRate: 98, failureCount: 1, runs: Array.from({length: 20}, (_, i) => ({ duration: 1.5 + Math.random(), status: Math.random() > 0.02 ? 'succeeded' : 'failed', startTime: new Date(Date.now() - i * 1800000).toISOString() })), lastRun: { status: 'succeeded' } },
]

export const mockRecommendations = {
  summary: "Your pipelines are performing at 78% success rate with an average duration of 8.4 minutes. The main bottlenecks are the E2E Test Suite and Integration Tests, which together account for 60% of your total CI/CD time waste.",
  critical: [
    { title: "Enable npm/yarn caching in Integration Tests", description: "The 'npm install' step in your Integration Tests pipeline takes 6-8 minutes on every run with no caching configured.", impact: "Save ~6 min per run (~42 hrs/month)", pipeline: "Run Integration Tests", solution: "- task: Cache@2\n  inputs:\n    key: 'npm | $(Agent.OS) | package-lock.json'\n    path: $(npm_config_cache)\n    restoreKeys: npm | $(Agent.OS)" },
    { title: "Parallelize E2E test suites", description: "Your E2E tests run sequentially on a single agent, causing 22+ minute runs. Splitting into parallel jobs would dramatically reduce wall-clock time.", impact: "Reduce from 22 min → 6 min per run", pipeline: "E2E Test Suite", solution: "strategy:\n  parallel: 4\njobs:\n- job: E2E_Tests\n  strategy:\n    matrix:\n      Suite1: { SUITE: 'auth' }\n      Suite2: { SUITE: 'checkout' }\n      Suite3: { SUITE: 'dashboard' }\n      Suite4: { SUITE: 'api' }" },
  ],
  medium: [
    { title: "Add retry logic to Deploy to Production", description: "Transient Azure failures cause 12% of production deploys to fail on the first attempt. Adding auto-retry would reduce false-failure alerts.", impact: "Reduce failure rate from 12% to ~3%", pipeline: "Deploy to Production", solution: "retryCountOnTaskFailure: 2\ntimeoutInMinutes: 15" },
    { title: "Docker layer caching for Build Backend API", description: "Docker builds are not using BuildKit layer caching, rebuilding all layers on each run even when dependencies haven't changed.", impact: "Save ~4 min per run", pipeline: "Build Backend API", solution: "- script: |\n    docker buildx build \\\n      --cache-from type=registry,ref=$(ACR)/app:cache \\\n      --cache-to type=registry,ref=$(ACR)/app:cache \\\n      --push -t $(ACR)/app:$(Build.BuildId) ." },
  ],
  quickWins: [
    { title: "Set explicit timeouts on all steps", description: "Several steps have no timeout configured. A hung process will consume agent time for 60 minutes before Azure kills it.", impact: "Prevent 60-min wasted runs", pipeline: "All pipelines", solution: "steps:\n- task: YourTask@1\n  timeoutInMinutes: 15" },
    { title: "Skip unchanged workspaces with path filters", description: "All pipelines trigger on every commit regardless of which files changed. Frontend builds should only run when frontend code changes.", impact: "Reduce unnecessary runs by ~40%", pipeline: "Build & Deploy Frontend", solution: "trigger:\n  branches:\n    include: ['main', 'develop']\n  paths:\n    include: ['frontend/**', 'packages/shared/**']" },
  ]
}
