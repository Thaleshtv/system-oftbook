import api from './api'

interface ITableResponse {
  id: number
  nome: string
  descricao: string
  qtd_colunas: number
  conexao_id: number
}

interface ITablePayload {
  nome: string
  descricao: string
  conexao_id: number
}

export const Tables = {
  getTables: async (conexao_id: string): Promise<ITableResponse[]> => {
    const response = await api.get(`tabelas/?conexao_id=${conexao_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as ITableResponse[]
  },

  getTableDetailById: async (tabela_id: string): Promise<ITableResponse> => {
    const response = await api.get(`tabelas/tabela/${tabela_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as ITableResponse
  },

  deleteTable: async (tabela_id: string): Promise<void> => {
    const response = await api.delete(`tabelas/tabela/${tabela_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },

  updateTable: async (
    tabela_id: string,
    data: ITablePayload
  ): Promise<ITableResponse> => {
    const response = await api.put(`tabelas/tabela/${tabela_id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as ITableResponse
  }
}
