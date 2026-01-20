<template>
  <AdminLayout>
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Evaluaciones</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Seguimiento de evaluaciones y desempeno.
        </p>
      </div>
      <div
        class="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
      >
        Aqui se mostraran los resultados y formularios de evaluacion.
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
