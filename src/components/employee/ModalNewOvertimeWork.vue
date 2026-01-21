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
          Solicitud de Horas Extras
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
              <span class="text-red-500">*</span> Total de Horas
            </label>
            <input
              v-model="form.TotalHours"
              type="number"
              min="1"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Fecha
            </label>
            <input
              v-model="form.RequestDate"
              type="date"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Cliente
            </label>
            <select
              v-model="form.Client"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option disabled value="">Seleccione un cliente</option>
              <option v-for="client in clients" :key="client.Id" :value="client.Id">
                {{ client.ClientName }}
              </option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Nombre del Proyecto
            </label>
            <input
              v-model="form.ProjectName"
              type="text"
              class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />
          </div>
          <div class="sm:col-span-2">
            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
              <span class="text-red-500">*</span> Detalle
            </label>
            <textarea
              v-model="form.Detail"
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
            @click="save"
          >
            Guardar
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
const clients = ref<Array<{ Id: string; ClientName: string }>>([])

const form = ref({
  Client: '',
  ProjectName: '',
  RequestDate: '',
  TotalHours: '',
  Status: 'Pendiente',
  Detail: '',
})

const loadCatalogs = async () => {
  try {
    const response = await api.get('/catalogs/by-names?names=clients')
    const catalogs = response.data.catalogs ?? {}
    clients.value = catalogs.clients ?? []
  } catch (error) {
    errorMessage.value = 'Error cargando catalogos.'
  }
}

const openModal = async () => {
  errorMessage.value = ''
  loading.value = true
  await loadCatalogs()
  isOpen.value = true
  loading.value = false
}

const closeModal = () => {
  isOpen.value = false
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    selectedFile.value = file
  }
}

const resetFileInput = () => {
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  form.value = {
    Client: '',
    ProjectName: '',
    RequestDate: '',
    TotalHours: '',
    Detail: '',
    Status: 'Pendiente',
  }
  selectedFile.value = null
  resetFileInput()
}

const save = async () => {
  try {
    errorMessage.value = ''
    if (
      !form.value.Client ||
      !form.value.ProjectName ||
      !form.value.RequestDate ||
      !form.value.TotalHours ||
      !form.value.Detail
    ) {
      errorMessage.value = 'Completar todos los campos requeridos.'
      return
    }
    if (!selectedFile.value) {
      errorMessage.value = 'Debe adjuntar un archivo de respaldo.'
      return
    }

    loading.value = true
    const formData = new FormData()
    formData.append('client', form.value.Client)
    formData.append('projectName', form.value.ProjectName)
    formData.append('requestDate', form.value.RequestDate)
    formData.append('totalHours', form.value.TotalHours)
    formData.append('status', form.value.Status)
    formData.append('detail', form.value.Detail)

    if (selectedFile.value) {
      formData.append('supportingDocument', selectedFile.value)
    }

    await api.post('overtimework-request', formData, {
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
