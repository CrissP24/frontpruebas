import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import logoNav from './recursos/logo_bar_nav.png'  

export default function Navbar() {
  const { auth, logout } = useAuth()

  return (
    <header className="bg-white/90 backdrop-blur border-b">
      <div className="container py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logoNav}
            alt="Consulta Médica Ecuador"
            className="h-9 w-auto"
          />
        </Link>

        {/* Navegación */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? 'text-[var(--primary)] font-semibold' : ''
            }
          >
            Inicio
          </NavLink>

          <NavLink
            to="/doctores"
            className={({ isActive }) =>
              isActive ? 'text-[var(--primary)] font-semibold' : ''
            }
          >
            Directorio
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? 'text-[var(--primary)] font-semibold' : ''
            }
          >
            Acerca
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? 'text-[var(--primary)] font-semibold' : ''
            }
          >
            Contacto
          </NavLink>
        </nav>

        {/* Botones sesión */}
        <div className="flex items-center gap-3">
          {!auth?.user ? (
            <>
              {/* Botón Acceso con icono */}
              <Link to="/login" className="btn-outline flex items-center gap-2">
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="3" />
                  <path d="M6 18c1.5-3 4.5-3 6-3s4.5 0 6 3" />
                </svg>
                <span>Acceder</span>
              </Link>

              <Link to="/registro?tipo=medico" className="btn-accent">
                ¿Eres Especialista?
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="btn-outline">
                Dashboard
              </Link>
              <button onClick={logout} className="btn-outline">
                Salir
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
