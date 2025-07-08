interface Tokens {
  access: string
  access_expires: string
  refresh: string
  refresh_expires: string
}

export interface User {
  role: string
  tokens: Tokens
}
