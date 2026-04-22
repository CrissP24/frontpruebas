import { mockApi } from '../data/mockData'

export async function loginApi(email, password) {
  return await mockApi.login(email, password)
}

export async function registerApi(payload) {
  return await mockApi.register(payload)
}

export async function googleLoginApi(credential) {
  const base64Payload = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  const payload = JSON.parse(atob(base64Payload))
  return await mockApi.googleLogin(payload)
}
