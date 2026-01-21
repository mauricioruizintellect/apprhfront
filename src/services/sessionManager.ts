import { useAuthStore } from '@/stores/auth'
import { pinia } from '@/stores'

export const getUser = () => {
  const authStore = useAuthStore(pinia)
  return authStore.user
}
