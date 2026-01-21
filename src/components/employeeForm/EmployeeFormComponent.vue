<template>
  <div class="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white/90">
          {{ mode === 'edit' ? 'Editar Empleado' : 'Nuevo Empleado' }}
        </h2>
        <p v-if="mode === 'edit'" class="text-xs font-medium text-brand-500">
          Editando empleado
        </p>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Paso {{ currentStep + 1 }} de {{ steps.length }}
      </div>
    </div>

    <div class="mt-6 flex flex-wrap gap-2">
      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
        :class="
          index === currentStep
            ? 'bg-brand-500 text-white'
            : index < currentStep
              ? 'bg-brand-50 text-brand-600'
              : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
        "
      >
        <span class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
          {{ index + 1 }}
        </span>
        {{ step.title }}
      </div>
    </div>

    <div class="mt-6">
      <div
        v-if="isCatalogLoading"
        class="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400"
      >
        Cargando catalogos...
      </div>
      <EmployeeStepPersonal
        v-else-if="currentStep === 0"
        ref="personalStepRef"
        v-model="formModel"
        :mode="mode"
        :countries="countries"
        :roles-list="rolesList"
        @valid-change="(value) => handleValidChange(0, value)"
      />
      <EmployeeStepCertifications
        v-else-if="currentStep === 1"
        ref="certificationsStepRef"
        v-model="formModel"
        :certification-options="resolvedCertificationOptions"
        :issuers="issuers"
        @valid-change="(value) => handleValidChange(1, value)"
      />
    </div>

    <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
        @click="emit('cancel')"
      >
        Cancelar
      </button>

      <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
          :disabled="currentStep === 0"
          @click="goBack"
        >
          Atras
        </button>
        <button
          v-if="!isLastStep"
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!isCurrentStepValid"
          @click="goNext"
        >
          Siguiente
        </button>
        <button
          v-else
          type="button"
          class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!isCurrentStepValid"
          @click="handleSubmit"
        >
          Guardar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import type { EmployeeDTO, EmployeeFormModel } from '@/types/employee'
import { mapDtoToForm, mapFormToPayload } from '@/utils/employeeMapper'
import EmployeeStepPersonal from '@/components/employeeForm/steps/EmployeeStepPersonal.vue'
import EmployeeStepCertifications from '@/components/employeeForm/steps/EmployeeStepCertifications.vue'
import api from '@/services/authServices'

type CountryOption = { Id: string; CountryName: string }
type RoleOption = { Id: string; RoleName: string }
type CertificationOption = { Id: string; Issuer: string; CertName: string }
type IssuerOption = { Id: string; IssuerName: string; IssuerType?: string }

const props = defineProps<{
  mode: 'create' | 'edit'
  initialEmployee?: EmployeeDTO | null
  certificationOptions?: CertificationOption[]
}>()

const emit = defineEmits<{
  (event: 'submit', payload: ReturnType<typeof mapFormToPayload>): void
  (event: 'cancel'): void
  (event: 'step-change', stepIndex: number): void
}>()

const steps = [{ title: 'Informacion Personal' }, { title: 'Certificaciones' }]

const countries = ref<CountryOption[]>([])
const rolesList = ref<RoleOption[]>([])
const catalogCertificationOptions = ref<CertificationOption[]>([])
const issuers = ref<IssuerOption[]>([])
const isCatalogLoading = ref(false)

const formModel = reactive<EmployeeFormModel>({
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  position: '',
  phone: '',
  department: '',
  gender: '',
  birthDate: '',
  countryOfBirth: '',
  countryOfResidence: '',
  mobilePhone: '',
  citizenshipCardNumber: '',
  passportNumber: '',
  hasAmericanVisa: false,
  physicalAddress: '',
  dateEntry: '',
  typeOfConsultant: '',
  percentageAvailability: '',
  professionalExperienceYears: '',
  salesforceExperienceYears: '',
  rolesPerformed: [],
  certifications: [],
  description: '',
  allergies: '',
  preExistingIllnesses: '',
  dietaryRestrictions: '',
  bloodType: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyContactRelationship: '',
  inProject: false,
  status: false,
})

const currentStep = ref(0)
const stepValidStates = ref(steps.map(() => true))
const personalStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)
const certificationsStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)

const isLastStep = computed(() => currentStep.value === steps.length - 1)
const isCurrentStepValid = computed(
  () => stepValidStates.value[currentStep.value] ?? true
)
const resolvedCertificationOptions = computed(() => {
  return props.certificationOptions?.length
    ? props.certificationOptions
    : catalogCertificationOptions.value
})

const handleValidChange = (stepIndex: number, value: boolean) => {
  stepValidStates.value[stepIndex] = value
}

const goNext = () => {
  const isValid = currentStep.value === 0
    ? personalStepRef.value?.validate()
    : certificationsStepRef.value?.validate()
  if (!isValid) return
  currentStep.value += 1
  emit('step-change', currentStep.value)
}

const goBack = () => {
  if (currentStep.value === 0) return
  currentStep.value -= 1
  emit('step-change', currentStep.value)
}

const handleSubmit = () => {
  const isValid = currentStep.value === 0
    ? personalStepRef.value?.validate()
    : certificationsStepRef.value?.validate()
  if (!isValid) return
  const payload = mapFormToPayload(formModel, props.mode)
  emit('submit', payload)
}

const loadCatalogs = async () => {
  try {
    isCatalogLoading.value = true
    const response = await api.get('/catalogs', {
      headers: { 'Cache-Control': 'no-cache' },
    })
    const catalogs = response.data.catalogs ?? {}
    countries.value = catalogs.countries ?? []
    rolesList.value = catalogs.roles ?? []
    issuers.value = catalogs.issuers ?? []
    const rawCertifications = catalogs.certifications ?? catalogs.certificationOptions ?? []
    catalogCertificationOptions.value = rawCertifications
      .map((certification: Record<string, any>) => ({
        Id: certification.Id ?? certification.id ?? '',
        Issuer: certification.Issuer ?? certification.IssuerName ?? certification.issuer ?? '',
        CertName:
          certification.CertName ??
          certification.CertificationName ??
          certification.certName ??
          '',
      }))
      .filter((certification: CertificationOption) => certification.Id && certification.Issuer)
  } catch (error) {
    console.error('Error al cargar catalogos:', error)
  } finally {
    isCatalogLoading.value = false
  }
}

onMounted(() => {
  loadCatalogs()
})

watch(
  () => props.initialEmployee,
  (value) => {
    if (props.mode === 'edit' && value) {
      Object.assign(formModel, mapDtoToForm(value))
    }
  },
  { immediate: true }
)
</script>
