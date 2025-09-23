import api from '../services/api'

interface GroupTablesResponse {
  tabela_nome: string
  conexao_nome: string
  grupo_id: number
  tabela_id: number
}

export interface IAssociateTableToGroup {
  tabela_id: number
  grupo_id: number
}

export const GroupTables = {
  getGroupTables: async (groupId: number): Promise<GroupTablesResponse[]> => {
    const response = await api.get(`grupo-tabelas/${groupId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },
  associateTableToGroup: async (
    data: IAssociateTableToGroup
  ): Promise<GroupTablesResponse> => {
    const response = await api.post(`grupo-tabelas/`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },
  dissociateTableFromGroup: async (groupId: number, tableId: number) => {
    const response = await api.delete(`grupo-tabelas/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      params: { grupo_id: groupId, tabela_id: tableId }
    })
    return response.data
  }
}
