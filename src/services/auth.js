import { api } from '../lib/api'

/**
 * Servicio de autenticación
 * Maneja las llamadas API de autenticación
 */
export async function loginApi(email, password){
  const response = await api.post('/auth/login', { email, password })
  // El interceptor de axios ya extrae response.data.data si existe successResponse
  // Entonces response.data debería ser directamente { user, token }
  return response.data
}

export async function registerApi(payload){
  const response = await api.post('/auth/register', payload)
  // El interceptor de axios ya extrae response.data.data si existe successResponse
  return response.data
}




