<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
          Experiencia Laboral
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Registra las experiencias laborales del empleado.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
        @click="openAddModal"
      >
        Agregar experiencia
      </button>
    </div>

    <div class="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
      <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            <th class="px-4 py-3">Rol</th>
            <th class="px-4 py-3">Duracion</th>
            <th class="px-4 py-3">Periodo</th>
            <th class="px-4 py-3">Cliente</th>
            <th class="px-4 py-3">Fecha Inicio</th>
            <th class="px-4 py-3">Fecha Fin</th>
            <th class="px-4 py-3">Objetivos Alcanzados</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(exp, index) in experiencesFormatted"
            :key="`${exp.role}-${index}`"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-4 py-3">{{ getRoleName(exp.role) }}</td>
            <td class="px-4 py-3">{{ exp.years }}</td>
            <td class="px-4 py-3">{{ exp.period }}</td>
            <td class="px-4 py-3">{{ exp.client }}</td>
            <td class="px-4 py-3">{{ exp.startDateFormatted }}</td>
            <td class="px-4 py-3">{{ exp.endDateFormatted }}</td>
            <td class="px-4 py-3">{{ exp.description }}</td>
            <td class="px-4 py-3 text-right">
              <div class="flex justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-orange-200 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-50 dark:border-orange-500/30 dark:hover:bg-orange-500/10"
                  @click="editExperience(index)"
                >
                  Editar
                </button>
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                  @click="openDeleteModal(index)"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="formModel.experience.length === 0">
            <td colspan="8" class="px-4 py-6 text-center text-sm text-gray-500">
              No hay experiencias registradas.
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
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90">
            {{ isEditing ? 'Editar' : 'Nueva' }} Experiencia Laboral
          </h4>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Rol desempenado
              </label>
              <select
                v-model="form.role"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione un rol</option>
                <option v-for="role in rolesList" :key="role.Id" :value="role.Id">
                  {{ role.RoleName }}
                </option>
              </select>
              <p v-if="errors.role" class="mt-1 text-xs text-red-500">{{ errors.role }}</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Cliente / Proyecto
              </label>
              <input
                v-model="form.client"
                type="text"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
              <p v-if="errors.client" class="mt-1 text-xs text-red-500">{{ errors.client }}</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Fecha de inicio
              </label>
              <input
                v-model="form.startDate"
                type="date"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                @change="calculateDuration"
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
                @change="calculateDuration"
              />
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Duracion
              </label>
              <input
                v-model="form.years"
                type="text"
                readonly
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-800 dark:text-white/90"
              />
              <p v-if="errors.years" class="mt-1 text-xs text-red-500">{{ errors.years }}</p>
            </div>
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Periodo
              </label>
              <select
                v-model="form.period"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option disabled value="">Seleccione un valor</option>
                <option value="Meses">Meses</option>
                <option value="Años">Años</option>
              </select>
              <p v-if="errors.period" class="mt-1 text-xs text-red-500">{{ errors.period }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                <span class="text-red-500">*</span> Objetivos Alcanzados
              </label>
              <textarea
                v-model="form.description"
                rows="3"
                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-xs text-red-500">
                {{ errors.description }}
              </p>
            </div>
          </div>

          <p v-if="dateError" class="mt-3 text-xs text-red-500">{{ dateError }}</p>

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
              {{ isEditing ? 'Actualizar' : 'Agregar' }}
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
            ¿Estas seguro de que deseas eliminar esta experiencia?
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

type RoleOption = { Id: string; RoleName: string }

const props = defineProps<{
  modelValue: EmployeeFormModel & { experience: Array<Record<string, any>> }
  rolesList: RoleOption[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: EmployeeFormModel & { experience: Array<Record<string, any>> }): void
  (event: 'valid-change', value: boolean): void
}>()

const route = useRoute()

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isModalOpen = ref(false)
const isConfirmOpen = ref(false)
const isEditing = ref(false)
const editingIndex = ref(-1)
const pendingDeletionIndex = ref<number | null>(null)
const dateError = ref('')

const form = reactive({
  role: '',
  years: '',
  period: '',
  client: '',
  description: '',
  startDate: '',
  endDate: '',
})

const errors = reactive<Record<string, string>>({})

const experiencesFormatted = computed(() =>
  formModel.value.experience.map((exp: any) => ({
    ...exp,
    startDateFormatted: formatDate(exp.startDate),
    endDateFormatted: exp.endDate ? formatDate(exp.endDate) : 'Actualidad',
  }))
)

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
  await removeExperience(pendingDeletionIndex.value)
  pendingDeletionIndex.value = null
  isConfirmOpen.value = false
}

const editExperience = (index: number) => {
  const exp = formModel.value.experience[index]
  form.role = exp.role ?? ''
  form.years = exp.years ?? ''
  form.period = exp.period ?? ''
  form.client = exp.client ?? ''
  form.description = exp.description ?? ''
  form.startDate = exp.startDate ?? ''
  form.endDate = exp.endDate ?? ''
  isEditing.value = true
  editingIndex.value = index
  isModalOpen.value = true
}

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  dateError.value = ''

  if (!form.role) errors.role = 'Debe seleccionar un rol'
  if (!form.years) errors.years = 'Debe completar la duracion'
  if (!form.period) errors.period = 'Debe seleccionar un periodo'
  if (!form.client) errors.client = 'Debe completar el cliente'
  if (!form.startDate) errors.startDate = 'Debe seleccionar fecha de inicio'
  if (!form.description) errors.description = 'Debe completar la descripcion'

  if (form.startDate && form.endDate && form.endDate < form.startDate) {
    dateError.value = 'La fecha de fin no puede ser anterior a la fecha de inicio'
    return
  }

  if (Object.keys(errors).length > 0) return

  const entry = {
    role: form.role,
    years: form.years,
    period: form.period,
    client: form.client,
    description: form.description,
    startDate: form.startDate || '',
    endDate: form.endDate || '',
  }

  if (isEditing.value && editingIndex.value >= 0) {
    formModel.value.experience[editingIndex.value] = {
      ...formModel.value.experience[editingIndex.value],
      ...entry,
    }
  } else {
    formModel.value.experience.push(entry)
  }

  closeModal()
  resetForm()
}

const removeExperience = async (index: number) => {
  const currentRecord = formModel.value.experience[index]
  if (currentRecord?.id) {
    await deleteExperience(currentRecord.id)
  }
  formModel.value.experience.splice(index, 1)
  if (editingIndex.value === index) resetForm()
}

const deleteExperience = async (id: string | number) => {
  try {
    const employeeId = route.params.id
    await api.delete(`/employees/${employeeId}/workExperiences/${id}`, {
      headers: { 'Cache-Control': 'no-cache' },
    })
  } catch (error) {
    console.error('Error al eliminar la experiencia:', error)
  }
}

const resetForm = () => {
  form.role = ''
  form.years = ''
  form.period = ''
  form.client = ''
  form.description = ''
  form.startDate = ''
  form.endDate = ''
  isEditing.value = false
  editingIndex.value = -1
  dateError.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const getRoleName = (roleId: string) => {
  const found = props.rolesList.find((role) => String(role.Id) === String(roleId))
  return found ? found.RoleName : roleId
}

const calculateDuration = () => {
  if (!form.startDate || !form.endDate) return

  const start = new Date(form.startDate)
  const end = new Date(form.endDate)

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    form.years = ''
    form.period = ''
    return
  }

  const totalMonths = diffInMonths(start, end)
  if (totalMonths < 13) {
    form.years = String(totalMonths)
    form.period = 'Meses'
  } else if (totalMonths >= 18 && totalMonths <= 23) {
    form.years = '1.5'
    form.period = 'Años'
  } else {
    form.years = String(Math.floor(totalMonths / 6) / 2)
    form.period = 'Años'
  }
}

const diffInMonths = (start: Date, end: Date) => {
  const years = end.getFullYear() - start.getFullYear()
  const months = end.getMonth() - start.getMonth()
  const total = years * 12 + months
  return total >= 0 ? total : 0
}

const formatDate = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
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
  () => formModel.value.experience,
  () => {
    validate()
  },
  { deep: true, immediate: true }
)

defineExpose({
  validate,
})
</script>
