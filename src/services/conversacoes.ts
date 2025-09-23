import api from './api'

export interface IConversacaoPayload {
  sessao_id: string
  pergunta: string
  graph?: boolean
}

export interface IConversacaoResponse {
  resposta: string
  graph?: string
  insight?: string
}

export const Conversacoes = {
  conversar: async (
    payload: IConversacaoPayload
  ): Promise<IConversacaoResponse> => {
    const response = await api.post('conversacoes/', payload, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IConversacaoResponse
  }
}

export default Conversacoes
