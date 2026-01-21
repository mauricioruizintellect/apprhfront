<template>
  <div class="space-y-8">
    <section class="space-y-4">
      <h3 class="text-lg font-semibold text-brand-500">Informacion Personal</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Nombres
          </label>
          <input
            v-model="formModel.firstName"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.firstName" class="mt-1 text-xs text-red-500">{{ errors.firstName }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Apellidos
          </label>
          <input
            v-model="formModel.lastName"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.lastName" class="mt-1 text-xs text-red-500">{{ errors.lastName }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Genero
          </label>
          <select
            v-model="formModel.gender"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option disabled value="">Seleccione un valor</option>
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
          </select>
          <p v-if="errors.gender" class="mt-1 text-xs text-red-500">Debe seleccionar un valor</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Fecha de Nacimiento
          </label>
          <input
            v-model="formModel.birthDate"
            type="date"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <p v-if="errors.birthDate" class="mt-1 text-xs text-red-500">
            {{ errors.birthDate }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Pais de Nacimiento
          </label>
          <select
            v-model="formModel.countryOfBirth"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option disabled value="">Selecciona un pais</option>
            <option v-for="country in countries" :key="country.Id" :value="country.Id">
              {{ country.CountryName }}
            </option>
          </select>
          <p v-if="errors.countryOfBirth" class="mt-1 text-xs text-red-500">
            Debe seleccionar un valor
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Pais de Residencia
          </label>
          <select
            v-model="formModel.countryOfResidence"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option disabled value="">Selecciona un pais</option>
            <option v-for="country in countries" :key="country.Id" :value="country.Id">
              {{ country.CountryName }}
            </option>
          </select>
          <p v-if="errors.countryOfResidence" class="mt-1 text-xs text-red-500">
            Debe seleccionar un valor
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Celular
          </label>
          <input
            v-model="formModel.mobilePhone"
            type="text"
            placeholder="+593 9 1234 5678"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p class="mt-1 text-xs text-gray-400">Formato sugerido: +Codigo pais + numero</p>
          <p v-if="errors.mobilePhone" class="mt-1 text-xs text-red-500">
            {{ errors.mobilePhone }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Numero de Documento de Identificacion
          </label>
          <input
            v-model="formModel.citizenshipCardNumber"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.citizenshipCardNumber" class="mt-1 text-xs text-red-500">
            {{ errors.citizenshipCardNumber }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Numero de Pasaporte
          </label>
          <input
            v-model="formModel.passportNumber"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
        <div class="space-y-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-400">
            Dispone de Visa Estadounidense
          </span>
          <label class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input v-model="formModel.hasAmericanVisa" type="checkbox" class="rounded" />
            Si
          </label>
        </div>
        <div class="md:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Direccion Fisica
          </label>
          <textarea
            v-model="formModel.physicalAddress"
            rows="3"
            class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          ></textarea>
          <p v-if="errors.physicalAddress" class="mt-1 text-xs text-red-500">
            {{ errors.physicalAddress }}
          </p>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold text-brand-500">Informacion Profesional</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div v-if="isAdmin">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Correo Electronico
          </label>
          <input
            v-model="formModel.email"
            type="email"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-red-500">{{ errors.email }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Fecha de Ingreso
          </label>
          <input
            v-model="formModel.dateEntry"
            type="date"
            :disabled="isDisabledFields"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <p v-if="errors.dateEntry" class="mt-1 text-xs text-red-500">{{ errors.dateEntry }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Tipo de Consultor
          </label>
          <select
            v-model="formModel.typeOfConsultant"
            :disabled="isDisabledFields"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option disabled value="">Seleccione un valor</option>
            <option value="Contrato Fijo (Interno)">Contrato Fijo (Interno)</option>
            <option value="Freelance (Externo)">Freelance (Externo)</option>
          </select>
          <p v-if="errors.typeOfConsultant" class="mt-1 text-xs text-red-500">
            Debe seleccionar un valor
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Porcentaje Disponibilidad
          </label>
          <select
            v-model="formModel.percentageAvailability"
            :disabled="isDisabledFields"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option disabled value="">Seleccione un valor</option>
            <option value="Tiempo Parcial">Tiempo Parcial</option>
            <option value="Tiempo Completo">Tiempo Completo</option>
          </select>
          <p v-if="errors.percentageAvailability" class="mt-1 text-xs text-red-500">
            Debe seleccionar un valor
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Anos de Experiencia Profesional
          </label>
          <input
            v-model="formModel.professionalExperienceYears"
            type="number"
            min="0"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <p v-if="errors.professionalExperienceYears" class="mt-1 text-xs text-red-500">
            {{ errors.professionalExperienceYears }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Anos de Experiencia en Salesforce
          </label>
          <input
            v-model="formModel.salesforceExperienceYears"
            type="number"
            min="0"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
          <p v-if="errors.salesforceExperienceYears" class="mt-1 text-xs text-red-500">
            {{ errors.salesforceExperienceYears }}
          </p>
        </div>
        <div class="md:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Roles Desempenados
          </label>
          <select
            v-model="formModel.rolesPerformed"
            multiple
            class="dark:bg-dark-900 min-h-[46px] w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option v-for="role in rolesList" :key="role.Id" :value="role.RoleName">
              {{ role.RoleName }}
            </option>
          </select>
          <p v-if="errors.rolesPerformed" class="mt-1 text-xs text-red-500">
            Debe seleccionar un valor
          </p>
        </div>
        <div class="md:col-span-2">
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Rol, Funciones, responsabilidades y logros
          </label>
          <textarea
            v-model="formModel.description"
            rows="3"
            class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-xs text-red-500">{{ errors.description }}</p>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold text-brand-500">Informacion Medica</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Alergias
          </label>
          <textarea
            v-model="formModel.allergies"
            rows="2"
            class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          ></textarea>
          <p v-if="errors.allergies" class="mt-1 text-xs text-red-500">{{ errors.allergies }}</p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Enfermedades Preexistentes
          </label>
          <textarea
            v-model="formModel.preExistingIllnesses"
            rows="2"
            class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          ></textarea>
          <p v-if="errors.preExistingIllnesses" class="mt-1 text-xs text-red-500">
            {{ errors.preExistingIllnesses }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Restricciones Alimenticias
          </label>
          <textarea
            v-model="formModel.dietaryRestrictions"
            rows="2"
            class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          ></textarea>
          <p v-if="errors.dietaryRestrictions" class="mt-1 text-xs text-red-500">
            {{ errors.dietaryRestrictions }}
          </p>
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            <span class="text-red-500">*</span> Tipo de Sangre
          </label>
          <select
            v-model="formModel.bloodType"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option disabled value="">Seleccione un valor</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <p v-if="errors.bloodType" class="mt-1 text-xs text-red-500">
            Debe seleccionar un valor
          </p>
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold text-brand-500">Contacto de Emergencia</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Nombre Contacto de Emergencia
          </label>
          <input
            v-model="formModel.emergencyContactName"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Telefono Contacto de Emergencia
          </label>
          <input
            v-model="formModel.emergencyContactPhone"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
            Relacion Contacto de Emergencia
          </label>
          <input
            v-model="formModel.emergencyContactRelationship"
            type="text"
            class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <h3 class="text-lg font-semibold text-brand-500">Situacion Actual</h3>
      <div class="grid gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-400">Estas en Proyecto</span>
          <label class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input v-model="formModel.inProject" type="checkbox" class="rounded" />
            Si
          </label>
        </div>
        <div v-if="isAdmin" class="space-y-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-400">Estado Consultor</span>
          <label class="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <input v-model="formModel.status" type="checkbox" class="rounded" @change="handleStatusChange" />
            Activo
          </label>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { EmployeeFormModel } from '@/types/employee'

type CountryOption = { Id: string; CountryName: string }
type RoleOption = { Id: string; RoleName: string }

const props = defineProps<{
  modelValue: EmployeeFormModel
  mode: 'create' | 'edit'
  countries?: CountryOption[]
  rolesList?: RoleOption[]
}>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: EmployeeFormModel): void
  (event: 'valid-change', value: boolean): void
}>()

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
const isDisabledFields = computed(() => props.mode === 'edit' && !isAdmin.value)

const formModel = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const countries = computed(() => props.countries ?? [])
const rolesList = computed(() => props.rolesList ?? [])

const errors = reactive<Record<string, string>>({})

const requiredFields = computed(() => {
  const fields = [
    'firstName',
    'lastName',
    'gender',
    'birthDate',
    'countryOfBirth',
    'countryOfResidence',
    'mobilePhone',
    'citizenshipCardNumber',
    'physicalAddress',
    'dateEntry',
    'professionalExperienceYears',
    'salesforceExperienceYears',
    'rolesPerformed',
    'description',
    'allergies',
    'preExistingIllnesses',
    'dietaryRestrictions',
    'bloodType',
  ]

  if (isAdmin.value) {
    fields.push('email', 'typeOfConsultant', 'percentageAvailability')
  }

  return fields
})

const validate = (showErrors = true) => {
  if (showErrors) {
    Object.keys(errors).forEach((key) => delete errors[key])
  }

  let isValid = true

  requiredFields.value.forEach((field) => {
    const value = (formModel.value as Record<string, any>)[field]
    const isEmpty =
      value === undefined ||
      value === null ||
      (Array.isArray(value) ? value.length === 0 : String(value).trim() === '')

    if (isEmpty) {
      isValid = false
      if (showErrors) {
        errors[field] = 'Este campo es obligatorio'
      }
    }
  })

  return isValid
}

const handleStatusChange = () => {
  if (formModel.value.status) {
    formModel.value.dateEntry = new Date().toISOString().split('T')[0]
  }
}

watch(
  () => [formModel.value, isAdmin.value],
  () => {
    emit('valid-change', validate(false))
  },
  { deep: true, immediate: true }
)

defineExpose({
  validate,
})
</script>
