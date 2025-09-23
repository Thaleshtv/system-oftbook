import api from '../services/api'

interface GroupUserResponse {
  usuario_id: string
  grupo_id: number
}

export interface IAssociateUserToGroup {
  usuario_id: string
  grupo_id: number
}

export const GroupUser = {
  getGroupsByUser: async (userId: string): Promise<GroupUserResponse[]> => {
    const response = await api.get(`usuario-grupos/usuario/${userId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },
  getUsersByGroup: async (groupId: number): Promise<GroupUserResponse[]> => {
    const response = await api.get(`usuario-grupos/grupo/${groupId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },
  associateUserToGroup: async (
    data: IAssociateUserToGroup
  ): Promise<GroupUserResponse> => {
    const response = await api.post(`usuario-grupos/`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },
  dissociateUserFromGroup: async (userId: string, groupId: number) => {
    const response = await api.delete(`usuario-grupos/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      },
      params: { usuario_id: userId, grupo_id: groupId }
    })
    return response.data
  }
}
