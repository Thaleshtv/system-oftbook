export interface QueryRequest {
  query: string
  chat_id: string
}

export interface QueryResponse {
  status: number
  data: string
}

export interface ChatHistoryResponse {
  status: number
  data: string
}

export interface ClearHistoryResponse {
  status: number
  data: string
}

export interface AllChatIdsResponse {
  status: number
  data: string
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
}

export interface ChatSession {
  id: string
  name: string
  lastMessage?: string
  lastMessageTime?: number
}
