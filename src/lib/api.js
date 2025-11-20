import axios from 'axios'

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




