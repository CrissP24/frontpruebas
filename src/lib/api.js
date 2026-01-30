import axios from 'axios'
import { mockApi } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'

export const api = axios.create({
  baseURL: API_URL,
})

// Interceptor para agregar token automáticamente
api.interceptors.request.use(
  (config) => {
    try {
      const authStr = localStorage.getItem('mysimo_auth')
      if (authStr) {
        const auth = JSON.parse(authStr)
        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`
        }
      }
      // No agregar Content-Type para FormData (multer lo maneja)
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type']
      }
    } catch (e) {
      console.error('Error getting auth token:', e)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    // Si la respuesta tiene el formato nuevo { success, data }, extraer data
    if (response.data && typeof response.data === 'object' && 'success' in response.data) {
      // Si success es true, retornar data directamente (pero mantener meta si existe)
      if (response.data.success) {
        // Si tiene meta, mantenerlo en la respuesta
        if (response.data.meta) {
          return { 
            ...response, 
            data: {
              data: response.data.data,
              meta: response.data.meta
            }
          }
        }
        // Si no tiene meta, solo retornar data
        return { ...response, data: response.data.data }
      }
      // Si success es false, mantener la estructura completa para manejo de errores
      if (!response.data.success) {
        return response
      }
    }
    return response
  },
  (error) => {
    // Manejar errores de autenticación
    if (error.response?.status === 401) {
      localStorage.removeItem('mysimo_auth')
      // Redirigir a login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    
    // Extraer mensaje de error del formato nuevo si existe
    if (error.response?.data) {
      // Intentar extraer el mensaje de error de diferentes formatos
      if (error.response.data.error) {
        error.message = error.response.data.error
      } else if (error.response.data.message) {
        error.message = error.response.data.message
      } else if (typeof error.response.data === 'string') {
        error.message = error.response.data
      }
    }
    
    return Promise.reject(error)
  }
)

// Override axios methods to use mocks for MVP
const originalGet = api.get
const originalPost = api.post
const originalPut = api.put
const originalDelete = api.delete

// Helper to parse URL and params
function parseUrl(url) {
  const urlObj = new URL(url, 'http://dummy.com')
  const path = urlObj.pathname
  const params = {}
  for (let [key, value] of urlObj.searchParams) {
    params[key] = value
  }
  return { path, params }
}

api.get = async function(url, config) {
  const { path, params } = parseUrl(url)
  
  // Use mocks for MVP
  try {
    if (path === '/admin/stats') {
      const data = await mockApi.getAdminStats()
      return { data }
    }
    if (path.startsWith('/admin/users')) {
      const data = await mockApi.getUsers(params)
      return { data }
    }
    if (path === '/doctors') {
      const data = await mockApi.getDoctors(params)
      return { data }
    }
    if (path.match(/^\/doctors\/\d+$/)) {
      const id = path.split('/')[2]
      const data = await mockApi.getDoctor(id)
      return { data }
    }
    if (path === '/doctors/me') {
      const data = await mockApi.getCurrentDoctor()
      return { data }
    }
    if (path === '/appointments/me') {
      const data = await mockApi.getAppointments(params)
      return { data }
    }
    if (path === '/appointments/all') {
      const data = await mockApi.getAllAppointments(params)
      return { data }
    }
    if (path === '/specialties') {
      const data = await mockApi.getSpecialties()
      return { data }
    }
    if (path === '/admin/specialties') {
      const data = await mockApi.getSpecialties()
      return { data }
    }
  } catch (e) {
    // If mock fails, fall back to real API
  }
  
  return originalGet.call(this, url, config)
}

api.post = async function(url, data, config) {
  const { path } = parseUrl(url)
  
  // Use mocks for MVP
  try {
    if (path === '/admin/users') {
      const result = await mockApi.createUser(data)
      return { data: result }
    }
    if (path === '/doctors') {
      const result = await mockApi.createDoctor(data)
      return { data: result }
    }
    if (path === '/appointments') {
      const result = await mockApi.createAppointment(data)
      return { data: result }
    }
    if (path === '/specialties') {
      const result = await mockApi.createSpecialty(data)
      return { data: result }
    }
    if (path === '/admin/specialties') {
      const result = await mockApi.createSpecialty(data)
      return { data: result }
    }
  } catch (e) {
    // If mock fails, fall back to real API
  }
  
  return originalPost.call(this, url, data, config)
}

api.put = async function(url, data, config) {
  const { path } = parseUrl(url)
  
  // Use mocks for MVP
  try {
    if (path.startsWith('/admin/users/')) {
      const id = path.split('/').pop()
      const result = await mockApi.updateUser(id, data)
      return { data: result }
    }
    if (path.startsWith('/doctors/')) {
      const id = path.split('/').pop()
      const result = await mockApi.updateDoctor(id, data)
      return { data: result }
    }
    if (path.startsWith('/appointments/')) {
      const id = path.split('/').pop()
      const result = await mockApi.updateAppointment(id, data)
      return { data: result }
    }
    if (path.startsWith('/specialties/')) {
      const id = path.split('/').pop()
      const result = await mockApi.updateSpecialty(id, data)
      return { data: result }
    }
    if (path.startsWith('/admin/specialties/')) {
      const id = path.split('/').pop()
      const result = await mockApi.updateSpecialty(id, data)
      return { data: result }
    }
  } catch (e) {
    // If mock fails, fall back to real API
  }
  
  return originalPut.call(this, url, data, config)
}

api.delete = async function(url, config) {
  const { path } = parseUrl(url)
  
  // Use mocks for MVP
  try {
    if (path.startsWith('/admin/users/')) {
      const id = path.split('/').pop()
      await mockApi.deleteUser(id)
      return { data: null }
    }
    if (path.startsWith('/doctors/')) {
      const id = path.split('/').pop()
      await mockApi.deleteDoctor(id)
      return { data: null }
    }
    if (path.startsWith('/appointments/')) {
      const id = path.split('/').pop()
      await mockApi.deleteAppointment(id)
      return { data: null }
    }
    if (path.startsWith('/specialties/')) {
      const id = path.split('/').pop()
      await mockApi.deleteSpecialty(id)
      return { data: null }
    }
    if (path.startsWith('/admin/specialties/')) {
      const id = path.split('/').pop()
      await mockApi.deleteSpecialty(id)
      return { data: null }
    }
  } catch (e) {
    // If mock fails, fall back to real API
  }
  
  return originalDelete.call(this, url, config)
}




