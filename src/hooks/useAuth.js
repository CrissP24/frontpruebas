import { useEffect, useState } from 'react'
import { getAuth, setAuth as setAuthStore, clearAuth } from '../store/auth'

export function useAuth(){
  const [auth, setAuthState] = useState(getAuth())
  useEffect(()=>{ setAuthState(getAuth()) },[])
  const setAuth = (val)=>{ setAuthStore(val); setAuthState(val) }
  const logout = ()=>{ clearAuth(); setAuthState(null); window.location.href='/' }
  return { auth, setAuth, logout }
}








