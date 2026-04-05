import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pi_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const authAPI = {
  connect: (orgUrl, pat) => api.post('/auth/connect', { orgUrl, pat }),
  verify: () => api.post('/auth/verify'),
}

export const pipelinesAPI = {
  getOverview: (project) => api.get(`/pipelines/${project}/overview`),
  getList: (project) => api.get(`/pipelines/${project}/list`),
  getDetail: (project, pipelineId) => api.get(`/pipelines/${project}/${pipelineId}/detail`),
}

export const aiAPI = {
  getRecommendations: (project) => api.post('/ai/recommendations', { project }),
}

export default api
