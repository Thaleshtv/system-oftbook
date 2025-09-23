import api from './api'

export interface IApiKeyResponse {
  id: string
  nome: string
  api_key: string
}

export interface IApiKeyPayload {
  nome: string
  api_key: string
}

export const ApiKeys = {
  getApiKeys: async (): Promise<IApiKeyResponse[]> => {
    const response = await api.get('api-keys/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IApiKeyResponse[]
  },
  getApiKeyById: async (api_key_id: string): Promise<IApiKeyResponse> => {
    const response = await api.get(`api-keys/${api_key_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IApiKeyResponse
  },
  createApiKey: async (data: IApiKeyPayload): Promise<IApiKeyResponse> => {
    const response = await api.post('api-keys/', data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IApiKeyResponse
  },
  updateApiKey: async (
    api_key_id: string,
    data: IApiKeyPayload
  ): Promise<IApiKeyResponse> => {
    const response = await api.put(`api-keys/${api_key_id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IApiKeyResponse
  },
  deleteApiKey: async (api_key_id: string): Promise<void> => {
    const response = await api.delete(`api-keys/${api_key_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  }
}
