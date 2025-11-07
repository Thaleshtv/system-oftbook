import api from './api'

export interface LoginSchema {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  id_token: string
  user: {
    user_id: string
    email: string
    name: string
    groups: string[]
  }
}

export interface RefreshTokenSchema {
  refresh_token: string
}

export interface ChangePasswordSchema {
  email: string
  temporary_password: string
  new_password: string
  session: string
}

export interface AuthResponse<T = any> {
  status: number
  message?: string
  data?: T
}

export const Auth = {
  loginUser: async (data: LoginSchema): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('auth/login', data)
    return response.data
  },

  refreshToken: async (data: RefreshTokenSchema): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('auth/refresh', data)
    return response.data
  },

  changePassword: async (
    data: ChangePasswordSchema
  ): Promise<AuthResponse> => {
    const response = await api.post('auth/change-password', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('auth/logout')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  },

  getMe: async (): Promise<any> => {
    const response = await api.get('auth/me')
    return response.data
  }
}
