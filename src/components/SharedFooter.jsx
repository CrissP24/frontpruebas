import { Link } from 'react-router-dom'
import { FaXTwitter } from 'react-icons/fa6'
import { FaLinkedinIn } from 'react-icons/fa'
import logoFooter from '../recursos/logofooter.png'

export default function SharedFooter() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-white border-t border-slate-200 pt-8 md:pt-10 pb-6">
      <div className="mx-auto max-w-7xl px-5 md:px-16">

        {/* Fila 1 — Síguenos */}
        <div className="flex items-center gap-5 border-b border-slate-100 pb-4 md:pb-5">
          <span className="text-xs md:text-sm font-semibold text-slate-500 tracking-wide">Síguenos</span>
          <a href="https://x.com/omedsolat" target="_blank" rel="noopener noreferrer" aria-label="X"
            className="text-slate-400 transition-colors hover:text-slate-900">
            <FaXTwitter className="h-4 w-4 md:h-[17px] md:w-[17px]" />
          </a>
          <a href="https://linkedin.com/company/omedsolat" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
            className="text-slate-400 transition-colors hover:text-[#0077b5]">
            <FaLinkedinIn className="h-4 w-4 md:h-[17px] md:w-[17px]" />
          </a>
        </div>

        {/* Fila 2 — Logo + links */}
        <div className="py-5 text-[13px] text-slate-500">

          {/* Mobile */}
          <div className="flex flex-col gap-4 md:hidden">
            <a href="https://omedso.com" target="_blank" rel="noreferrer">
              <img src={logoFooter} alt="Omedso" className="h-6 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            </a>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
              <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
                className="text-slate-500 hover:text-[#140172] transition-colors">¿Eres profesional?</a>
              <Link to="/buscar"
                className="text-slate-500 hover:text-[#140172] transition-colors">
                Nuestros Médicos
              </Link>
              <a href="https://omedso.com" target="_blank" rel="noreferrer"
                className="text-slate-500 hover:text-[#140172] transition-colors">
                Monitoreo Integral
              </a>
            </div>
            <div className="flex gap-x-5 text-[11px] border-t border-slate-100 pt-3">
              <Link to="/privacidad" className="text-slate-500 hover:text-[#140172] transition-colors">Privacidad</Link>
              <Link to="/terminos" className="text-slate-500 hover:text-[#140172] transition-colors">Términos</Link>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex items-center flex-wrap gap-x-8 gap-y-3">
            <a href="https://omedso.com" target="_blank" rel="noreferrer" className="flex-shrink-0 mr-2">
              <img src={logoFooter} alt="Omedso" className="h-7 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            </a>
            <a href="https://pro.omedso.com" target="_blank" rel="noreferrer"
              className="text-slate-500 hover:text-[#140172] transition-colors">¿Eres profesional?</a>
            <Link to="/buscar"
              className="text-slate-500 hover:text-[#140172] transition-colors">
              Nuestros Médicos
            </Link>
            <a href="https://omedso.com" target="_blank" rel="noreferrer"
              className="text-slate-500 hover:text-[#140172] transition-colors">
              Monitoreo Integral
            </a>
            <span className="ml-auto flex items-center gap-x-8">
              <Link to="/privacidad" className="text-slate-500 hover:text-[#140172] transition-colors">Privacidad</Link>
              <Link to="/terminos" className="text-slate-500 hover:text-[#140172] transition-colors">Términos</Link>
            </span>
          </div>
        </div>

      </div>
    </footer>
  )
}
