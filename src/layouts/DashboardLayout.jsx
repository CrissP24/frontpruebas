import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { HomeIcon, CalendarIcon, UserIcon, SettingsIcon, LogoutIcon, DoctorIcon, ChartBarIcon, UsersIcon } from '../components/dashboard/IconComponents'

export default function DashboardLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { auth, logout } = useAuth()
  const role = auth?.user?.role

  const isActive = (path) => location.pathname === path

  const patientNav = [
    { path: '/dashboard', label: 'Inicio', icon: HomeIcon },
    { path: '/dashboard/citas', label: 'Mis Citas', icon: CalendarIcon },
    { path: '/dashboard/perfil', label: 'Mi Perfil', icon: UserIcon },
  ]

  const doctorNav = [
    { path: '/dashboard', label: 'Inicio', icon: HomeIcon },
    { path: '/dashboard/citas', label: 'Mis Citas', icon: CalendarIcon },
    { path: '/dashboard/perfil', label: 'Mi Perfil', icon: DoctorIcon },
    { path: '/dashboard/estadisticas', label: 'Estadísticas', icon: ChartBarIcon },
  ]

  const adminNav = [
    { path: '/dashboard', label: 'Inicio', icon: HomeIcon },
    { path: '/dashboard/usuarios', label: 'Usuarios', icon: UsersIcon },
    { path: '/dashboard/doctores', label: 'Doctores', icon: DoctorIcon },
    { path: '/dashboard/especialidades', label: 'Especialidades', icon: ChartBarIcon },
    { path: '/dashboard/perfil', label: 'Perfil', icon: UserIcon },
    { path: '/dashboard/configuracion', label: 'Configuración', icon: SettingsIcon },
  ]

  const navItems = role === 'admin' ? adminNav : role === 'doctor' ? doctorNav : patientNav

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout()
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="container py-6">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="card p-4 h-fit sticky top-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[var(--primary)] mb-1">Consulta Médica</h2>
              <p className="text-xs text-gray-500">
                {role === 'doctor' ? 'Panel Médico' : role === 'admin' ? 'Panel Admin' : 'Panel Paciente'}
              </p>
            </div>

            <nav className="space-y-1 mb-6">
              {navItems.map((item) => {
                const Icon = item.icon
                const active = isActive(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t pt-4">
              <div className="px-4 py-2 mb-3">
                <p className="text-sm font-medium text-gray-900">{auth?.user?.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{auth?.user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogoutIcon className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}




