import { Link } from 'react-router-dom'
import logoNav from '../recursos/logo_bar_nav.png'
import SharedFooter from '../components/SharedFooter'
import NavUserButton from '../components/NavUserButton'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <header className="bg-white/90 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
        <div className="container px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3 md:gap-5">
          <div className="flex items-center gap-3 md:gap-8">
            <Link to="/dashboard" className="flex-shrink-0">
              <img src={logoNav} alt="Consulta Médica Ecuador" className="h-8 md:h-9 w-auto" />
            </Link>
            <div className="hidden md:block w-px h-5 bg-gray-200 flex-shrink-0" />
            <a
              href="https://pro.omedso.com"
              target="_blank"
              rel="noreferrer"
              className="hidden md:block text-[15px] font-semibold text-gray-600 hover:text-[#140172] transition whitespace-nowrap"
            >
              ¿Eres profesional?
            </a>
          </div>
          <NavUserButton />
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 py-4 md:py-6">
        {children}
      </main>

      <SharedFooter />
    </div>
  )
}
