<template>
  <DefaultLayout>
    <EmployeeFormComponent mode="create" @submit="handleSubmit" @cancel="handleCancel" />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import EmployeeFormComponent from '@/components/employeeForm/EmployeeFormComponent.vue'

const handleSubmit = (payload: unknown) => {
  console.log('Crear empleado:', payload)
}

const handleCancel = () => {
  console.log('Cancelar')
}
</script>
