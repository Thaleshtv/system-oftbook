import Cookies from 'js-cookie'
import { create } from 'zustand'
import { User } from '../types/userType'

interface AuthStore {
  state: {
    user: User | null
    token: string | null
    refreshToken: string | null
  }
  dispatch: {
    setToken: (token: string) => void
    setRefreshToken: (refreshToken: string) => void
    setUser: (user: User) => void
    logOut: () => void
  }
}

const getTokenFromCookies = (): string | null => {
  return Cookies.get('token') || null
}

const getRefreshTokenFromCookies = (): string | null => {
  return Cookies.get('refreshToken') || null
}

const getUserFromCookies = (): User | null => {
  const userCookie = Cookies.get('user')
  return userCookie ? JSON.parse(userCookie) : null
}

export const useAuthStore = create<AuthStore>((set) => {
  return {
    state: {
      user: getUserFromCookies(),
      token: getTokenFromCookies(),
      refreshToken: getRefreshTokenFromCookies()
    },
    dispatch: {
      setToken: (token: string) => {
        set((state) => ({
          state: {
            ...state.state,
            token: token
          }
        }))
        Cookies.set('token', token, { path: '/' })
      },
      setRefreshToken: (refreshToken: string) => {
        set((state) => ({
          state: {
            ...state.state,
            refreshToken: refreshToken
          }
        }))
        Cookies.set('refreshToken', refreshToken, { path: '/' })
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
            token: null,
            refreshToken: null
          }
        }))
        Cookies.remove('user')
        Cookies.remove('token')
        Cookies.remove('refreshToken')
      }
    }
  }
})
