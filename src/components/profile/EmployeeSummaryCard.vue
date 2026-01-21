<template>
  <div
    class="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
  >
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-4">
        <div
          class="h-14 w-14 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800"
        >
          <img src="/images/user/owner.jpg" alt="Empleado" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">
            {{ displayName }}
          </h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">{{ displayRole }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">{{ displayEmail }}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          v-if="employeeExists"
          :to="`/empleado/editar/${employeeId}`"
          class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        >
          Editar
        </router-link>
        <router-link
          v-else
          to="/empleado/crear"
          class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
        >
          Crear perfil
        </router-link>
      </div>
    </div>
    <p v-if="loading" class="mt-3 text-xs text-gray-400">Cargando resumen...</p>
    <p v-else-if="!employeeExists" class="mt-3 text-xs text-gray-500 dark:text-gray-400">
      No existe perfil de empleado registrado.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/authServices'
import router from '@/router'

const authStore = useAuthStore()
const loading = ref(true)
const employeeExists = ref(false)
const employeeData = ref<Record<string, any> | null>(null)

const fetchData = async (retries = 3, delay = 1000) => {
  try {
    const user = authStore.user
    if (!user || !user.email) {
      throw new Error('No se encontro el usuario en sesion')
    }

    loading.value = true

    const response = await api.get(`/employees/by-email?email=${user.email}`)
    employeeData.value = response.data?.employee ?? response.data ?? null
    console.log(employeeData);
    employeeExists.value = Boolean(employeeData.value)
    loading.value = false
  } catch (error: any) {
    if (error.response?.status === 401) {
      loading.value = false
      router.push('/unauthorized')
      return
    }

    if (error.response?.status === 404) {
      loading.value = false
      employeeExists.value = false
      employeeData.value = null
      return
    }

    if (retries > 0) {
      setTimeout(() => fetchData(retries - 1, delay * 2), delay)
    } else {
      loading.value = false
    }
  }
}

onMounted(() => {
  fetchData()
})

const employeeId = computed(() => employeeData.value?.EmployeeId ?? 200)

const displayName = computed(() => {
  return (
    employeeData.value?.fullName ||
    employeeData.value?.name ||
    authStore.user?.name ||
    'Empleado'
  )
})

const displayRole = computed(() => {
  return employeeData.value?.position || employeeData.value?.role || 'Perfil pendiente'
})

const displayEmail = computed(() => {
  return employeeData.value?.email || authStore.user?.email || 'Sin correo'
})
</script>
