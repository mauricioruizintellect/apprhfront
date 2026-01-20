import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'
import { getAuthToken } from '@/services/authToken'
import { API_URL } from '@/services/apiConfig'

// Extiende la configuración de Axios para permitir `_retry`
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({ baseURL: API_URL })

// Interceptor para agregar el Access Token en cada solicitud
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar expiración del token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig

    // Caso ECONNRESET → reintentar una vez
    if (
      error.response &&
      (error.response.data as any)?.error === 'read ECONNRESET' &&
      !originalRequest._retry
    ) {
      console.warn('El backend devolvió ECONNRESET. Reintentando...')
      originalRequest._retry = true
      return api(originalRequest)
    }

    // Caso 401 → cerrar sesion y redirigir
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const authStore = useAuthStore(pinia)
      authStore.logout()
    }

    return Promise.reject(error)
  }
)

export default api
