import api from './api'

export interface ConnectionPayload {
  nome: string
  driver: string
  server: string
  database: string
  pwd: string
  db_schema: string
  tipo_banco: string
  catalogo: string
}

export interface IConnection {
  id: number
  nome: string
  driver: string
  server: string
  database: string
  pwd: string
  db_schema: string
  tipo_banco: string
  catalogo: string
}

export const Connections = {
  getConnections: async (): Promise<IConnection[]> => {
    const response = await api.get('conexoes/', {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IConnection[]
  },
  createConnection: async (data: ConnectionPayload): Promise<IConnection> => {
    const response = await api.post('conexoes/', data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IConnection
  },
  getConnectionById: async (conexao_id: string): Promise<IConnection> => {
    const response = await api.get(`conexoes/${conexao_id}/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IConnection
  },
  deleteConnection: async (conexao_id: string): Promise<void> => {
    const response = await api.delete(`conexoes/${conexao_id}/`, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data
  },
  updateConnection: async (
    conexao_id: string,
    data: ConnectionPayload
  ): Promise<IConnection> => {
    const response = await api.put(`conexoes/${conexao_id}/`, data, {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    })
    return response.data as IConnection
  }
}
