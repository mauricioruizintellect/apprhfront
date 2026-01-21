<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gestiona las habilidades del empleado.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        @click="openModal"
      >
        Agregar Skill
      </button>
    </div>

    <div v-if="isLoading" class="text-sm text-gray-500">Cargando...</div>

    <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3">Habilidad</th>
            <th class="px-4 py-3">Dominio (%)</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(skill, index) in skillsList"
            :key="`${skill.skillId}-${index}`"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-4 py-3">{{ skill.skillName }}</td>
            <td class="px-4 py-3">{{ skill.levelName }}</td>
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
          <tr v-if="skillsList.length === 0">
            <td colspan="3" class="px-4 py-6 text-center text-sm text-gray-500">
              No hay habilidades registradas.
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
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ title }}</h4>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Selecciona la habilidad y el nivel de dominio.
          </p>

          <div class="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Habilidad
              </label>
              <select
                v-model="draft.skillId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione una habilidad</option>
                <option v-for="skill in skillCatalog" :key="skill.Id" :value="skill.Id">
                  {{ skill.SkillName }}
                </option>
              </select>
              <p v-if="errors.skillId" class="mt-1 text-xs text-red-500">{{ errors.skillId }}</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Dominio (%)
              </label>
              <select
                v-model="draft.levelId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione Dominio (%)</option>
                <option v-for="level in levelCatalog" :key="level.Id" :value="level.Id">
                  {{ level.Name }}
                </option>
              </select>
              <p v-if="errors.levelId" class="mt-1 text-xs text-red-500">{{ errors.levelId }}</p>
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
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
              @click="handleSubmit"
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
            ¿Estas seguro de que deseas eliminar esta habilidad?
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
import type { EmployeeFormModel, EmployeeSkillFormModel } from '@/types/employee'
import Modal from '@/components/ui/Modal.vue'

type SkillCatalogOption = { Id: string; SkillName: string }
type LevelCatalogOption = { Id: string; Name: string }

const props = defineProps<{
  modelValue: EmployeeFormModel
  skillCatalog: SkillCatalogOption[]
  levelCatalog: LevelCatalogOption[]
  title: string
  skillKey: 'techSkills' | 'softSkills'
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

const skillsList = computed(() => formModel.value[props.skillKey] as EmployeeSkillFormModel[])

const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const pendingDeletionIndex = ref<number | null>(null)
const isLoading = ref(false)

const draft = reactive({
  skillId: '',
  levelId: '',
})

const errors = reactive<Record<string, string>>({})

const resetForm = () => {
  draft.skillId = ''
  draft.levelId = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const openModal = () => {
  resetForm()
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
  await removeSkill(pendingDeletionIndex.value)
  pendingDeletionIndex.value = null
  isConfirmOpen.value = false
}

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => delete errors[key])

  if (!draft.skillId) {
    errors.skillId = 'Debe seleccionar una habilidad'
  }
  if (!draft.levelId) {
    errors.levelId = 'Debe seleccionar un dominio'
  }
  if (Object.keys(errors).length > 0) return

  const duplicate = skillsList.value.some(
    (skill) => String(skill.skillId) === String(draft.skillId)
  )
  if (duplicate) {
    errors.skillId = 'No se puede duplicar el registro'
    return
  }

  const selectedSkill = props.skillCatalog.find(
    (skill) => String(skill.Id) === String(draft.skillId)
  )
  const selectedLevel = props.levelCatalog.find(
    (level) => String(level.Id) === String(draft.levelId)
  )
  if (!selectedSkill || !selectedLevel) {
    errors.skillId = 'Seleccion invalida'
    return
  }

  const nextEntry: EmployeeSkillFormModel = {
    skillId: String(selectedSkill.Id),
    skillName: selectedSkill.SkillName,
    levelId: String(selectedLevel.Id),
    levelName: selectedLevel.Name,
  }
  skillsList.value.push(nextEntry)
  closeModal()
}

const removeSkill = async (index: number) => {
  isLoading.value = true
  const currentRecord = skillsList.value[index]
  if (currentRecord?.id) {
    await deleteSkill(currentRecord.id)
  }
  skillsList.value.splice(index, 1)
  isLoading.value = false
}

const deleteSkill = async (id: string | number) => {
  try {
    const employeeId = route.params.id
    await api.delete(`/employees/${employeeId}/skills/${id}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    console.error('Error al eliminar skill:', error)
  }
}

const validate = () => {
  const hasInvalid = skillsList.value.some(
    (skill) => !skill.skillId || !skill.levelId
  )
  emit('valid-change', !hasInvalid)
  return !hasInvalid
}

watch(
  () => skillsList.value,
  () => {
    validate()
  },
  { deep: true, immediate: true }
)

defineExpose({
  validate,
})
</script>
