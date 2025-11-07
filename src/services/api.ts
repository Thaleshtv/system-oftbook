import axios from 'axios'
import { useAuthStore } from '../store/userStore'
import { AxiosRequestConfig } from 'axios'

const baseURL = import.meta.env.VITE_BACKEND_URL

const api = axios.create({
  baseURL
})

const excludedRoutes = ['auth/login', 'auth/refresh', 'register']

const isRouteExcluded = (url?: string) =>
  url ? excludedRoutes.some((route) => url.includes(route)) : false

const setAuthorizationHeader = (config: AxiosRequestConfig): void => {
  const { token } = useAuthStore.getState().state

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
}

api.interceptors.request.use(
  (config) => {
    if (!isRouteExcluded(config.url)) {
      setAuthorizationHeader(config)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !isRouteExcluded(originalRequest.url)
    ) {
      originalRequest._retry = true
      try {
        await refreshAccessToken()
        const { token } = useAuthStore.getState().state
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, logout and redirect to login
        const { logOut } = useAuthStore.getState().dispatch
        logOut()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

const refreshAccessToken = async () => {
  try {
    const { refreshToken } = useAuthStore.getState().state

    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    // Import Auth dynamically to avoid circular dependency
    const { Auth } = await import('./auth')
    const response = await Auth.refreshToken({ refresh_token: refreshToken })

    const { setToken, setRefreshToken } = useAuthStore.getState().dispatch
    await setToken(response.access_token)
    setRefreshToken(response.refresh_token)

    return response
  } catch (error) {
    throw error
  }
}

export default api
