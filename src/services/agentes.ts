import api from './api'

export interface IAgenteResponse {
  id: string
  nome: string // Na verdade é o código do agente (backend invertido)
  modelo_id: string
  cod: string // Na verdade é o nome do agente (backend invertido)
  prompt_template: string
}

export interface IAgentePayload {
  nome: string // Na verdade é o código do agente (backend invertido)
  modelo_id: string
  cod: string // Na verdade é o nome do agente (backend invertido)
  prompt_template: string
}

export const Agentes = {
  getAgentes: async (): Promise<IAgenteResponse[]> => {
    const response = await api.get('agentes/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IAgenteResponse[]
  },
  getAgenteById: async (agente_id: string): Promise<IAgenteResponse> => {
    const response = await api.get(`agentes/${agente_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IAgenteResponse
  },
  createAgente: async (data: IAgentePayload): Promise<IAgenteResponse> => {
    const response = await api.post('agentes/', data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IAgenteResponse
  },
  updateAgente: async (
    agente_id: string,
    data: IAgentePayload
  ): Promise<IAgenteResponse> => {
    const response = await api.put(`agentes/${agente_id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IAgenteResponse
  },
  deleteAgente: async (agente_id: string): Promise<void> => {
    const response = await api.delete(`agentes/${agente_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  }
}
