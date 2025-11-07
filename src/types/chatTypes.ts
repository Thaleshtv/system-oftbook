export interface QueryRequest {
  query: string
  chat_id: string
}

export interface Reference {
  file_name: string
  page_number: number
}

export interface QueryResponseData {
  answer: string
  references: Reference[]
}

export interface QueryResponse {
  status: number
  data: QueryResponseData
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
  data: {
    chat_ids: string[]
  }
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'ai'
  timestamp: number
  references?: Reference[]
}

export interface ChatSession {
  id: string
  name: string
  lastMessage?: string
  lastMessageTime?: number
}
