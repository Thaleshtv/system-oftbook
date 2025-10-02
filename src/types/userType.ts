export interface User {
  name: string
  role: 'administrador' | 'usuario'
}

export interface UserApiResponse {
  user: string
  privilegio: 'administrador' | 'usuario'
}
