import api from './api'

export interface IMensagemResponse {
  id: string
  role: string
  content: string
  avaliacao?: string
  sessao_id: string
  created_at: string
}

export interface IMensagemPayload {
  role: string
  content: string
  avaliacao?: string
  sessao_id: string
}

export interface ISessaoResponse {
  id: string
  nome: string
  descricao: string
  usuario_id: string
  arquivada: boolean
  created_at: string
  updated_at: string
  historico: IMensagemResponse[]
}

export interface ISessaoPayload {
  nome: string
  descricao: string
  usuario_id: string
}

export const Sessoes = {
  getSessoes: async (): Promise<ISessaoResponse[]> => {
    const response = await api.get('sessoes/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as ISessaoResponse[]
  },

  createSessao: async (payload: ISessaoPayload): Promise<ISessaoResponse> => {
    const response = await api.post('sessoes/', payload, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as ISessaoResponse
  },

  getSessaoById: async (sessaoId: string): Promise<ISessaoResponse> => {
    const response = await api.get(`sessoes/${sessaoId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as ISessaoResponse
  },

  archiveSessao: async (sessaoId: string): Promise<{ [key: string]: any }> => {
    const response = await api.patch(
      `sessoes/${sessaoId}/archive`,
      {},
      {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    )
    return response.data
  },

  addMensagem: async (
    sessaoId: string,
    payload: IMensagemPayload
  ): Promise<IMensagemResponse> => {
    const response = await api.post(`sessoes/${sessaoId}/mensagens`, payload, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IMensagemResponse
  },

  updateAvaliacaoMensagem: async (
    mensagemId: string,
    avaliacao: string
  ): Promise<IMensagemResponse> => {
    const response = await api.patch(
      `sessoes/mensagens/${mensagemId}/avaliacao`,
      null,
      {
        params: { avaliacao },
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    )
    return response.data as IMensagemResponse
  }
}

export default Sessoes
