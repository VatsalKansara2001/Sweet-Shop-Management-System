import { api } from './api'
import { Purchase } from '../types'

export const inventoryService = {
  purchaseSweet: async (sweetId: number, quantity: number): Promise<Purchase> => {
    const response = await api.post('/api/inventory/purchase', {
      sweet_id: sweetId,
      quantity,
    })
    return response.data
  },

  restockSweet: async (sweetId: number, quantity: number): Promise<any> => {
    const response = await api.post(`/api/inventory/restock/${sweetId}?quantity=${quantity}`)
    return response.data
  },

  getMyPurchases: async (): Promise<Purchase[]> => {
    const response = await api.get('/api/inventory/purchases/my')
    return response.data
  },
}