<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">Panel Admin</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Acceso completo para administracion y configuracion del sistema.
        </p>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">Resumen general</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div class="rounded-2xl bg-blue-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Empleados</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.employeeCount }}</p>
          </div>
          <div class="rounded-2xl bg-teal-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Vacaciones solicitadas</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.vacationRequestCount }}</p>
          </div>
          <div class="rounded-2xl bg-amber-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Horas extras</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.overtimeRequestCount }}</p>
          </div>
          <div class="rounded-2xl bg-purple-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Cumpleanos del mes</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.birthdayCount }}</p>
          </div>
          <div class="rounded-2xl bg-green-600 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Vacaciones actuales</p>
            <p class="mt-2 text-2xl font-semibold">
              {{ summary.employeesOnVacationThisWeek }}
            </p>
          </div>
          <div class="rounded-2xl bg-orange-500 p-5 text-white shadow-theme-xs">
            <p class="text-sm/6 text-white/80">Proyectos en ejecucion</p>
            <p class="mt-2 text-2xl font-semibold">{{ summary.activeClientProjects }}</p>
          </div>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-2">
        <ComponentCard title="Tendencia anual">
          <LineChartOne />
        </ComponentCard>
        <ComponentCard title="Resumen mensual">
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
import { onMounted, ref } from 'vue'
import ComponentCard from '@/components/common/ComponentCard.vue'
import LineChartOne from '@/components/charts/LineChart/LineChartOne.vue'
import BarChartOne from '@/components/charts/BarChart/BarChartOne.vue'
import api from '@/services/authServices'

const summary = ref({
  employeeCount: 0,
  vacationRequestCount: 0,
  overtimeRequestCount: 0,
  birthdayCount: 0,
  employeesOnVacationThisWeek: 0,
  activeClientProjects: 0,
})

const tips = ref([
  'Revisa solicitudes pendientes y aprobaciones.',
  'Actualiza los datos de personal cuando cambien.',
  'Monitorea los proyectos activos semanalmente.',
])

onMounted(async () => {
  try {
    const response = await api.get('/dashboard/summary')
    const result = response.data?.result ?? response.data ?? {}
    summary.value.employeeCount = result.employeeCount ?? 0
    summary.value.vacationRequestCount = result.vacationRequestCount ?? 0
    summary.value.overtimeRequestCount = result.overtimeRequestCount ?? 0
    summary.value.birthdayCount = result.birthdayCount ?? 0
    summary.value.employeesOnVacationThisWeek = result.employeesOnVacationThisWeek ?? 0
    summary.value.activeClientProjects = result.activeClientProjects ?? 0
  } catch (error) {
    console.error('Error al cargar resumen:', error)
  }
})
</script>
