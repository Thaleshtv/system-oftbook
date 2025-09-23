// Pasta types
export interface IPasta {
  id?: string
  nome: string
  descricao: string
  created_at?: string
  updated_at?: string
  archived?: boolean
  [key: string]: any
}

export interface IPastaPayload {
  nome: string
  descricao: string
}

export interface IAddSessaoToPastaPayload {
  sessao_id: string
}

// Sessao types
export interface IMensagem {
  id: string
  role: string
  content: string
  avaliacao?: string
  sessao_id: string
  created_at: string
}

export interface IMensagemPayload {
  role: string
  content: string
  avaliacao?: string
  sessao_id: string
}

export interface ISessao {
  id: string
  nome: string
  descricao: string
  usuario_id: string
  arquivada: boolean
  created_at: string
  updated_at: string
  historico: IMensagem[]
}

export interface ISessaoPayload {
  nome: string
  descricao: string
  usuario_id: string
}

// Conversacao types
export interface IConversacaoPayload {
  sessao_id: string
  pergunta: string
  graph?: boolean
}

export interface IConversacaoResponse {
  resposta: string
  graph?: string
  insight?: string
}

// Validation Error type (from API responses)
export interface IValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}
