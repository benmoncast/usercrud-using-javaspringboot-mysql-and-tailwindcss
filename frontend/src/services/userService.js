import axios from 'axios'

export const API_ORIGIN = (import.meta.env.VITE_API_ORIGIN || 'http://localhost:8080').replace(/\/$/, '')

const api = axios.create({
  baseURL: `${API_ORIGIN}/api`,
})

const unwrap = (response) => response.data?.data ?? response.data

export function getImageUrl(path) {
  if (!path) {
    return ''
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}

export function getErrorMessage(error) {
  const response = error.response?.data

  if (response?.errors) {
    return [response.message, ...Object.values(response.errors)].filter(Boolean).join(' ')
  }

  return response?.message || error.message || 'Request failed.'
}

export const userService = {
  async createUser(formData) {
    const response = await api.post('/users', formData)
    return unwrap(response)
  },

  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`)
    return unwrap(response)
  },

  async getUser(id) {
    const response = await api.get(`/users/${id}`)
    return unwrap(response)
  },

  async getUsers() {
    const response = await api.get('/users')
    return unwrap(response)
  },

  async searchUsers(keyword) {
    const response = await api.get('/users/search', { params: { keyword } })
    return unwrap(response)
  },

  async updateUser(id, formData) {
    const response = await api.put(`/users/${id}`, formData)
    return unwrap(response)
  },
}
