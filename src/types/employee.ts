export interface EmployeeDTO {
  id?: string | number
  firstName?: string
  lastName?: string
  email?: string
  role?: string
  position?: string
  phone?: string
  department?: string
  gender?: string
  birthDate?: string
  countryOfBirth?: string
  countryOfResidence?: string
  mobilePhone?: string
  citizenshipCardNumber?: string
  passportNumber?: string
  hasAmericanVisa?: boolean | number
  physicalAddress?: string
  dateEntry?: string
  typeOfConsultant?: string
  percentageAvailability?: string
  professionalExperienceYears?: number | string
  salesforceExperienceYears?: number | string
  rolesPerformed?: string[] | string
  certifications?: EmployeeCertificationDTO[]
  clouds?: EmployeeCloudDTO[]
  description?: string
  allergies?: string
  preExistingIllnesses?: string
  dietaryRestrictions?: string
  bloodType?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  emergencyContactRelationship?: string
  inProject?: boolean | number
  status?: boolean | number | string
  EmployeeId?: string | number
  FirstName?: string
  LastName?: string
  Email?: string
  CountryOfBirthId?: string
  CountryOfResidenceId?: string
  DateOfBirth?: string
}

export interface EmployeeCertificationDTO {
  id?: string | number
  issuer?: string
  certId?: string
  name?: string
}

export interface EmployeeFormModel {
  id?: string | number
  firstName: string
  lastName: string
  email: string
  role: string
  position: string
  phone: string
  department: string
  gender: string
  birthDate: string
  countryOfBirth: string
  countryOfResidence: string
  mobilePhone: string
  citizenshipCardNumber: string
  passportNumber: string
  hasAmericanVisa: boolean
  physicalAddress: string
  dateEntry: string
  typeOfConsultant: string
  percentageAvailability: string
  professionalExperienceYears: string
  salesforceExperienceYears: string
  rolesPerformed: string[]
  certifications: EmployeeCertificationFormModel[]
  clouds: EmployeeCloudFormModel[]
  description: string
  allergies: string
  preExistingIllnesses: string
  dietaryRestrictions: string
  bloodType: string
  emergencyContactName: string
  emergencyContactPhone: string
  emergencyContactRelationship: string
  inProject: boolean
  status: boolean
}

export interface EmployeeCertificationFormModel {
  id?: string | number
  issuer?: string
  certId?: string
  name?: string
}

export interface EmployeeCloudFormModel {
  id?: string | number
  issuerId: string
  issuerName: string
  cloudId: string
  cloudName: string
}

export interface EmployeeCloudDTO {
  id?: string | number
  issuerId?: string
  issuer?: string
  issuerName?: string
  cloudId?: string
  cloudName?: string
}
