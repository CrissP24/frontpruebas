import { mockApi } from '../data/mockData'

export async function loginApi(email, password) {
  return await mockApi.login(email, password)
}

export async function registerApi(payload) {
  return await mockApi.register(payload)
}

export async function googleLoginApi(credential) {
  const base64Payload = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  // atob() returns Latin-1 bytes; this re-encodes them as proper UTF-8
  const jsonStr = decodeURIComponent(
    atob(base64Payload)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  )
  const payload = JSON.parse(jsonStr)
  return await mockApi.googleLogin(payload)
}
