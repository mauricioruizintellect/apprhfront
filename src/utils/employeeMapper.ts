import type {
  EmployeeCertificationDTO,
  EmployeeCertificationFormModel,
  EmployeeCloudDTO,
  EmployeeCloudFormModel,
  EmployeeDTO,
  EmployeeFormModel,
} from '@/types/employee'

const toDateInput = (value?: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().split('T')[0]
}

const toBool = (value?: boolean | number | string) => {
  if (value === 'active') return true
  if (value === 'inactive') return false
  return Boolean(value)
}

const normalizeRoles = (value?: string[] | string) => {
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value.split(';').map((item) => item.trim()).filter(Boolean)
  }
  return []
}

const mapCertificationDto = (
  certification: EmployeeCertificationDTO
): EmployeeCertificationFormModel => {
  return {
    id: certification.id,
    issuer: certification.issuer || '',
    name: certification.name || '',
    certId: certification.certId || '',
  }
}

const mapCloudDto = (cloud: EmployeeCloudDTO): EmployeeCloudFormModel => {
  return {
    id: cloud.id,
    issuerId: cloud.issuerId || cloud.issuer || cloud.issuerName || '',
    issuerName: cloud.issuerName || cloud.issuer || '',
    cloudId: cloud.cloudId || '',
    cloudName: cloud.cloudName || '',
  }
}

export const mapDtoToForm = (dto: EmployeeDTO): EmployeeFormModel => {
  return {
    id: dto.id ?? dto.EmployeeId,
    firstName: dto.firstName || dto.FirstName || '',
    lastName: dto.lastName || dto.LastName || '',
    email: dto.email || dto.Email || '',
    role: dto.role || '',
    position: dto.position || '',
    phone: dto.phone || '',
    department: dto.department || '',
    gender: dto.gender || '',
    birthDate: toDateInput(dto.birthDate || dto.DateOfBirth),
    countryOfBirth: dto.countryOfBirth || dto.CountryOfBirthId || '',
    countryOfResidence: dto.countryOfResidence || dto.CountryOfResidenceId || '',
    mobilePhone: dto.mobilePhone || '',
    citizenshipCardNumber: dto.citizenshipCardNumber || '',
    passportNumber: dto.passportNumber || '',
    hasAmericanVisa: toBool(dto.hasAmericanVisa),
    physicalAddress: dto.physicalAddress || '',
    dateEntry: toDateInput(dto.dateEntry),
    typeOfConsultant: dto.typeOfConsultant || '',
    percentageAvailability: dto.percentageAvailability || '',
    professionalExperienceYears: String(dto.professionalExperienceYears ?? ''),
    salesforceExperienceYears: String(dto.salesforceExperienceYears ?? ''),
    rolesPerformed: normalizeRoles(dto.rolesPerformed),
    certifications: Array.isArray(dto.certifications)
      ? dto.certifications.map(mapCertificationDto)
      : [],
    clouds: Array.isArray(dto.clouds) ? dto.clouds.map(mapCloudDto) : [],
    description: dto.description || '',
    allergies: dto.allergies || '',
    preExistingIllnesses: dto.preExistingIllnesses || '',
    dietaryRestrictions: dto.dietaryRestrictions || '',
    bloodType: dto.bloodType || '',
    emergencyContactName: dto.emergencyContactName || '',
    emergencyContactPhone: dto.emergencyContactPhone || '',
    emergencyContactRelationship: dto.emergencyContactRelationship || '',
    inProject: toBool(dto.inProject),
    status: toBool(dto.status),
  }
}

export const mapFormToPayload = (form: EmployeeFormModel, mode: 'create' | 'edit') => {
  const payload = {
    firstName: form.firstName.trim(),
    lastName: form.lastName.trim(),
    email: form.email.trim(),
    role: form.role.trim(),
    position: form.position.trim(),
    phone: form.phone.trim(),
    department: form.department.trim(),
    gender: form.gender,
    birthDate: form.birthDate,
    countryOfBirth: form.countryOfBirth,
    countryOfResidence: form.countryOfResidence,
    mobilePhone: form.mobilePhone.trim(),
    citizenshipCardNumber: form.citizenshipCardNumber.trim(),
    passportNumber: form.passportNumber.trim(),
    hasAmericanVisa: form.hasAmericanVisa,
    physicalAddress: form.physicalAddress.trim(),
    dateEntry: form.dateEntry,
    typeOfConsultant: form.typeOfConsultant,
    percentageAvailability: form.percentageAvailability,
    professionalExperienceYears: form.professionalExperienceYears,
    salesforceExperienceYears: form.salesforceExperienceYears,
    rolesPerformed: form.rolesPerformed,
    certifications: form.certifications.map((certification) => ({
      id: certification.id,
      issuerId: certification.issuerId,
      issuerName: certification.issuerName,
      certId: certification.certId,
      certName: certification.certName,
      obtainedAt: certification.obtainedAt,
      expiresAt: certification.expiresAt,
      link: certification.link,
    })),
    clouds: form.clouds.map((cloud) => ({
      id: cloud.id,
      issuerId: cloud.issuerId,
      issuerName: cloud.issuerName,
      cloudId: cloud.cloudId,
      cloudName: cloud.cloudName,
    })),
    description: form.description.trim(),
    allergies: form.allergies.trim(),
    preExistingIllnesses: form.preExistingIllnesses.trim(),
    dietaryRestrictions: form.dietaryRestrictions.trim(),
    bloodType: form.bloodType,
    emergencyContactName: form.emergencyContactName.trim(),
    emergencyContactPhone: form.emergencyContactPhone.trim(),
    emergencyContactRelationship: form.emergencyContactRelationship.trim(),
    inProject: form.inProject,
    status: form.status,
  }

  if (mode === 'edit') {
    return { ...payload, id: form.id }
  }

  return payload
}
