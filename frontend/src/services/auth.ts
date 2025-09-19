import { api } from './api'
import { LoginData, RegisterData, AuthResponse, User } from '../types'

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const formData = new FormData()
    formData.append('username', data.email)
    formData.append('password', data.password)
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post('/api/auth/register', data)
    return response.data
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/api/auth/me')
    return response.data
  },
}