export interface User {
  name: string
  role: 'administrador' | 'usuario'
}

export interface UserApiResponse {
  usuario: string
  privilegio: 'administrador' | 'usuario'
  nome: string
  mensagem: string
}
