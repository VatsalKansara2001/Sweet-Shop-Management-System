import { api } from './api'
import { Sweet } from '../types'

export const sweetsService = {
  getSweets: async (): Promise<Sweet[]> => {
    const response = await api.get('/api/sweets/')
    return response.data
  },

  getSweet: async (id: number): Promise<Sweet> => {
    const response = await api.get(`/api/sweets/${id}`)
    return response.data
  },

  searchSweets: async (params: {
    name?: string
    category?: string
    min_price?: number
    max_price?: number
  }): Promise<Sweet[]> => {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString())
      }
    })

    const response = await api.get(`/api/sweets/search?${searchParams}`)
    return response.data
  },

  createSweet: async (sweetData: Omit<Sweet, 'id' | 'created_at' | 'updated_at' | 'is_in_stock'>): Promise<Sweet> => {
    const response = await api.post('/api/sweets/', sweetData)
    return response.data
  },

  updateSweet: async (id: number, sweetData: Partial<Sweet>): Promise<Sweet> => {
    const response = await api.put(`/api/sweets/${id}`, sweetData)
    return response.data
  },

  deleteSweet: async (id: number): Promise<void> => {
    await api.delete(`/api/sweets/${id}`)
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/api/sweets/categories/list')
    return response.data
  },
}