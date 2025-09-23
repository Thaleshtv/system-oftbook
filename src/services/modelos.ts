import api from './api'

export interface IModeloResponse {
  id: string
  nome: string
  modelo: string
  api_key_id: string
}

export interface IModeloPayload {
  nome: string
  modelo: string
  api_key_id: string
}

export const Modelos = {
  getModelos: async (): Promise<IModeloResponse[]> => {
    const response = await api.get('modelos/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IModeloResponse[]
  },
  getModeloById: async (modelo_id: string): Promise<IModeloResponse> => {
    const response = await api.get(`modelos/${modelo_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IModeloResponse
  },
  createModelo: async (data: IModeloPayload): Promise<IModeloResponse> => {
    const response = await api.post('modelos/', data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IModeloResponse
  },
  updateModelo: async (
    modelo_id: string,
    data: IModeloPayload
  ): Promise<IModeloResponse> => {
    const response = await api.put(`modelos/${modelo_id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IModeloResponse
  },
  deleteModelo: async (modelo_id: string): Promise<void> => {
    const response = await api.delete(`modelos/${modelo_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  }
}
