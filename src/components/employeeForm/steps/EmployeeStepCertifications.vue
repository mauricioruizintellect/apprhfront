<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Certificaciones</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gestiona las certificaciones del empleado.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        @click="openModal"
      >
        Agregar certificacion
      </button>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3">Emisor</th>
            <th class="px-4 py-3">Certificacion</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(certification, index) in formModel.certifications"
            :key="`${certification.issuer}-${certification.certId}-${index}`"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-4 py-3">{{ certification.issuer }}</td>
            <td class="px-4 py-3">{{ certification.name }}</td>
            <td class="px-4 py-3 text-right">
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                @click="removeCertification(index)"
              >
                Eliminar
              </button>
            </td>
          </tr>
          <tr v-if="formModel.certifications.length === 0">
            <td colspan="3" class="px-4 py-6 text-center text-sm text-gray-500">
              No hay certificaciones registradas.
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
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            Nueva certificacion
          </h4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Selecciona el emisor y la certificacion.
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
                <span class="text-red-500">*</span> Certificacion
              </label>
              <select
                v-model="draft.certId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione una certificacion</option>
                <option v-for="cert in availableCertifications" :key="cert.Id" :value="cert.Id">
                  {{ cert.CertificationName }}
                </option>
              </select>
              <p v-if="errors.certId" class="mt-1 text-xs text-red-500">{{ errors.certId }}</p>
            </div>
          </div>
          <p v-if="isLoadingCatalog" class="mt-2 text-xs text-gray-400">
            Cargando certificaciones...
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
              @click="addCertification"
            >
              Agregar
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { EmployeeFormModel } from '@/types/employee'
import Modal from '@/components/ui/Modal.vue'
import api from '@/services/authServices'

type CertificationOption = { Id: string; IssuerId: string; CertificationName: string }
type IssuerOption = { Id: string; IssuerName: string; IssuerType?: string }

const props = defineProps<{
  modelValue: EmployeeFormModel
  certificationOptions?: CertificationOption[]
  issuers?: IssuerOption[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: EmployeeFormModel): void
  (event: 'valid-change', value: boolean): void
}>()

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isModalOpen = ref(false)

const draft = reactive({
  issuerId: '',
  certId: '',
})

const errors = reactive<Record<string, string>>({})

const issuerOptions = computed(() => {
  if (props.issuers?.length) {
    return props.issuers.filter((issuer) =>
      issuer.IssuerType ? issuer.IssuerType.includes('Certification') : true
    )
  }

  const uniqueIssuers = new Map<string, IssuerOption>()
  ;(props.certificationOptions ?? []).forEach((option) => {
    if (option.Issuer) {
      uniqueIssuers.set(option.Issuer, {
        Id: option.Issuer,
        IssuerName: option.Issuer,
      })
    }
  })
  return Array.from(uniqueIssuers.values())
})

const availableCertifications = ref<CertificationOption[]>([])
const isLoadingCatalog = ref(false)

const resetDraft = () => {
  draft.issuerId = ''
  draft.certId = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const openModal = () => {
  resetDraft()
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const addCertification = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!draft.issuerId) {
    errors.issuerId = 'Debe seleccionar un emisor'
  }
  if (!draft.certId) {
    errors.certId = 'Debe seleccionar una certificacion'
  }
  if (Object.keys(errors).length > 0) return

  const selectedCert = availableCertifications.value.find(
    (certification) => String(certification.Id) === String(draft.certId)
  )
  if (!selectedCert) {
    errors.certId = 'Certificacion invalida'
    return
  }

  const issuerName =
    issuerOptions.value.find((issuer) => issuer.Id === draft.issuerId)?.IssuerName ??
    draft.issuerId
  const duplicate = formModel.value.certifications.some(
    (certification) =>
      String(certification.certId) === String(draft.certId)
  )
  if (duplicate) {
    errors.certId = 'Certificacion ya agregada'
    return
  }
  formModel.value.certifications.push({
    certId: String(selectedCert.Id),
    name: selectedCert.CertificationName,
    issuer: issuerName
  })

  closeModal()
}

const removeCertification = (index: number) => {
  formModel.value.certifications.splice(index, 1)
}

const validate = () => {
  const hasInvalid = formModel.value.certifications.some(
    (certification) => !certification.issuer || !certification.certId
  )
  emit('valid-change', !hasInvalid)
  return !hasInvalid
}

const loadCertificationsByIssuer = async (issuerId: string) => {
  if (!issuerId) {
    availableCertifications.value = []
    return
  }

  if (props.certificationOptions?.length) {
    availableCertifications.value = props.certificationOptions.filter(
      (option) => String(option.IssuerId) === String(issuerId)
    )
    return
  }

  try {
    isLoadingCatalog.value = true
    const response = await api.get(`/catalogs/certifications/issuer/${issuerId}`)
    availableCertifications.value = response.data ?? []
  } catch (error) {
    console.error('Error al cargar certificaciones:', error)
    availableCertifications.value = []
  } finally {
    isLoadingCatalog.value = false
  }
}

watch(
  () => formModel.value.certifications,
  () => {
    validate()
  },
  { deep: true, immediate: true }
)

watch(
  () => draft.issuerId,
  (value) => {
    draft.certId = ''
    loadCertificationsByIssuer(value)
  }
)

defineExpose({
  validate,
})
</script>
