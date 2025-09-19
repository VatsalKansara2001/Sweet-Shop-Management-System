import React, { createContext, useContext, useState, useEffect } from 'react'
import { User, LoginData, RegisterData } from '../types'
import { authService } from '../services/auth'

interface AuthContextType {
  user: User | null
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // In a real app, you'd validate the token with the server
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (data: LoginData) => {
    const response = await authService.login(data)
    localStorage.setItem('access_token', response.access_token)
    // In a real app, decode JWT to get user info or fetch user data
    setUser({ 
      id: 1, 
      email: data.email, 
      is_admin: false, 
      is_active: true, 
      created_at: new Date().toISOString() 
    })
  }

  const register = async (data: RegisterData) => {
    const user = await authService.register(data)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}