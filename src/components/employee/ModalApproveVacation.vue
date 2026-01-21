<template>
  <Modal v-if="isOpen" fullScreenBackdrop @close="closeModal">
    <template #body>
      <div
        class="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-theme-lg dark:bg-gray-900"
      >
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          @click="closeModal"
        >
          <span class="text-lg">x</span>
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Aprobar Solicitud
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Revisa la solicitud seleccionada.
        </p>

        <div class="mt-6 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div>
            <span class="font-medium text-gray-700 dark:text-gray-200">ID:</span>
            {{ recordId }}
          </div>
          <div>
            <span class="font-medium text-gray-700 dark:text-gray-200">Empleado:</span>
            {{ vacationRecord?.FullName || '-' }}
          </div>
          <div>
            <span class="font-medium text-gray-700 dark:text-gray-200">Tipo:</span>
            {{ vacationRecord?.RequestType || '-' }}
          </div>
        </div>

        <div class="mt-6 rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-gray-800">
          Acciones de aprobacion pendientes de integracion.
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from '@/components/ui/Modal.vue'

defineProps<{
  vacationRecord: Record<string, any>
  recordId: number
}>()

const isOpen = ref(false)

const openModal = () => {
  isOpen.value = true
}

const closeModal = () => {
  isOpen.value = false
}

defineExpose({
  openModal,
})
</script>
