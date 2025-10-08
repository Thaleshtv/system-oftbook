import api from './api'

export interface IColumnResponse {
  id: number
  nome: string
  descricao: string
  tipo: string
  tabela_id: number
}

export interface IColumnPayload {
  nome: string
  descricao: string
  tipo: string
  tabela_id: number
}

export const Columns = {
  getColumns: async (tabela_id: string): Promise<IColumnResponse[]> => {
    const response = await api.get(`colunas/tabela/${tabela_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IColumnResponse[]
  },

  getColumnDetailById: async (coluna_id: string): Promise<IColumnResponse> => {
    const response = await api.get(`colunas/${coluna_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IColumnResponse
  },

  updateColumn: async (
    coluna_id: string,
    data: IColumnPayload
  ): Promise<IColumnResponse> => {
    const response = await api.put(`colunas/${coluna_id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IColumnResponse
  }
}
