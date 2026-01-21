<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Solicitudes de Vacaciones
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gestiona las solicitudes y el historial de vacaciones.
        </p>
      </div>

      <div class="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
        <h3 class="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-700">
          Requisitos importantes
        </h3>
        <ul class="list-disc space-y-1 pl-5 text-blue-800">
          <li>Para vacaciones la fecha de inicio debe ser al menos 2 meses desde la fecha actual</li>
          <li>Debes contar con la autorizacion de tu supervisor de proyecto</li>
        </ul>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
              @click="openNewVacationModal"
            >
              Nueva Solicitud
            </button>
            <span
              class="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
            >
              Dias acumulados
              <span class="rounded-full bg-blue-500 px-2 py-0.5 text-white">
                {{ currentBalance.AvailableDays ?? 0 }}
              </span>
            </span>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-4">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              Ultimas Solicitudes
            </h2>
            <div class="w-full sm:w-72">
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar..."
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                @input="onSearch"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {{ errorMessage }}
          </div>

          <div class="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
            <table class="min-w-full text-left text-sm text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                <tr>
                  <th class="px-4 py-3"># Solicitud</th>
                  <th class="px-4 py-3">Nombres</th>
                  <th class="px-4 py-3">Tipo</th>
                  <th class="px-4 py-3">Fecha Inicio</th>
                  <th class="px-4 py-3">Fecha Fin</th>
                  <th class="px-4 py-3">Total Dias</th>
                  <th class="px-4 py-3">Estado</th>
                  <th class="px-4 py-3">Comentarios</th>
                  <th v-if="userRole === 'admin'" class="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in vacationHistory"
                  :key="item.Id"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-4 py-3">{{ item.Id }}</td>
                  <td class="px-4 py-3">{{ item.FullName }}</td>
                  <td class="px-4 py-3">{{ item.RequestType }}</td>
                  <td class="px-4 py-3">{{ item.StartDate }}</td>
                  <td class="px-4 py-3">{{ item.EndDate }}</td>
                  <td class="px-4 py-3">{{ item.TotalDays }}</td>
                  <td class="px-4 py-3">{{ item.Status }}</td>
                  <td class="px-4 py-3">{{ item.ApprovalInfo }}</td>
                  <td v-if="userRole === 'admin'" class="px-4 py-3 text-right">
                    <button
                      type="button"
                      class="inline-flex items-center justify-center rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
                      @click="OpenApproveRecord(item)"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
                <tr v-if="vacationHistory.length === 0">
                  <td :colspan="userRole === 'admin' ? 9 : 8" class="px-4 py-6 text-center text-sm text-gray-500">
                    No hay solicitudes registradas.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex items-center justify-between text-sm text-gray-500">
            <span>Pagina {{ pagination.page }} de {{ pagination.totalPages || 1 }}</span>
            <div class="flex gap-2">
              <button
                type="button"
                class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300"
                :disabled="pagination.page <= 1"
                @click="prevPage"
              >
                Anterior
              </button>
              <button
                type="button"
                class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-700 dark:text-gray-300"
                :disabled="pagination.page >= pagination.totalPages"
                @click="nextPage"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalNewVacation ref="assignModal" @saved="loadHistoryPTO" />
    <ModalApproveVacation
      ref="assignModalApprove"
      :vacationRecord="selectedVacationRecord"
      :recordId="selectedRecordId"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import ModalNewVacation from '@/components/employee/ModalNewVacation.vue'
import ModalApproveVacation from '@/components/employee/ModalApproveVacation.vue'
import api from '@/services/authServices'
import { getUser } from '@/services/sessionManager'

type VacationRecord = {
  Id: number
  FullName: string
  RequestType: string
  StartDate: string
  EndDate: string
  TotalDays: number
  Status: string
  ApprovalInfo: string
}

type VacationBalance = {
  AvailableDays: number
}

const searchTerm = ref('')
const errorMessage = ref('')
const vacationHistory = ref<VacationRecord[]>([])
const currentBalance = ref<VacationBalance>({ AvailableDays: 0 })

const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 0,
  total: 0,
})

const storedValue = getUser()
const userRole = ref(storedValue ? storedValue.role : '')

const assignModal = ref<InstanceType<typeof ModalNewVacation> | null>(null)
const assignModalApprove = ref<InstanceType<typeof ModalApproveVacation> | null>(null)

const selectedVacationRecord = ref<Record<string, any>>({})
const selectedRecordId = ref(0)

const openNewVacationModal = () => {
  assignModal.value?.openModal()
}

const loadData = async () => {
  await vacationBalance()
  await loadHistoryPTO()
}

const vacationBalance = async () => {
  try {
    const response = await api.get('/vacation-balance/')
    currentBalance.value = response.data.result ?? { AvailableDays: 0 }
  } catch (error) {
    errorMessage.value = 'Error cargando el balance de vacaciones.'
  }
}

const formatDate = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) {
    const day = String(date.getUTCDate()).padStart(2, '0')
    const month = String(date.getUTCMonth() + 1).padStart(2, '0')
    const year = date.getUTCFullYear()
    return `${day}/${month}/${year}`
  }
  return value
}

const loadHistoryPTO = async () => {
  try {
    errorMessage.value = ''
    const { page, limit } = pagination.value
    const search = searchTerm.value.trim()
    const response = await api.get('/vacation-requests/history', {
      params: {
        page,
        limit,
        search,
      },
    })

    vacationHistory.value = (response.data.records ?? []).map((item: VacationRecord) => ({
      ...item,
      StartDate: formatDate(item.StartDate),
      EndDate: formatDate(item.EndDate),
    }))
    pagination.value.total = response.data.pagination?.total ?? 0
    pagination.value.totalPages = response.data.pagination?.totalPages ?? 1
  } catch (error) {
    errorMessage.value = 'Error cargando datos.'
  }
}

let searchTimeout: ReturnType<typeof setTimeout> | undefined
const onSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadHistoryPTO()
  }, 300)
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page += 1
    loadHistoryPTO()
  }
}

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page -= 1
    loadHistoryPTO()
  }
}

const OpenApproveRecord = (record: VacationRecord) => {
  selectedVacationRecord.value = record
  selectedRecordId.value = record.Id
  assignModalApprove.value?.openModal()
}

onMounted(loadData)
</script>
