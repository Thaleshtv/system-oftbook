import Cookies from 'js-cookie'
import { create } from 'zustand'
import { User, UserApiResponse } from '../types/userType'

interface AuthStore {
  state: {
    user: User | null
    token: string | null
  }
  dispatch: {
    setToken: (token: string) => Promise<void>
    setUser: (user: User) => void
    logOut: () => void
  }
}

const getTokenFromCookies = (): string | null => {
  return Cookies.get('token') || null
}

const getUserFromCookies = (): User | null => {
  const userCookie = Cookies.get('user')
  return userCookie ? JSON.parse(userCookie) : null
}

const fetchUserData = async (token: string): Promise<User | null> => {
  try {
    const base =
      'https://hub.altona.com.br/AltonaAPI.netenvironment/APIUsuario/Usuario/'
    const url = `${base}${token}`

    const res = await fetch(url, {
      method: 'GET'
    })

    if (!res.ok) {
      throw new Error(`Fetch error: ${res.status}`)
    }

    const responseData = (await res.json()) as UserApiResponse

    return {
      name: responseData.nome,
      role: responseData.privilegio
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error)
    return null
  }
}

export const useAuthStore = create<AuthStore>((set) => {
  return {
    state: {
      user: getUserFromCookies(),
      token: getTokenFromCookies()
    },
    dispatch: {
      setToken: async (token: string) => {
        console.log('Setting token in store:', token)
        // Primeiro, salva o token
        set((state) => ({
          state: {
            ...state.state,
            token: token
          }
        }))
        document.cookie = `token=${token}; path=/`

        const userData = await fetchUserData(token)
        if (userData) {
          set((state) => ({
            state: {
              ...state.state,
              user: userData
            }
          }))
          Cookies.set('user', JSON.stringify(userData))
        }
      },
      setUser: (user: User) => {
        set((state) => ({
          state: {
            ...state.state,
            user: user
          }
        }))
        Cookies.set('user', JSON.stringify(user))
      },
      logOut: () => {
        set(() => ({
          state: {
            user: null,
            token: null
          }
        }))
        Cookies.remove('user')
        Cookies.remove('token')
      }
    }
  }
})
