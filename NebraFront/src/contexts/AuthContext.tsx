import { createContext, useContext, useState, type ReactNode } from 'react'

const TOKEN_STORAGE_KEY = 'nebra.auth.token'

interface AuthContextType {
  token: string | null
  setToken: (token: string | null) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem(TOKEN_STORAGE_KEY)
    } catch (e) {
      console.error('Failed to access localStorage', e)
      return null
    }
  })

  const setToken = (newToken: string | null) => {
    setTokenState(newToken)
    if (newToken) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, newToken)
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
  }

  const logout = () => {
    setToken(null)
  }

  const value = {
    token,
    setToken,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
