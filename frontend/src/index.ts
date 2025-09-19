export interface User {
  id: number
  email: string
  full_name?: string
  is_admin: boolean
  is_active: boolean
  created_at: string
}

export interface Sweet {
  id: number
  name: string
  category: string
  price: number
  quantity: number
  description?: string
  image_url?: string
  is_available: boolean
  is_in_stock: boolean
  created_at: string
  updated_at?: string
}

export interface Purchase {
  id: number
  user_id: number
  sweet_id: number
  quantity: number
  unit_price: number
  total_price: number
  status: string
  created_at: string
  sweet_name?: string
  user_email?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}