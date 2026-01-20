<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Inicio</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Panel principal del consultor con resumen de solicitudes y actividad.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Resumen</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div class="rounded-2xl bg-teal-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Vacaciones solicitadas</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.vacationRequestCount }}</p>
          </div>
          <div class="rounded-2xl bg-amber-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Horas extras</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.overtimeRequestCount }}</p>
          </div>
          <div class="rounded-2xl bg-green-600 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Vacaciones actuales</p>
            <p class="mt-2 text-2xl font-semibold">
              {{ summary.employeesOnVacationThisWeek }}
            </p>
          </div>
        </div>
      </div>

      <div>
        <ComponentCard title="Actividad reciente">
          <BarChartOne />
        </ComponentCard>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
        <h3 class="text-base font-medium text-gray-800 dark:text-white/90">Sugerencias del dia</h3>
        <ul class="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li v-for="(tip, index) in tips" :key="index">- {{ tip }}</li>
        </ul>
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import { ref } from 'vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import BarChartOne from '@/components/charts/BarChart/BarChartOne.vue'

const summary = ref({
  employeeCount: 42,
  vacationRequestCount: 3,
  overtimeRequestCount: 5,
  birthdayCount: 2,
  employeesOnVacationThisWeek: 1,
  activeClientProjects: 4,
})

const tips = ref([
  'Revisa tus solicitudes pendientes.',
  'Actualiza tu informacion personal.',
  'Consulta el calendario de feriados en configuracion.',
])
</script>
