<template>
  <DefaultLayout>
    <EmployeeFormComponent
      mode="edit"
      :initialEmployee="initialEmployee"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import EmployeeFormComponent from '@/components/employeeForm/EmployeeFormComponent.vue'
import api from '@/services/authServices'
import type { EmployeeDTO } from '@/types/employee'

const route = useRoute()
const initialEmployee = ref<EmployeeDTO | null>(null)

const loadEmployee = async () => {
  const employeeId = route.params.id ?? 200
  try {
    const response = await api.get(`/employees/view/${employeeId}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
    console.log(JSON.stringify(response.data));
    initialEmployee.value = response.data?.employee ?? null
  } catch (error) {
    console.error('Error al cargar empleado:', error)
  } finally {
    // no-op
  }
}

onMounted(() => {
  loadEmployee()
})

const handleSubmit = (payload: unknown) => {
  console.log('Actualizar empleado:', payload)
}

const handleCancel = () => {
  console.log('Cancelar')
}
</script>
