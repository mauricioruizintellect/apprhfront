<template>
  <AdminLayout>
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Panel Admin</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Acceso completo para administracion y configuracion del sistema.
        </p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Crea aqui los widgets, metricas y accesos rapidos del rol admin.
        </p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
