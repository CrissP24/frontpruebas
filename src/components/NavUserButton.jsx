import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function NavUserButton({ onLoginClick }) {
  const { auth, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const userName = auth?.user?.name || auth?.user?.email?.split('@')[0] || 'Usuario'
  const userInitials = userName.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()

  if (!auth?.user) {
    return (
      <button
        onClick={onLoginClick}
        className="btn-primary flex items-center gap-1.5 text-xs md:text-sm px-3 py-1.5 md:px-5 md:py-2 flex-shrink-0"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="3" />
          <path d="M6 18c1.5-3 4.5-3 6-3s4.5 0 6 3" />
        </svg>
        <span>Acceder</span>
      </button>
    )
  }

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100"
      >
        {auth.user.avatar ? (
          <img
            src={auth.user.avatar}
            referrerPolicy="no-referrer"
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#140172]/10 flex items-center justify-center border border-[#140172]/20 flex-shrink-0">
            <span className="text-[11px] font-bold text-[#140172]">{userInitials}</span>
          </div>
        )}
        <span className="hidden sm:block text-sm font-semibold text-slate-700 max-w-[110px] truncate">{userName}</span>
        <svg
          className={`w-3.5 h-3.5 text-slate-400 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3.5 bg-gradient-to-br from-[#140172]/5 to-indigo-50 border-b border-slate-100">
            <p className="text-[13px] font-bold text-slate-900 truncate">{userName}</p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">{auth.user.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Mi Panel
            </Link>
            <Link
              to="/dashboard/perfil"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 transition"
            >
              <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mi Perfil
            </Link>
            <button
              onClick={() => { setOpen(false); logout() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
