export function getAuth(){
  try { return JSON.parse(localStorage.getItem('mysimo_auth') || 'null') } catch { return null }
}
export function setAuth(auth){ localStorage.setItem('mysimo_auth', JSON.stringify(auth)) }
export function clearAuth(){ localStorage.removeItem('mysimo_auth') }








