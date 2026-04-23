import { useAuth } from '../../../hooks/useAuth'

function Field({ label, value, mono }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className={`text-sm text-slate-800 break-all ${mono ? 'font-mono' : 'font-medium'}`}>
        {value || <span className="text-slate-400 font-normal italic">—</span>}
      </p>
    </div>
  )
}

const GoogleIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function ProfilePage() {
  const { auth } = useAuth()
  const user = auth?.user

  const roleLabel = user?.role === 'patient' ? 'Paciente' : user?.role === 'doctor' ? 'Médico' : 'Administrador'
  const roleColor = user?.role === 'patient'
    ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200'
    : user?.role === 'doctor'
      ? 'bg-teal-100 text-teal-700 ring-1 ring-teal-200'
      : 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'

  const initials = user?.name
    ? user.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
    : '?'

  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="space-y-5">

      {/* Hero card */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <div className="bg-gradient-to-r from-[#140172] via-indigo-600 to-violet-500 relative overflow-hidden px-6 md:px-8 py-7 md:py-9">
          {/* Círculos decorativos */}
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute top-4 right-36 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-10 left-20 w-40 h-40 rounded-full bg-white/8 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            {/* Avatar */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-white/30 shadow-xl flex-shrink-0"
              />
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white/15 border-2 border-white/25 flex items-center justify-center flex-shrink-0 shadow-xl">
                <span className="text-3xl md:text-4xl font-bold text-white">{initials}</span>
              </div>
            )}

            {/* Nombre + email */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight break-words drop-shadow-sm">
                {user?.name || '—'}
              </h1>
              <p className="text-sm text-white/70 mt-1 break-all">{user?.email}</p>
              <span className={`mt-2.5 inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                user?.role === 'patient' ? 'bg-indigo-200/30 text-indigo-100' :
                user?.role === 'doctor'  ? 'bg-teal-200/30 text-teal-100' :
                'bg-amber-200/30 text-amber-100'
              }`}>
                {roleLabel}
              </span>
            </div>

            {/* Cuenta vinculada */}
            {user?.googleId ? (
              <div className="flex items-center gap-3 p-3 pr-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm md:min-w-[220px]">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <GoogleIcon />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">Google</p>
                  <p className="text-[11px] text-white/60 mt-0.5">Cuenta vinculada</p>
                </div>
                <span className="text-[11px] font-bold text-teal-300 bg-teal-400/20 rounded-full px-2 py-0.5 border border-teal-300/30 flex-shrink-0">Activo</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 pr-4 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm md:min-w-[220px]">
                <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/25 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-white">Contraseña</p>
                  <p className="text-[11px] text-white/60 mt-0.5">Autenticación por correo</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información personal — un solo contenedor ancho */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-6">
          <div className="w-8 h-8 rounded-xl bg-[#140172]/8 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#140172]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-wide">Información personal</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
          <Field label="Nombre completo" value={user?.name} />
          <Field label="Correo electrónico" value={user?.email} />
          <Field label="Rol en el sistema" value={roleLabel} />
          {joinDate && <Field label="Miembro desde" value={joinDate} />}
          {user?.id && <Field label="ID de usuario" value={String(user.id)} mono />}
          {user?.googleId && <Field label="Google ID" value={user.googleId} mono />}
        </div>
      </div>

      {/* Nota informativa */}
      <div className="flex items-start gap-3 rounded-xl bg-blue-50/60 border border-blue-100 px-5 py-4">
        <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-[13px] text-slate-600">
          Para actualizar tu información o solicitar cambios en tu cuenta, contacta con soporte.
        </p>
      </div>

    </div>
  )
}
