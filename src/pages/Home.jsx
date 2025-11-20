import DoctorSearchBar from '../components/DoctorSearchBar'
import HowItWorks from '../components/HowItWorks'
import FeaturedDoctors from '../components/FeaturedDoctors'
import GadgetSection from '../components/GadgetSection'

// 👇 Ruta correcta desde src/pages/Home.jsx
import bgDoctor from '../components/recursos/bg_doct.png'
import telemd from '../components/recursos/telemd.png'

export default function Home() {
  return (
    <>
      {/* Fondo degradado exclusivo del Home */}
      <section className="relative bg-gradient-to-br from-[#140172]/20 to-white overflow-hidden">
        <div className="container py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Columna de texto */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight">
                Encuentra al médico que necesitas cerca de ti
              </h1>
              <p className="mt-4 text-[var(--text-light)] max-w-2xl">
                Reserva tu cita médica online sin complicaciones.
              </p>
            </div>

            {/* Barra de búsqueda con espacio equilibrado */}
            <div className="md:col-span-2 mt-10 md:mt-12">
              <DoctorSearchBar className="md:max-w-5xl mx-auto md:mx-0" />
            </div>
          </div>
        </div>

        {/* Imagen del equipo médico superpuesta, alineada a la derecha y más grande */}
        <div className="absolute bottom-0 right-0 hidden md:flex justify-end pointer-events-none">
          <img
            src={bgDoctor}
            alt="Equipo médico profesional con tablet"
            className="
              object-contain
              h-[300px]
              md:h-[380px]
              lg:h-[460px]
              xl:h-[520px]
              max-w-none
              opacity-95
              drop-shadow-2xl
              translate-x-4
              translate-y-2
            "
          />
        </div>
      </section>

      {/* Secciones siguientes */}
      <HowItWorks />
      <FeaturedDoctors /> 

      {/* Banner Consultas en línea — versión compacta */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#e6e9ff] via-[#f5f5ff] to-white text-[var(--primary)]">
        <div className="container relative z-10 py-10 md:py-12 grid md:grid-cols-[1.1fr,0.9fr] gap-8 items-center">
          
          {/* Texto */}
          <div className="space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight text-[var(--primary)]">
              Medicina, nutrición y psicología desde casa
            </h2>

            {/* Mini-items + mensaje comercial */}
            <div className="space-y-3">

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px] md:text-sm text-[var(--primary)]">
                <li className="flex items-start gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-[var(--primary)]">
                    <path
                      d="M20 7L9 18l-5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Consultas ilimitadas con médicos, nutricionistas y psicólogos en línea</span>
                </li>
                <li className="flex items-start gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-[var(--primary)]">
                    <path
                      d="M3 12h18M5 16h14M7 8h10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Agenda en minutos, y haz tu consulta sin tediosos traslados ni eternas filas</span>
                </li>
                <li className="flex items-start gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-[var(--primary)]">
                    <rect
                      x="3"
                      y="6"
                      width="14"
                      height="10"
                      rx="2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect x="19" y="9" width="2" height="6" rx="1" fill="currentColor" />
                  </svg>
                  <span>Atención en cualquier lugar desde tu celular, tablet o computador</span>
                </li>
                <li className="flex items-start gap-2 rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2 shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0 text-[var(--primary)]">
                    <path
                      d="M12 21s8-4 8-10V6l-8-3-8 3v5c0 6 8 10 8 10z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Pagos en línea protegidos y comprobante al instante junto con tu receta</span>
                </li>
              </ul>
            </div>
<br></br>
            {/* CTA + nota */}
            <div className="mt-6 space-y-1.5">
              <a
                href="https://omedso.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#031b4e] text-white px-5 py-2.5 text-sm font-semibold shadow-md transition hover:bg-[#005E00]"
              >
                Suscribete ahora
              </a>
              <p className="text-[11px] text-[var(--text-light)] leading-tight">
                * Te redirigiremos a omedso.com, donde podrás contratar tu plan anual y recibir tus
                consultas ilimitadas y en línea por el tiempo que dure tu suscripción.
              </p>
            </div>
          </div>


          {/* Mock de videollamada — dark mode */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-sm">
              <div className="mx-auto h-2.5 w-4/5 rounded-b-3xl bg-black/20 blur-[1px]" />
              <div className="relative -mt-2.5 rounded-2xl bg-slate-950 text-white shadow-2xl overflow-hidden ring-1 ring-slate-900/60">
                
                {/* top bar */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-400/80" />
                    <span className="w-2 h-2 rounded-full bg-yellow-300/80" />
                    <span className="w-2 h-2 rounded-full bg-green-400/80" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-500/20 px-2 py-0.5 text-[9px] font-medium text-emerald-100">
                      <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                        <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400/30" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      </span>
                      Consulta en línea
                    </span>
                    <span className="text-[10px] text-white/60">12:34</span>
                  </div>
                </div>

                {/* contenido */}
                <div className="grid grid-cols-[1.1fr,0.9fr]">
                  {/* Video doctor */}
<div className="bg-slate-950 flex items-stretch">
  <div className="w-full h-full rounded-none ring-1 ring-white/10 overflow-hidden">
    <img
      src={telemd}
      alt="Doctor atendiendo videollamada"
      className="w-full h-full object-cover"
    />
  </div>
</div>

                  <aside className="bg-slate-900/90 border-l border-white/10 p-3 space-y-2.5">
                    <span className="text-[11px] uppercase tracking-wide text-white/70">Tipo de consulta</span>
                    {[
                      { label: 'Telemedicina', tag: 'En curso' },
                      { label: 'Telenutrición', tag: 'Disponible' },
                      { label: 'Telepsicología', tag: 'Disponible' },
                    ].map(({ label, tag }, i) => (
                      <div
                        key={label}
                        className={`rounded-lg px-2.5 py-1.5 text-[11px] ${
                          i === 0 ? 'bg-white/10 ring-1 ring-white/20' : 'bg-white/5'
                        }`}
                      >
                        <p className="text-white leading-tight">{label}</p>
                        <p className="text-[10px] text-emerald-300/90 leading-tight">{tag}</p>
                      </div>
                    ))}
                  </aside>
                </div>

                {/* controles */}
                <div className="flex items-center justify-center gap-4 py-2.5 bg-slate-900/90 border-t border-white/10">
                  <button
                    aria-label="Mic"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
                      <path
                        d="M12 14a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v4a4 4 0 0 0 4 4zM19 10v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>

                  <button
                    aria-label="Colgar"
                    className="h-9 w-9 rounded-full bg-[var(--coral)] hover:brightness-95 grid place-items-center shadow-lg transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
                      <path
                        d="M6.62 4.16a1 1 0 0 1 1.11-.27l3.2 1.28a1 1 0 0 1 .61.74l.38 2.18a1 1 0 0 1-.27.86l-1.4 1.4a11.05 11.05 0 0 0 4.95 4.95l1.4-1.4a1 1 0 0 1 .86-.27l2.18.38a1 1 0 0 1 .74.61l1.28 3.2a1 1 0 0 1-.27 1.11l-1.5 1.5a2 2 0 0 1-2.02.5c-2.43-.81-4.72-2.22-6.85-4.35-2.13-2.13-3.54-4.42-4.35-6.85a2 2 0 0 1 .5-2.02l1.5-1.5z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <button
                    aria-label="Cámara"
                    className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center transition"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
                      <path
                        d="M15 10l4-3v10l-4-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="3"
                        y="7"
                        width="12"
                        height="10"
                        rx="2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>


      {/* Preguntas frecuentes - formato sin tarjetas blancas */}
      <section className="py-16 md:py-20 bg-[var(--bg)]">
        <div className="container max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] tracking-tight text-center">
            Preguntas frecuentes
          </h2>
          <p className="mt-3 mb-10 text-center text-[var(--text-light)]">
            Resolvemos las dudas más comunes sobre cómo funciona nuestra plataforma.
          </p>

          <div className="divide-y divide-[var(--line)] border-t border-b border-[var(--line)]">
            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer text-[var(--text)] font-semibold">
                <span>¿Cómo reservo una cita médica?</span>
                <span className="text-sm text-[var(--primary)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-[var(--text-light)]">
                Busca al médico o especialidad, elige una fecha y hora disponibles y completa tus
                datos de contacto. Al confirmar, tu cita queda registrada y el médico recibe la
                notificación.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer text-[var(--text)] font-semibold">
                <span>¿El uso de nuestra plataforma tiene algún costo para el paciente?</span>
                <span className="text-sm text-[var(--primary)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-[var(--text-light)]">
                No cobramos comisiones adicionales por reservar tu cita a través de la plataforma.
                El valor que ves corresponde al honorario que define cada profesional de salud.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer text-[var(--text)] font-semibold">
                <span>¿Necesito crear una cuenta para agendar una cita?</span>
                <span className="text-sm text-[var(--primary)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-[var(--text-light)]">
                Te pediremos solo los datos básicos para confirmar la cita y enviarte la
                confirmación por correo o SMS. Crear una cuenta es opcional y te permite gestionar
                tu historial de reservas.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer text-[var(--text)] font-semibold">
                <span>¿Puedo ver qué seguros médicos acepta cada médico?</span>
                <span className="text-sm text-[var(--primary)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-[var(--text-light)]">
                Sí. Cuando el profesional ha registrado esta información, verás los seguros médicos
                que acepta dentro de su perfil antes de confirmar tu cita.
              </p>
            </details>

            <details className="group py-4">
              <summary className="flex items-center justify-between cursor-pointer text-[var(--text)] font-semibold">
                <span>¿Cómo protegen mis datos personales?</span>
                <span className="text-sm text-[var(--primary)] group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm md:text-base text-[var(--text-light)]">
                Utilizamos tus datos únicamente para gestionar tus citas y la comunicación con tu
                médico. Aplicamos buenas prácticas de seguridad y respetamos la normativa vigente de
                protección de datos aplicable.
              </p>
            </details>
          </div>
        </div>
      </section>
    </>
  )
}
