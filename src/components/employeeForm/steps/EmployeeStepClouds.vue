<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Nubes</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Administra las nubes asociadas al empleado.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        @click="openModal"
      >
        Agregar nube
      </button>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3">Nube</th>
            <th class="px-4 py-3">Emisor</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, index) in formModel.clouds"
            :key="`${entry.cloudId}-${entry.issuerId}-${index}`"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-4 py-3">{{ entry.cloudName }}</td>
            <td class="px-4 py-3">{{ entry.issuerName }}</td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                @click="openDeleteModal(index)"
              >
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="formModel.clouds.length === 0">
            <td colspan="3" class="px-4 py-6 text-center text-sm text-gray-500">
              No hay nubes registradas.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="isModalOpen" fullScreenBackdrop @close="closeModal">
      <template #body>
        <div
          class="relative w-full max-w-xl rounded-3xl bg-white p-6 shadow-theme-lg dark:bg-gray-900"
        >
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="closeModal"
          >
            <span class="text-lg">x</span>
          </button>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">Nueva nube</h4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Selecciona el emisor y la nube.
          </p>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Emisor
              </label>
              <select
                v-model="draft.issuerId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione un emisor</option>
                <option v-for="issuer in issuerOptions" :key="issuer.Id" :value="issuer.Id">
                  {{ issuer.IssuerName }}
                </option>
              </select>
              <p v-if="errors.issuerId" class="mt-1 text-xs text-red-500">
                {{ errors.issuerId }}
              </p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Nube
              </label>
              <select
                v-model="draft.cloudId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione una nube</option>
                <option v-for="cloud in cloudsByIssuer" :key="cloud.Id" :value="cloud.Id">
                  {{ cloud.CloudName }}
                </option>
              </select>
              <p v-if="errors.cloudId" class="mt-1 text-xs text-red-500">
                {{ errors.cloudId }}
              </p>
            </div>
          </div>

          <p v-if="isLoadingClouds" class="mt-3 text-xs text-gray-400">
            Cargando nubes...
          </p>
          <p v-if="cloudLoadError" class="mt-2 text-xs text-red-500">
            {{ cloudLoadError }}
          </p>

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
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
              @click="addCloud"
            >
              Agregar
            </button>
          </div>
        </div>
      </template>
    </Modal>

    <Modal v-if="isConfirmOpen" fullScreenBackdrop @close="closeConfirm">
      <template #body>
        <div
          class="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-theme-lg dark:bg-gray-900"
        >
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Confirmar eliminacion
          </h4>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            ¿Estas seguro de que deseas eliminar esta nube?
          </p>
          <div class="mt-6 flex justify-end gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
              @click="closeConfirm"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-red-600"
              @click="confirmDeletion"
            >
              Eliminar
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/authServices'
import type { EmployeeFormModel } from '@/types/employee'
import Modal from '@/components/ui/Modal.vue'

type IssuerOption = { Id: string; IssuerName: string; IssuerType?: string[] | string }
type CloudOption = { Id: string; CloudName: string }

const props = defineProps<{
  modelValue: EmployeeFormModel
  issuers: IssuerOption[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: EmployeeFormModel): void
  (event: 'valid-change', value: boolean): void
}>()

const route = useRoute()

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const pendingDeletionIndex = ref<number | null>(null)
const isLoadingClouds = ref(false)
const cloudLoadError = ref('')

const draft = reactive({
  issuerId: '',
  cloudId: '',
})

const errors = reactive<Record<string, string>>({})
const cloudsByIssuer = ref<CloudOption[]>([])

const issuerOptions = computed(() => {
  return props.issuers.filter((issuer) => {
    if (!issuer.IssuerType) return true
    if (Array.isArray(issuer.IssuerType)) {
      return issuer.IssuerType.includes('Cloud')
    }
    return issuer.IssuerType.includes('Cloud')
  })
})

const resetDraft = () => {
  draft.issuerId = ''
  draft.cloudId = ''
  cloudsByIssuer.value = []
  cloudLoadError.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const openModal = () => {
  resetDraft()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const openDeleteModal = (index: number) => {
  pendingDeletionIndex.value = index
  isConfirmOpen.value = true
}

const closeConfirm = () => {
  isConfirmOpen.value = false
}

const confirmDeletion = async () => {
  if (pendingDeletionIndex.value === null) return
  await removeEntry(pendingDeletionIndex.value)
  pendingDeletionIndex.value = null
  isConfirmOpen.value = false
}

const loadCloudsByIssuer = async (issuerId: string) => {
  if (!issuerId) {
    cloudsByIssuer.value = []
    return
  }

  try {
    isLoadingClouds.value = true
    cloudLoadError.value = ''
    const response = await api.get(`/catalogs/clouds/issuer/${issuerId}`)
    cloudsByIssuer.value = response.data ?? []
    if (cloudsByIssuer.value.length === 0) {
      cloudLoadError.value =
        'Este emisor no tiene nubes configuradas. Selecciona otro o solicita al administrador que las agregue.'
    }
  } catch (error) {
    console.error('Error cargando nubes:', error)
    cloudLoadError.value = 'Error cargando nubes.'
    cloudsByIssuer.value = []
  } finally {
    isLoadingClouds.value = false
  }
}

const addCloud = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!draft.issuerId) {
    errors.issuerId = 'Debe seleccionar un emisor'
  }
  if (!draft.cloudId) {
    errors.cloudId = 'Debe seleccionar una nube'
  }
  if (Object.keys(errors).length > 0) return

  const duplicate = formModel.value.clouds.some(
    (cloud) => String(cloud.cloudId) === String(draft.cloudId)
  )
  if (duplicate) {
    errors.cloudId = 'No se puede duplicar el registro'
    return
  }

  const selectedCloud = cloudsByIssuer.value.find(
    (cloud) => String(cloud.Id) === String(draft.cloudId)
  )
  const issuerName =
    issuerOptions.value.find((issuer) => issuer.Id === draft.issuerId)?.IssuerName ??
    draft.issuerId

  if (!selectedCloud) {
    errors.cloudId = 'Nube invalida'
    return
  }

  formModel.value.clouds.push({
    issuerId: draft.issuerId,
    issuerName,
    cloudId: String(selectedCloud.Id),
    cloudName: selectedCloud.CloudName,
  })

  closeModal()
}

const removeEntry = async (index: number) => {
  const currentRecord = formModel.value.clouds[index]
  if (currentRecord?.id) {
    await deleteCloud(currentRecord.id)
  }
  formModel.value.clouds.splice(index, 1)
}

const deleteCloud = async (id: string | number) => {
  try {
    const employeeId = route.params.id
    await api.delete(`/employees/${employeeId}/clouds/${id}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    console.error('Error al eliminar la nube:', error)
    cloudLoadError.value = 'Error al eliminar la nube.'
  }
}

const validate = () => {
  const hasInvalid = formModel.value.clouds.some(
    (cloud) => !cloud.issuerId || !cloud.cloudId
  )
  emit('valid-change', !hasInvalid)
  return !hasInvalid
}

watch(
  () => formModel.value.clouds,
  () => {
    validate()
  },
  { deep: true, immediate: true }
)

watch(
  () => draft.issuerId,
  (value) => {
    draft.cloudId = ''
    loadCloudsByIssuer(value)
  }
)

defineExpose({
  validate,
})
</script>
