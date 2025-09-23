import api from './api'

export interface IPastaResponse {
  id?: string
  nome: string
  descricao: string
  created_at?: string
  updated_at?: string
  archived?: boolean
  [key: string]: any
}

export interface IPastaPayload {
  nome: string
  descricao: string
}

export interface IAddSessaoToPastaPayload {
  sessao_id: string
}

export const Pastas = {
  getPastas: async (): Promise<string[]> => {
    const response = await api.get('pastas/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as string[]
  },

  createPasta: async (payload: IPastaPayload): Promise<IPastaResponse> => {
    const response = await api.post('pastas/', payload, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IPastaResponse
  },

  getPastaById: async (pastaId: string): Promise<IPastaResponse> => {
    const response = await api.get(`pastas/${pastaId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IPastaResponse
  },

  addSessaoToPasta: async (
    pastaId: string,
    payload: IAddSessaoToPastaPayload
  ): Promise<IPastaResponse> => {
    const response = await api.post(`pastas/${pastaId}/sessoes`, payload, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IPastaResponse
  },

  removeSessaoFromPasta: async (
    pastaId: string,
    sessaoId: string
  ): Promise<IPastaResponse> => {
    const response = await api.delete(`pastas/${pastaId}/sessoes/${sessaoId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IPastaResponse
  },

  archivePasta: async (pastaId: string): Promise<IPastaResponse> => {
    const response = await api.patch(`pastas/${pastaId}/archive`, {}, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IPastaResponse
  }
}

export default Pastas