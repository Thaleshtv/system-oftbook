import api from './api'

interface LoginSchema {
  email: string
  password: string
}

export const Auth = {
  loginUser: async (
    data: LoginSchema
  ): Promise<{ status: number; message: string; data?: any }> => {
    const response = await api.post('auth', data)
    return response.data
  },

  logout: () => {
    window.location.href = '/'
  }
}
