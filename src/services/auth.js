import { mockApi } from '../data/mockData'

/**
 * Servicio de autenticación
 * Maneja las llamadas API de autenticación
 */
export async function loginApi(email, password){
  // For MVP, use mock data
  const result = await mockApi.login(email, password)
  return result
}

export async function registerApi(payload){
  // For MVP, use mock data
  const result = await mockApi.register(payload)
  return result
}




