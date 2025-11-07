export interface ISessaoResponse {
  id: string
  nome: string
  arquivada: boolean
  ultimaMensagem?: string
  timestamp?: number
}

// This service can be expanded in the future if needed
export const Sessoes = {
  // For now, this is just a placeholder as we're using the chat service
  // for managing chat sessions via getAllChatIds
}
