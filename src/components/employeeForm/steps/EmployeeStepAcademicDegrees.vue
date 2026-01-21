<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">Titulos Academicos</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Registra los titulos academicos del empleado.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        @click="openAddModal"
      >
        Agregar titulo
      </button>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3">Titulo</th>
            <th class="px-4 py-3">Institucion</th>
            <th class="px-4 py-3">Fecha Inicio</th>
            <th class="px-4 py-3">Fecha Fin</th>
            <th class="px-4 py-3">Nivel</th>
            <th class="px-4 py-3">Estado</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="academicDegrees.length === 0">
            <td colspan="7" class="px-4 py-6 text-center text-sm text-gray-500">
              No se encontraron resultados
            </td>
          </tr>
          <tr
            v-for="(item, index) in academicDegrees"
            :key="`${item.degree}-${index}`"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-4 py-3">{{ item.degree }}</td>
            <td class="px-4 py-3">{{ item.institution }}</td>
            <td class="px-4 py-3">{{ formatDate(item.startDate) }}</td>
            <td class="px-4 py-3">{{ formatDate(item.endDate) }}</td>
            <td class="px-4 py-3">{{ item.level }}</td>
            <td class="px-4 py-3">{{ item.status }}</td>
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
        </tbody>
      </table>
    </div>

    <Modal v-if="isModalOpen" fullScreenBackdrop @close="closeModal">
      <template #body>
        <div
          class="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-theme-lg dark:bg-gray-900"
        >
          <button
            type="button"
            class="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="closeModal"
          >
            <span class="text-lg">x</span>
          </button>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">Nuevo Titulo</h4>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Nombre del Titulo
              </label>
              <input
                v-model="form.degree"
                type="text"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
              <p v-if="errors.degree" class="mt-1 text-xs text-red-500">{{ errors.degree }}</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Institucion
              </label>
              <input
                v-model="form.institution"
                type="text"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
              <p v-if="errors.institution" class="mt-1 text-xs text-red-500">
                {{ errors.institution }}
              </p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Fecha de inicio
              </label>
              <input
                v-model="form.startDate"
                type="date"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
              <p v-if="errors.startDate" class="mt-1 text-xs text-red-500">
                {{ errors.startDate }}
              </p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Fecha de fin
              </label>
              <input
                v-model="form.endDate"
                type="date"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Nivel
              </label>
              <select
                v-model="form.level"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione un valor</option>
                <option v-for="option in degreeOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <p v-if="errors.level" class="mt-1 text-xs text-red-500">{{ errors.level }}</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Estado
              </label>
              <select
                v-model="form.status"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione un valor</option>
                <option v-for="option in statusOptions" :key="option" :value="option">
                  {{ option }}
                </option>
              </select>
              <p v-if="errors.status" class="mt-1 text-xs text-red-500">{{ errors.status }}</p>
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
            ¿Estas seguro de que deseas eliminar este titulo?
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

const degreeOptions = [
  'Secundario',
  'Técnico',
  'Terciario',
  'Universitario (Grado)',
  'Posgrado / Maestría / Doctorado',
]

const statusOptions = ['En Curso', 'Completado']

const props = defineProps<{
  modelValue: EmployeeFormModel & { academicDegrees: Array<Record<string, any>> }
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: EmployeeFormModel & { academicDegrees: Array<Record<string, any>> }): void
  (event: 'valid-change', value: boolean): void
}>()

const route = useRoute()

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const academicDegrees = computed(() => formModel.value.academicDegrees)

const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const pendingDeletionIndex = ref<number | null>(null)

const form = reactive({
  degree: '',
  institution: '',
  startDate: '',
  endDate: '',
  level: '',
  status: '',
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
  await removeTitle(pendingDeletionIndex.value)
  pendingDeletionIndex.value = null
  isConfirmOpen.value = false
}

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  if (!form.degree) errors.degree = 'Debe completar el titulo'
  if (!form.institution) errors.institution = 'Debe completar la institucion'
  if (!form.startDate) errors.startDate = 'Debe completar la fecha de inicio'
  if (!form.level) errors.level = 'Debe seleccionar un nivel'
  if (!form.status) errors.status = 'Debe seleccionar un estado'

  if (Object.keys(errors).length > 0) return

  const newDegree = {
    ...form,
    startDate: form.startDate || '',
    endDate: form.endDate || '',
  }

  formModel.value.academicDegrees.push(newDegree)
  closeModal()
  resetForm()
}

const removeTitle = async (index: number) => {
  const currentRecord = formModel.value.academicDegrees[index]
  if (currentRecord?.id) {
    await deleteAcademicDegree(currentRecord.id)
  }
  formModel.value.academicDegrees.splice(index, 1)
}

const deleteAcademicDegree = async (id: string | number) => {
  try {
    const employeeId = route.params.id
    await api.delete(`/employees/${employeeId}/academicDegrees/${id}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    console.error('Error al eliminar titulo:', error)
  }
}

const resetForm = () => {
  form.degree = ''
  form.institution = ''
  form.startDate = ''
  form.endDate = ''
  form.level = ''
  form.status = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const formatDate = (dateToFormat: string) => {
  if (!dateToFormat) return 'Sin fecha'
  const date = new Date(dateToFormat)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const validate = () => {
  emit('valid-change', true)
  return true
}

watch(
  () => formModel.value.academicDegrees,
  () => {
    validate()
  },
  { deep: true, immediate: true }
)

defineExpose({
  validate,
})
</script>
