import Cookies from 'js-cookie'
import { create } from 'zustand'

interface AuthStore {
  state: {
    token: string | null
  }
  dispatch: {
    setToken: (token: string) => void
    logOut: () => void
  }
}

const getTokenFromCookies = (): string | null => {
  return Cookies.get('token') || null
}

export const useAuthStore = create<AuthStore>((set) => {
  return {
    state: {
      token: getTokenFromCookies()
    },
    dispatch: {
      setToken: (token: string) => {
        set(() => ({
          state: {
            token: token
          }
        }))
        Cookies.set('token', token)
      },
      logOut: () => {
        set(() => ({
          state: {
            token: null
          }
        }))
        Cookies.remove('token')
      }
    }
  }
})
