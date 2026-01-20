<template>
  <AdminLayout>
    <div class="space-y-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Panel Usuario Interno
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Vista principal para usuarios internos con accesos limitados.
        </p>
      </div>
      <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Agrega aqui los modulos y tareas operativas del usuario interno.
        </p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
</script>
