<template>
  <Modal v-if="isOpen" fullScreenBackdrop @close="closeModal">
    <template #body>
      <div
        class="relative w-full max-w-4xl rounded-3xl bg-white p-6 shadow-theme-lg dark:bg-gray-900"
      >
        <button
          type="button"
          class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
          @click="closeModal"
        >
          <span class="text-lg">x</span>
        </button>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Solicitud de PTO
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Completa los datos para registrar la solicitud.
        </p>

        <div v-if="errorMessage" class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {{ errorMessage }}
        </div>

        <div v-if="loading" class="mt-4 text-sm text-gray-500">Cargando informacion...</div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Tipo de Solicitud
            </label>
            <select
              v-model="form.RequestType"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option disabled value="">Seleccione una opcion</option>
              <option value="Vacación">Vacacion</option>
              <option value="Permiso Médico">Permiso Medico</option>
              <option value="Feriado">Feriado</option>
              <option value="Permiso Personal - Descuento a Vacaciones">
                Permiso Personal - Descuento a Vacaciones
              </option>
              <option value="Permiso Personal - Descuento a Salario">
                Permiso Personal - Descuento a Salario
              </option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Total de Dias
            </label>
            <input
              v-model="form.TotalDays"
              type="number"
              min="1"
              readonly
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Fecha de Inicio
            </label>
            <input
              v-model="form.StartDate"
              type="date"
              :min="minStartDate"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Fecha de Fin
            </label>
            <input
              v-model="form.EndDate"
              type="date"
              :min="minEndDate"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Motivo
            </label>
            <textarea
              v-model="form.Reason"
              rows="3"
              class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            ></textarea>
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              Archivo respaldo
            </label>
            <input
              ref="fileInput"
              type="file"
              class="block w-full text-sm text-gray-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-500 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-600"
              @change="handleFileChange"
            />
            <p v-if="selectedFile" class="mt-2 text-xs text-gray-500">
              Archivo seleccionado: {{ selectedFile.name }}
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
            @click="closeModal"
          >
            Cancelar
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click.prevent.stop="save"
          >
            Guardar
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Modal from '@/components/ui/Modal.vue'
import api from '@/services/authServices'

const emit = defineEmits<{
  (event: 'saved'): void
}>()

const isOpen = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const selectedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  RequestType: '',
  StartDate: '',
  EndDate: '',
  TotalDays: 0,
  Status: 'Pendiente',
  Reason: '',
})

const minStartDate = computed(() => {
  const today = new Date()
  if (form.value.RequestType === 'Vacación') {
    today.setMonth(today.getMonth() + 2)
  }
  return today.toISOString().split('T')[0]
})

const minEndDate = computed(() => {
  const start = form.value.StartDate
    ? new Date(form.value.StartDate)
    : new Date(minStartDate.value)
  return start.toISOString().split('T')[0]
})

const countAllDays = (start?: string, end?: string) => {
  if (!start || !end) return 0
  const startDate = new Date(start)
  const endDate = new Date(end)
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return 0
  if (endDate < startDate) return 0

  let count = 0
  const current = new Date(startDate)
  while (current <= endDate) {
    count += 1
    current.setDate(current.getDate() + 1)
  }

  if (count > 15) return -1
  return count
}

watch(
  () => [form.value.StartDate, form.value.EndDate],
  ([start, end]) => {
    const totalDays = countAllDays(start, end)
    if (totalDays === -1) {
      form.value.EndDate = ''
      form.value.TotalDays = 0
      errorMessage.value = 'No puede seleccionar mas de 15 dias.'
    } else {
      form.value.TotalDays = totalDays
      errorMessage.value = ''
    }
  }
)

const openModal = async () => {
  loading.value = true
  isOpen.value = true
  loading.value = false
}

const closeModal = () => {
  isOpen.value = false
}

const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  form.value = {
    RequestType: '',
    StartDate: '',
    EndDate: '',
    TotalDays: 0,
    Status: 'Pendiente',
    Reason: '',
  }
  selectedFile.value = null
  resetFileInput()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

const save = async () => {
  try {
    errorMessage.value = ''
    if (
      !form.value.RequestType ||
      !form.value.StartDate ||
      !form.value.EndDate ||
      !form.value.TotalDays ||
      !form.value.Reason
    ) {
      errorMessage.value = 'Completar todos los campos requeridos.'
      return
    }

    if (form.value.RequestType === 'Permiso Médico' && !selectedFile.value) {
      errorMessage.value = 'Debe adjuntar un archivo de respaldo para Permiso Medico.'
      return
    }

    loading.value = true
    const formData = new FormData()
    formData.append('RequestType', form.value.RequestType)
    formData.append('StartDate', form.value.StartDate)
    formData.append('EndDate', form.value.EndDate)
    formData.append('TotalDays', String(form.value.TotalDays))
    formData.append('Status', form.value.Status)
    formData.append('Reason', form.value.Reason)

    if (selectedFile.value) {
      formData.append('supportingDocument', selectedFile.value)
    }

    await api.post('vacation-requests', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    resetForm()
    closeModal()
    emit('saved')
  } catch (error: any) {
    errorMessage.value =
      error?.response?.data?.message || 'Error creando la solicitud.'
  } finally {
    loading.value = false
  }
}

defineExpose({
  openModal,
})
</script>
