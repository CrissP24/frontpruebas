import logoNav from './recursos/logo_bar_nav.png'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[var(--line)] bg-white/80">
      {/* Bloque superior con 4 secciones: menos espacio y logo más ancho */}
      <div className="container py-8 grid gap-6 lg:grid-cols-12">
        {/* 1️⃣ Logo + slogan (más espacio) */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-2 lg:col-span-4">
          <img
            src={logoNav}
            alt="ConsultaMedicaEc"
            className="h-9 w-auto select-none"
          />
          <p className="text-xs md:text-sm font-semibold tracking-[0.15em] text-[var(--primary)] uppercase">
            Encuentra · Agenda · Consulta
          </p>
        </div>

        {/* 2️⃣ Enlaces rápidos */}
        <div className="text-center lg:text-left lg:col-span-3">
          <h3 className="font-semibold text-[var(--text)] mb-2">Enlaces Rápidos</h3>
          <ul className="space-y-1 text-sm text-[var(--text-light)]">
            <li>
              <a href="/doctores" className="hover:text-[var(--primary)] transition-colors">
                Directorio médico
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-[var(--primary)] transition-colors">
                Sobre nosotros
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-[var(--primary)] transition-colors">
                Contáctanos
              </a>
            </li>
            <li>
              <a href="/registro" className="hover:text-[var(--primary)] transition-colors">
                Eres médico
              </a>
            </li>
          </ul>
        </div>

        {/* 3️⃣ Nuestras oficinas */}
        <div className="text-center lg:text-left lg:col-span-3">
          <h3 className="font-semibold text-[var(--text)] mb-2">Nuestras Oficinas</h3>
          <p className="text-sm text-[var(--text-light)]">C/ Rocafuerte y Colón</p>
          <p className="text-sm text-[var(--text-light)]">Manabí, EC 130650</p>
          <p className="text-sm text-[var(--text-light)] mt-1">Lun–Vie · 9:00–17:00</p>
        </div>

        {/* 4️⃣ Redes sociales */}
        <div className="text-center lg:text-left lg:col-span-2">
          <h3 className="font-semibold text-[var(--text)] mb-2">Redes Sociales</h3>
          <div className="flex justify-center lg:justify-start gap-2.5">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] text-[var(--text-light)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
            >
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] text-[var(--text-light)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/593992646005"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-[var(--line)] text-[var(--text-light)] hover:text-[var(--primary)] hover:border-[var(--primary)] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Línea inferior tipo "marca paraguas" */}
      <div className="border-t border-[var(--line)] py-3">
        <div className="container flex flex-col md:flex-row justify-between items-center text-xs text-[var(--text-light)] gap-2">
          {/* Copy original a la izquierda */}
          <p className="text-center md:text-left">
            www.consultamedica.ec · © {year} Syrosmed – Todos los derechos reservados.
          </p>

          {/* Enlaces legales a la derecha */}
          <div className="flex gap-3">
            <a href="/terminos" className="hover:text-[var(--primary)] transition-colors">
              Términos y condiciones
            </a>
            <a href="/privacidad" className="hover:text-[var(--primary)] transition-colors">
              Política de privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ===== Iconos redes sociales (SVG afinados) ===== */

function FacebookIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M14 8h2V6h-2c-1.657 0-3 1.343-3 3v2H9v2h2v5h2v-5h2l.5-2H13V9c0-.552.448-1 1-1z" />
    </svg>
  )
}

function InstagramIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function WhatsAppIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.94 14.47L2 22l5.66-1.48A9.96 9.96 0 0 0 12 22a10 10 0 0 0 0-20zm5.26 14.11c-.23.64-1.36 1.22-1.88 1.29-.48.07-1.07.1-1.73-.11a8.3 8.3 0 0 1-2.97-1.54 8.83 8.83 0 0 1-2.62-3.16c-.26-.44-.56-1.27-.56-1.27s-.14-.38.09-.61l.64-.81s.21-.29.46-.29c.11 0 .25.02.41.03.13.01.3.01.47.36.17.35.55 1.22.6 1.31.05.09.08.19.01.31-.07.12-.11.19-.23.3-.12.11-.25.25-.36.33-.12.09-.24.19-.1.42.14.23.61 1.01 1.46 1.63.83.6 1.53.8 1.76.89.23.09.37.08.5-.05.13-.13.56-.66.71-.88.15-.22.3-.18.5-.11.2.07 1.26.59 1.47.7.22.11.36.17.42.27.06.1.06.63-.17 1.27z" />
    </svg>
  )
}





