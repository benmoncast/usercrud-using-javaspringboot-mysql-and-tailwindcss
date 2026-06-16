export const emptyUserForm = {
  first_name: '',
  middle_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  phone_number: '',
  gender: '',
  birth_date: '',
  address: '',
  role: 'user',
  status: 'active',
}

const formKeys = Object.keys(emptyUserForm)

export function toUserForm(user) {
  return {
    ...emptyUserForm,
    ...formKeys.reduce((form, key) => ({ ...form, [key]: user?.[key] ?? '' }), {}),
    password: '',
    role: user?.role || 'user',
    status: user?.status || 'active',
  }
}

export function createUserFormData(form, imageFile, { includeEmptyPassword = true } = {}) {
  const formData = new FormData()

  formKeys.forEach((key) => {
    if (key === 'password' && !includeEmptyPassword && !form[key]) {
      return
    }

    formData.append(key, form[key] ?? '')
  })

  if (imageFile) {
    formData.append('profile_image', imageFile)
  }

  return formData
}

export function formatDateTime(value) {
  if (!value) {
    return ''
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
