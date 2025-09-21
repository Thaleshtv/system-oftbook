import { create } from 'zustand'
import api from './api'

export interface IGroupResponse {
  id: number
  nome: string
  qtd_tabelas: number
  qtd_usuarios: number
  ativa: boolean
}

export interface IGroupPayload {
  nome: string
  qtd_tabelas: number
  qtd_usuarios: number
  ativa: boolean
}

export const Groups = {
  getGroups: async (): Promise<IGroupResponse[]> => {
    const response = await api.get('grupos/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IGroupResponse[]
  },
  getGroupDetailById: async (grupo_id: string): Promise<IGroupResponse> => {
    const response = await api.get(`grupos/${grupo_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IGroupResponse
  },
  createGroup: async (data: IGroupPayload): Promise<IGroupResponse> => {
    const response = await api.post('grupos/', data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IGroupResponse
  },
  updateGroup: async (
    grupo_id: string,
    data: IGroupPayload
  ): Promise<IGroupResponse> => {
    const response = await api.put(`grupos/${grupo_id}`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IGroupResponse
  },
  deleteGroup: async (grupo_id: string): Promise<void> => {
    const response = await api.delete(`grupos/${grupo_id}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  }
}
