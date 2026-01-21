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
