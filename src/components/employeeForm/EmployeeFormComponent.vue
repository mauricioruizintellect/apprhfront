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
      <EmployeeStepClouds
        v-else-if="currentStep === 2"
        ref="cloudsStepRef"
        v-model="formModel"
        :issuers="issuers"
        @valid-change="(value) => handleValidChange(2, value)"
      />
      <EmployeeStepSkills
        v-else-if="currentStep === 3"
        ref="techSkillsStepRef"
        v-model="formModel"
        :skill-catalog="technicalSkillsCatalog"
        :level-catalog="levelCatalog"
        title="Habilidades Tecnicas"
        skill-key="techSkills"
        @valid-change="(value) => handleValidChange(3, value)"
      />
      <EmployeeStepWorkExperience
        v-else-if="currentStep === 4"
        ref="workExperienceStepRef"
        v-model="formModel"
        :roles-list="rolesList"
        @valid-change="(value) => handleValidChange(4, value)"
      />
      <EmployeeStepAcademicDegrees
        v-else-if="currentStep === 5"
        ref="academicDegreesStepRef"
        v-model="formModel"
        @valid-change="(value) => handleValidChange(5, value)"
      />
      <EmployeeStepLanguages
        v-else-if="currentStep === 6"
        ref="languagesStepRef"
        v-model="formModel"
        :language-list="languageList"
        :level-options="languageLevelOptions"
        @valid-change="(value) => handleValidChange(6, value)"
      />
      <EmployeeStepSkills
        v-else-if="currentStep === 7"
        ref="softSkillsStepRef"
        v-model="formModel"
        :skill-catalog="softSkillsCatalog"
        :level-catalog="levelCatalog"
        title="Habilidades Blandas"
        skill-key="softSkills"
        @valid-change="(value) => handleValidChange(7, value)"
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
import EmployeeStepClouds from '@/components/employeeForm/steps/EmployeeStepClouds.vue'
import EmployeeStepSkills from '@/components/employeeForm/steps/EmployeeStepSkills.vue'
import EmployeeStepWorkExperience from '@/components/employeeForm/steps/EmployeeStepWorkExperience.vue'
import EmployeeStepAcademicDegrees from '@/components/employeeForm/steps/EmployeeStepAcademicDegrees.vue'
import EmployeeStepLanguages from '@/components/employeeForm/steps/EmployeeStepLanguages.vue'
import api from '@/services/authServices'

type CountryOption = { Id: string; CountryName: string }
type RoleOption = { Id: string; RoleName: string }
type CertificationOption = {
  Id: string
  IssuerId: string
  IssuerName?: string
  CertificationName: string
}
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

const steps = [
  { title: 'Informacion Personal' },
  { title: 'Certificaciones' },
  { title: 'Nubes' },
  { title: 'Habilidades Tecnicas' },
  { title: 'Experiencia Laboral' },
  { title: 'Titulos Academicos' },
  { title: 'Idiomas' },
  { title: 'Habilidades Blandas' },
]

type ExperienceFormModel = {
  id?: string | number
  role: string
  years: string
  period: string
  client: string
  description: string
  startDate: string
  endDate: string
}

type AcademicDegreeFormModel = {
  id?: string | number
  degree: string
  institution: string
  startDate: string
  endDate: string
  level: string
  status: string
}

type FormModelWithExperience = EmployeeFormModel & {
  experience: ExperienceFormModel[]
  academicDegrees: AcademicDegreeFormModel[]
  languages: LanguageFormModel[]
}

type LanguageFormModel = {
  id?: string | number
  languageId: string
  languageName: string
  writtenLanguageLevelId: string
  spokenLanguageLevelId: string
  writtenLevelName: string
  spokenLevelName: string
}

const countries = ref<CountryOption[]>([])
const rolesList = ref<RoleOption[]>([])
const catalogCertificationOptions = ref<CertificationOption[]>([])
const issuers = ref<IssuerOption[]>([])
const technicalSkillsCatalog = ref<Array<{ Id: string; SkillName: string }>>([])
const softSkillsCatalog = ref<Array<{ Id: string; SkillName: string }>>([])
const levelCatalog = ref<Array<{ Id: string; Name: string }>>([])
const languageList = ref<Array<{ Id: string; LanguageName: string }>>([])
const languageLevelOptions = ref<Array<{ Id: string; Name: string }>>([])
const isCatalogLoading = ref(false)

const formModel = reactive<FormModelWithExperience>({
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
  clouds: [],
  techSkills: [],
  softSkills: [],
  experience: [],
  academicDegrees: [],
  languages: [],
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
const cloudsStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)
const techSkillsStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)
const softSkillsStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)
const workExperienceStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)
const academicDegreesStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(
  null
)
const languagesStepRef = ref<{ validate: (showErrors?: boolean) => boolean } | null>(null)

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

const getStepValidator = () => {
  if (currentStep.value === 0) return personalStepRef.value?.validate
  if (currentStep.value === 1) return certificationsStepRef.value?.validate
  if (currentStep.value === 2) return cloudsStepRef.value?.validate
  if (currentStep.value === 3) return techSkillsStepRef.value?.validate
  if (currentStep.value === 4) return workExperienceStepRef.value?.validate
  if (currentStep.value === 5) return academicDegreesStepRef.value?.validate
  if (currentStep.value === 6) return languagesStepRef.value?.validate
  if (currentStep.value === 7) return softSkillsStepRef.value?.validate
  return undefined
}

const goNext = () => {
  const validate = getStepValidator()
  const isValid = validate ? validate() : true
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
  const validate = getStepValidator()
  const isValid = validate ? validate() : true
  if (!isValid) return
  const payload = {
    ...mapFormToPayload(formModel, props.mode),
    experience: formModel.experience,
    academicDegrees: formModel.academicDegrees,
    languages: formModel.languages,
  }
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
    const skills = catalogs.skills ?? []
    const genericCatalogs = catalogs.genericCatalogs ?? []
    const languages = catalogs.languages ?? []
    catalogCertificationOptions.value = rawCertifications
      .map((certification: Record<string, any>) => ({
        Id: certification.Id ?? certification.id ?? '',
        IssuerId:
          certification.IssuerId ??
          certification.issuerId ??
          certification.Issuer ??
          certification.issuer ??
          certification.IssuerName ??
          certification.issuerName ??
          '',
        IssuerName:
          certification.IssuerName ??
          certification.issuerName ??
          certification.Issuer ??
          certification.issuer ??
          '',
        CertificationName:
          certification.CertName ??
          certification.CertificationName ??
          certification.certName ??
          certification.name ??
          '',
      }))
      .filter(
        (certification: CertificationOption) =>
          certification.Id && certification.IssuerId
      )
    technicalSkillsCatalog.value = skills.filter(
      (skill: Record<string, any>) => skill.SkillType === 'Technical'
    )
    softSkillsCatalog.value = skills.filter(
      (skill: Record<string, any>) => skill.SkillType === 'Soft'
    )
    levelCatalog.value = genericCatalogs.filter(
      (catalog: Record<string, any>) => catalog.CatalogType === 'SkillPercentage'
    )
    languageLevelOptions.value = genericCatalogs.filter(
      (catalog: Record<string, any>) => catalog.CatalogType === 'LanguageLevel'
    )
    languageList.value = languages
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
      const dtoAny = value as {
        experience?: Array<Record<string, any>>
        academicDegrees?: Array<Record<string, any>>
        languages?: Array<Record<string, any>>
      }
      formModel.experience = Array.isArray(dtoAny.experience)
        ? dtoAny.experience.map((exp: Record<string, any>) => ({
            id: exp.id,
            role: exp.role ?? '',
            years: exp.years ?? '',
            period: exp.period ?? '',
            client: exp.client ?? '',
            description: exp.description ?? '',
            startDate: exp.startDate ? exp.startDate.slice(0, 10) : '',
            endDate: exp.endDate ? exp.endDate.slice(0, 10) : '',
          }))
        : []
      formModel.academicDegrees = Array.isArray(dtoAny.academicDegrees)
        ? dtoAny.academicDegrees.map((degree: Record<string, any>) => ({
            id: degree.id,
            degree: degree.degree ?? '',
            institution: degree.institution ?? '',
            startDate: degree.startDate ? degree.startDate.slice(0, 10) : '',
            endDate: degree.endDate ? degree.endDate.slice(0, 10) : '',
            level: degree.level ?? '',
            status: degree.status ?? '',
          }))
        : []
      formModel.languages = Array.isArray(dtoAny.languages)
        ? dtoAny.languages.map((lang: Record<string, any>) => ({
            id: lang.id,
            languageId: lang.languageId ?? '',
            languageName: lang.languageName ?? '',
            writtenLanguageLevelId: lang.writtenLanguageLevelId ?? '',
            spokenLanguageLevelId: lang.spokenLanguageLevelId ?? '',
            writtenLevelName: lang.writtenLevelName ?? '',
            spokenLevelName: lang.spokenLevelName ?? '',
          }))
        : []
    }
  },
  { immediate: true }
)
</script>
