import { defineStore } from 'pinia'

type AuthUser = {
  role?: string
  [key: string]: any
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: null as string | null,
    refreshToken: null as string | null,
    user: null as AuthUser | null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.accessToken),
  },
  actions: {
    initAuth() {
      this.accessToken = localStorage.getItem('accessToken')
      this.refreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        try {
          this.user = JSON.parse(storedUser) as AuthUser
        } catch (error) {
          console.warn('No se pudo leer el usuario almacenado:', error)
          this.user = null
        }
      } else {
        this.user = null
      }
    },
    setToken(token: string) {
      this.accessToken = token
      localStorage.setItem('accessToken', token)
    },
    setRefreshToken(token: string | null) {
      this.refreshToken = token
      if (token) {
        localStorage.setItem('refreshToken', token)
      } else {
        localStorage.removeItem('refreshToken')
      }
    },
    setUser(user: AuthUser | null) {
      this.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    clearAuth() {
      this.accessToken = null
      this.refreshToken = null
      this.user = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
    logout() {
      this.clearAuth()
      window.location.href = '/login'
    },
  },
})
