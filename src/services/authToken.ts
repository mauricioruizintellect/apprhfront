import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

export const getAuthToken = () => {
  const authStore = useAuthStore(pinia)
  return authStore.accessToken
}
