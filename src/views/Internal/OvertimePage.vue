<template>
  <DefaultLayout>
    <div class="space-y-6">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Solicitudes de Horas Extras
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Gestiona las solicitudes de horas extras y su historial.
        </p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600"
            @click="openNewOvertimeWorkModal"
          >
            Nueva Solicitud
          </button>
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
                  <th class="px-4 py-3">Solicitud</th>
                  <th v-if="userRole === 'admin'" class="px-4 py-3">Consultor</th>
                  <th class="px-4 py-3">Cliente</th>
                  <th class="px-4 py-3">Proyecto</th>
                  <th class="px-4 py-3">Detalle</th>
                  <th class="px-4 py-3">Fecha Solicitud</th>
                  <th class="px-4 py-3">Total Horas</th>
                  <th class="px-4 py-3">Estado</th>
                  <th class="px-4 py-3">Comentarios</th>
                  <th v-if="userRole === 'admin'" class="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in overTimeRecords"
                  :key="item.Id"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-4 py-3">{{ item.Id }}</td>
                  <td v-if="userRole === 'admin'" class="px-4 py-3">{{ item.fullName }}</td>
                  <td class="px-4 py-3">{{ item.ClientName }}</td>
                  <td class="px-4 py-3">{{ item.ProjectName }}</td>
                  <td class="px-4 py-3">{{ item.Detail }}</td>
                  <td class="px-4 py-3">{{ item.RequestDate }}</td>
                  <td class="px-4 py-3">{{ item.TotalHours }}</td>
                  <td class="px-4 py-3">{{ item.Status }}</td>
                  <td class="px-4 py-3">{{ item.ApprovalComments }}</td>
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
                <tr v-if="overTimeRecords.length === 0">
                  <td :colspan="userRole === 'admin' ? 10 : 9" class="px-4 py-6 text-center text-sm text-gray-500">
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

    <ModalNewOvertimeWork ref="assignModal" @saved="loadHistoryRecords" />
    <ModalApproveOverTime
      ref="assignModalApprove"
      :overTimeRecord="selectedOverTimeRecord"
      :recordId="selectedRecordId"
    />
  </DefaultLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import DefaultLayout from '@/components/layout/DefaultLayout.vue'
import api from '@/services/authServices'
import { getUser } from '@/services/sessionManager'
import ModalNewOvertimeWork from '@/components/employee/ModalNewOvertimeWork.vue'
import ModalApproveOverTime from '@/components/employee/ModalApproveOverTime.vue'

type OvertimeRecord = {
  Id: number
  fullName?: string
  ClientName: string
  ProjectName: string
  Detail: string
  RequestDate: string
  TotalHours: number
  Status: string
  ApprovalComments: string
}

const assignModal = ref<InstanceType<typeof ModalNewOvertimeWork> | null>(null)
const assignModalApprove = ref<InstanceType<typeof ModalApproveOverTime> | null>(null)

const storedValue = getUser()
const userRole = ref(storedValue ? storedValue.role : '')

const selectedOverTimeRecord = ref<Record<string, any>>({})
const selectedRecordId = ref(0)

const searchTerm = ref('')
const errorMessage = ref('')
const overTimeRecords = ref<OvertimeRecord[]>([])

const pagination = ref({
  page: 1,
  limit: 10,
  totalPages: 0,
  total: 0,
})

const openNewOvertimeWorkModal = () => {
  assignModal.value?.openModal()
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

const loadHistoryRecords = async () => {
  try {
    errorMessage.value = ''
    const { page, limit } = pagination.value
    const search = searchTerm.value.trim()
    const response = await api.get('/overtimework/history', {
      params: { page, limit, search },
    })
    overTimeRecords.value = (response.data.records ?? []).map((item: OvertimeRecord) => ({
      ...item,
      RequestDate: formatDate(item.RequestDate),
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
    loadHistoryRecords()
  }, 300)
}

const nextPage = () => {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page += 1
    loadHistoryRecords()
  }
}

const prevPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page -= 1
    loadHistoryRecords()
  }
}

const OpenApproveRecord = (record: OvertimeRecord) => {
  selectedOverTimeRecord.value = record
  selectedRecordId.value = record.Id
  assignModalApprove.value?.openModal()
}

onMounted(loadHistoryRecords)
</script>
