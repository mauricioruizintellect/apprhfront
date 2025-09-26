import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

// Extiende la configuración de Axios para permitir `_retry`
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

const isProduction = window.location.href.includes('intellectsystem')
const API_URL = isProduction
  ? 'https://work.intellectsystem.net/api'
  : 'https://work.intellectsystem.net/api'

const api = axios.create({ baseURL: API_URL })

// Interceptor para agregar el Access Token en cada solicitud
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = sessionStorage.getItem('accessToken')
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

    // Caso 401 → intentar refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = sessionStorage.getItem('refreshToken')
        const { data } = await axios.post<{ accessToken: string }>(
          `${API_URL}/refresh-token`,
          { refreshToken }
        )
        sessionStorage.setItem('accessToken', data.accessToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        sessionStorage.clear()
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  }
)

export default api