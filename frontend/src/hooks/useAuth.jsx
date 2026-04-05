import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('pi_token')
    const orgUrl = localStorage.getItem('pi_orgUrl')
    const project = localStorage.getItem('pi_project')
    const demoMode = localStorage.getItem('pi_demo') === 'true'

    if ((token && orgUrl && project) || demoMode) {
      setAuth({ token, orgUrl, project, demoMode })
    }
    setLoading(false)
  }, [])

  const login = (token, orgUrl, project) => {
    localStorage.setItem('pi_token', token)
    localStorage.setItem('pi_orgUrl', orgUrl)
    localStorage.setItem('pi_project', project)
    localStorage.removeItem('pi_demo')
    setAuth({ token, orgUrl, project, demoMode: false })
  }

  const loginDemo = () => {
    localStorage.setItem('pi_demo', 'true')
    localStorage.removeItem('pi_token')
    setAuth({ demoMode: true, project: 'demo', orgUrl: 'demo' })
  }

  const logout = () => {
    localStorage.clear()
    setAuth(null)
  }

  return (
    <AuthContext.Provider value={{ auth, login, loginDemo, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
