<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Idiomas</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Registra los idiomas del empleado.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        @click="openAddModal"
      >
        Agregar Lenguaje
      </button>
    </div>

    <div v-if="isLoading" class="text-sm text-gray-500">Cargando...</div>

    <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3">Idioma</th>
            <th class="px-4 py-3">Nivel Escritura</th>
            <th class="px-4 py-3">Nivel Hablado</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(entry, index) in languages"
            :key="`${entry.languageId}-${index}`"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-4 py-3">{{ entry.languageName }}</td>
            <td class="px-4 py-3">{{ entry.writtenLevelName }}</td>
            <td class="px-4 py-3">{{ entry.spokenLevelName }}</td>
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
          <tr v-if="languages.length === 0">
            <td colspan="4" class="px-4 py-6 text-center text-sm text-gray-500">
              No hay idiomas registrados.
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
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">Nuevo Lenguaje</h4>

          <div class="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Idioma
              </label>
              <select
                v-model="form.languageId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione un idioma</option>
                <option v-for="lang in languageList" :key="lang.Id" :value="lang.Id">
                  {{ lang.LanguageName }}
                </option>
              </select>
              <p v-if="errors.languageId" class="mt-1 text-xs text-red-500">
                {{ errors.languageId }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Nivel Escritura
              </label>
              <select
                v-model="form.writtenLanguageLevelId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione nivel</option>
                <option v-for="lvl in levelOptions" :key="lvl.Id" :value="lvl.Id">
                  {{ lvl.Name }}
                </option>
              </select>
              <p v-if="errors.writtenLanguageLevelId" class="mt-1 text-xs text-red-500">
                {{ errors.writtenLanguageLevelId }}
              </p>
            </div>

            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Nivel Hablado
              </label>
              <select
                v-model="form.spokenLanguageLevelId"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione nivel</option>
                <option v-for="lvl in levelOptions" :key="lvl.Id" :value="lvl.Id">
                  {{ lvl.Name }}
                </option>
              </select>
              <p v-if="errors.spokenLanguageLevelId" class="mt-1 text-xs text-red-500">
                {{ errors.spokenLanguageLevelId }}
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
            ¿Estas seguro de que deseas eliminar este lenguaje?
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

type LanguageOption = { Id: string; LanguageName: string }
type LevelOption = { Id: string; Name: string }

const props = defineProps<{
  modelValue: EmployeeFormModel & { languages: Array<Record<string, any>> }
  languageList: LanguageOption[]
  levelOptions: LevelOption[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: EmployeeFormModel & { languages: Array<Record<string, any>> }): void
  (event: 'valid-change', value: boolean): void
}>()

const route = useRoute()

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const languages = computed(() => formModel.value.languages)

const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const pendingDeletionIndex = ref<number | null>(null)
const isLoading = ref(false)

const form = reactive({
  languageId: '',
  writtenLanguageLevelId: '',
  spokenLanguageLevelId: '',
})

const errors = reactive<Record<string, string>>({})

const openAddModal = () => {
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
  await removeEntry(pendingDeletionIndex.value)
  pendingDeletionIndex.value = null
  isConfirmOpen.value = false
}

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.languageId) errors.languageId = 'Debe seleccionar un idioma'
  if (!form.writtenLanguageLevelId) {
    errors.writtenLanguageLevelId = 'Debe seleccionar nivel'
  }
  if (!form.spokenLanguageLevelId) {
    errors.spokenLanguageLevelId = 'Debe seleccionar nivel'
  }
  if (Object.keys(errors).length > 0) return

  const selectedLanguage = props.languageList.find(
    (lang) => String(lang.Id) === String(form.languageId)
  )
  const selectedWrittenLevel = props.levelOptions.find(
    (lvl) => String(lvl.Id) === String(form.writtenLanguageLevelId)
  )
  const selectedSpokenLevel = props.levelOptions.find(
    (lvl) => String(lvl.Id) === String(form.spokenLanguageLevelId)
  )
  if (!selectedLanguage || !selectedWrittenLevel || !selectedSpokenLevel) {
    errors.languageId = 'Seleccion invalida'
    return
  }

  const existingLanguage = languages.value.find(
    (lang) => String(lang.languageId) === String(form.languageId)
  )
  if (existingLanguage) {
    errors.languageId = 'No se puede duplicar el registro'
    return
  }

  languages.value.push({
    languageId: form.languageId,
    writtenLanguageLevelId: form.writtenLanguageLevelId,
    spokenLanguageLevelId: form.spokenLanguageLevelId,
    languageName: selectedLanguage.LanguageName,
    writtenLevelName: selectedWrittenLevel.Name,
    spokenLevelName: selectedSpokenLevel.Name,
  })

  closeModal()
  resetForm()
}

const removeEntry = async (index: number) => {
  isLoading.value = true
  const currentRecord = languages.value[index]
  if (currentRecord?.id) {
    await deleteLanguage(currentRecord.id)
  }
  languages.value.splice(index, 1)
  isLoading.value = false
}

const deleteLanguage = async (id: string | number) => {
  try {
    const employeeId = route.params.id
    await api.delete(`/employees/${employeeId}/languages/${id}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    console.error('Error al eliminar lenguaje:', error)
  }
}

const resetForm = () => {
  form.languageId = ''
  form.writtenLanguageLevelId = ''
  form.spokenLanguageLevelId = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const validate = () => {
  emit('valid-change', true)
  return true
}

watch(
  () => formModel.value.languages,
  () => {
    validate()
  },
  { deep: true, immediate: true }
)

defineExpose({
  validate,
})
</script>
