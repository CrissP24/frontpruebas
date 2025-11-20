export default function HowItWorks() {
  const steps = [
    {
      title: 'Busca tu médico ideal',
      desc: 'Encuentra profesionales del área de la salud por nombre, ciudad o especialidad en segundos con nuestro buscador inteligente.',
      icon: SearchIcon,
    },
    {
      title: 'Conoce su perfil',
      desc: 'Consulta información detallada sobre el médico: experiencia, precios, disponibilidad, seguros aceptados y sitios de atención.',
      icon: InfoIcon,
    },
    {
      title: 'Reserva tu cita',
      desc: 'Confirma tu cita en línea de forma segura. Recibirás un correo y un SMS con todos los detalles de tu reserva totalmente gratis.',
      icon: CalendarIcon,
    },
  ]

  return (
    <section className="py-20 bg-[var(--bg)]">
      <div className="container">
        {/* Encabezado: sin etiqueta <header> para evitar el fondo blanco global */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--text)] tracking-tight">
            ¿Cómo reservar tu cita médica?
          </h2>
          <p className="mt-3 text-[var(--text-light)] text-lg">
            Agenda tu atención médica en tres pasos simples y seguros.
          </p>
        </div>

        {/* Grid de pasos */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <article
                key={index}
                className="
                  group relative overflow-hidden rounded-2xl bg-white
                  border border-[var(--line)] shadow-card
                  transition-all duration-200
                  hover:-translate-y-2 hover:shadow-xl hover:border-[var(--primary)]/20
                  p-8 text-center
                "
              >
                {/* Ícono circular */}
                <div className="flex justify-center mb-6">
                  <div
                    className="
                      flex items-center justify-center rounded-full
                      w-20 h-20 bg-[var(--primary)] text-white
                      shadow-md ring-8 ring-[var(--primary)]/10
                      transition-transform duration-300 group-hover:scale-110
                    "
                  >
                    <Icon className="w-10 h-10" />
                  </div>
                </div>

                {/* Título del paso */}
                <h3 className="text-xl md:text-2xl font-bold text-[var(--text)] mb-3">
                  {step.title}
                </h3>

                {/* Descripción */}
                <p className="text-[var(--text-light)] text-base leading-relaxed">
                  {step.desc}
                </p>

                {/* Línea decorativa inferior */}
                <div className="mt-6 mx-auto w-16 h-1 bg-[var(--primary)]/70 rounded-full group-hover:w-24 transition-all duration-300" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ==== ICONOS ==== */
function SearchIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="16.65" y1="16.65" x2="21" y2="21" />
    </svg>
  )
}

function InfoIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <circle cx="12" cy="8" r="0.8" fill="currentColor" />
    </svg>
  )
}

function CalendarIcon({ className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="8.5" cy="14.5" r="1.3" />
      <circle cx="12" cy="14.5" r="1.3" />
      <circle cx="15.5" cy="14.5" r="1.3" />
    </svg>
  )
}







