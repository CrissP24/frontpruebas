import { mockApi } from '../data/mockData'

export async function loginApi(email, password) {
  const result = await mockApi.login(email, password)
  return result
}

export async function registerApi(payload) {
  const result = await mockApi.register(payload)
  return result
}

export async function googleLoginApi(credential) {
  const apiUrl = import.meta.env.VITE_API_URL

  // Intentar con el backend real primero
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential }),
      })
      if (res.ok) {
        return await res.json()
      }
    } catch {
      // Backend no disponible, usar mock
    }
  }

  // Fallback: mock local (dev sin backend)
  const base64Payload = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const payload = JSON.parse(atob(base64Payload))
  return await mockApi.googleLogin(payload)
}
