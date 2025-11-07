import api from './api'
import type {
  QueryRequest,
  QueryResponse,
  ChatHistoryResponse,
  ClearHistoryResponse,
  AllChatIdsResponse
} from '../types/chatTypes'

export const Chat = {
  sendMessage: async (query: string, chatId: string): Promise<QueryResponse> => {
    const payload: QueryRequest = {
      query,
      chat_id: chatId
    }
    const response = await api.post('query', payload)
    return { status: response.status, data: response.data }
  },

  getHistory: async (chatId: string): Promise<ChatHistoryResponse> => {
    const response = await api.get(`history/${chatId}`)
    return { status: response.status, data: response.data }
  },

  clearHistory: async (chatId: string): Promise<ClearHistoryResponse> => {
    const response = await api.delete(`history/${chatId}`)
    return { status: response.status, data: response.data }
  },

  getAllChatIds: async (): Promise<AllChatIdsResponse> => {
    const response = await api.get('all_chat_ids')
    return { status: response.status, data: response.data }
  }
}
