<template>
  <AdminLayout>
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Inicio</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ isAdmin ? 'Panel de control para administracion.' : 'Panel principal del consultor.' }}
        </p>
      </div>
      <div
        v-if="isAdmin"
        class="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
      >
        Espacio reservado para indicadores de gestion, reportes globales y accesos rapidos.
      </div>
      <div
        v-else
        class="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-sm text-gray-500 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
      >
        Espacio reservado para tareas personales, solicitudes y resumen de actividades.
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>
