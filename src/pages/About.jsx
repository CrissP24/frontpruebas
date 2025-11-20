
import step1Img from '../components/recursos/1.jpeg'
import step2Img from '../components/recursos/2.jpeg'
import visionImg from '../components/recursos/vision.jpeg'
import step3Img from '../components/recursos/3.jpeg'
import centralImg from '../components/recursos/central.jpeg'

export default function About() {  
  return (
    
    <main className="container py-12 md:py-16 space-y-16">
      {/* Hero: texto + composición visual */}
      <section className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] items-center">
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Parte del ecosistema Syrosmed
          </p>
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            Consulta Médica Ecuador
            <span className="block text-[var(--primary)]">
              Encuentra, agenda, consulta
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--text-light)] max-w-xl">
            Consulta Médica Ecuador es una de las plataformas del ecosistema de salud digital de <span className="text-[var(--primary)] font-medium">Syrosmed</span>, que conecta pacientes con profesionales de la salud —médicos, nutricionistas y psicólogos cuidadosamente seleccionados— y al mismo tiempo te ofrece herramientas digitales gratuitas que te acompañan antes, durante y después de cada consulta.
          </p>

        </div>

        {/* Composición visual principal */}
        <div className="relative">
          {/* Contenedor principal de imagen */}
          <div className="aspect-[4/3] rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 shadow-lg overflow-hidden">
           <img
              src={centralImg}
              alt="Médico atendiendo una videollamada con un paciente"
              className="h-full w-full object-cover"
            />  
          </div>

          {/* Tarjeta flotante 1: Doctores verificados */}
          <div className="hidden md:block absolute -bottom-6 -left-4 rounded-2xl bg-white shadow-lg border border-[var(--line)] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--primary)]">
              Doctores verificados
            </p>
            <p className="text-[11px] text-[var(--text-light)]">
              Solo perfiles que superan un proceso de selección y validación
              profesional.
            </p>
          </div>

          {/* Tarjeta flotante 2: Gadgets gratuitos */}
          <div className="hidden md:block absolute -top-6 -right-4 rounded-2xl bg-white shadow-lg border border-[var(--line)] px-4 py-3">
            <p className="text-xs font-semibold text-[var(--accent)]">
              Gadgets de salud gratuitos
            </p>
            <p className="text-[11px] text-[var(--text-light)]">
              Ciclo menstrual, apoyo para interpretar exámenes y más, sin costo
              adicional.
            </p>
          </div>
        </div>
      </section>

      {/* Sección: Para quién es el ecosistema */}
<section className="mt-16">
  {/* Título centrado al estilo “¿Necesitas ayuda?” */}
  <div className="text-center max-w-2xl mx-auto">
    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)]">
      ¿Para quién es este ecosistema?
    </h2>
    <p className="mt-2 text-sm text-[var(--text-light)]">
      Pacientes, profesionales y empresas conectados en una sola experiencia de salud digital.
    </p>
  </div>

  {/* Tarjetas con color suave y efecto moderno */}
<div className="mt-8 grid gap-6 md:grid-cols-3">
  {/* Pacientes */}
  <div className="group rounded-3xl bg-white border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center gap-3 mb-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A8C7FF]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#02053A]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.5 20a6.5 6.5 0 0113 0M12 12a4 4 0 100-8 4 4 0 000 8z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#02053A]">
          Pacientes
        </h3>
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
          Salud en cada etapa
        </p>
      </div>
    </div>
    <p className="text-sm leading-relaxed text-slate-600">
      Encuentras perfiles claros y verificados. Agenda tu consulta presencial u
      online y acompaña tu cuidado con gadgets de salud gratuitos.
    </p>
  </div>

  {/* Profesionales */}
  <div className="group rounded-3xl bg-white border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center gap-3 mb-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A8C7FF]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#02053A]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 21v-2m4 2v-2m-7 0h10a2 2 0 002-2V7a2 2 0 00-2-2h-3l-.447-.894A1 1 0 0012 4a1 1 0 00-.894.553L10.66 5H7a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#02053A]">
          Profesionales
        </h3>
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
          Crece con tu consulta
        </p>
      </div>
    </div>
    <p className="text-sm leading-relaxed text-slate-600">
      Potencias tu consulta con presencia digital confiable. Gestionas agenda y
      teleconsultas con el soporte integrado de{" "}
      <span className="text-[var(--primary)] font-medium">Omedso</span>.
    </p>
  </div>

  {/* Empresas y seguros */}
  <div className="group rounded-3xl bg-white border border-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-5 md:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="flex items-center gap-3 mb-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#A8C7FF]">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#02053A]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="currentColor"
            className="w-5 h-5 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 21h18M9 21V9h6v12M3 21V7a2 2 0 012-2h2m10 0h2a2 2 0 012 2v14"
            />
          </svg>
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#02053A]">
          Empresas 
        </h3>
        <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
          Salud a gran escala
        </p>
      </div>
    </div>
    <p className="text-sm leading-relaxed text-slate-600">
      Implementas proyectos de telemedicina y gestión clínica
      multiconsultorio a través del ecosistema{" "}
      <span className="text-[var(--primary)] font-medium">Syrosmed</span>, para clinicas y empresas.
    </p>
  </div>
</div>

</section>

{/* Profesionales seleccionados, no un listado cualquiera */}
<section className="mt-16 space-y-10">
  {/* Título centrado */}
  <div className="text-center max-w-3xl mx-auto">
    <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-[var(--text)]">
      Mucho más que un directorio
    </h2>
    <p className="mt-3 text-sm md:text-base text-[var(--text-light)]">
      Cada profesional presente en nuestra plataforma es cuidadosamente seleccionado.  
    </p>
  </div>

  {/* Tres imágenes + mensajes clave */}
{/* Tres imágenes + mensajes clave */}
<div className="grid gap-8 md:grid-cols-3">
  {/* Tarjeta 1 */}
  <article className="space-y-3">
    <div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-[1.9rem] border-4 border-[var(--accent)]/40">
      <img
        src={step1Img}
        alt="Profesional de la salud revisando documentación y credenciales"
        className="h-full w-full object-cover rounded-[1.7rem]"
      />
      <span
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white shadow-lg"
        style={{ backgroundColor: 'rgba(0, 67, 206, 0.8)' }}
      >
        01
      </span>
    </div>
    <div className="text-center px-2">
      <h3 className="text-sm font-semibold text-[var(--primary)]">
        Selección rigurosa
      </h3>
      <p className="text-sm text-[var(--text-light)]">
        Revisamos título, especialidad, registros oficiales y experiencia real de cada
        profesional. 
      </p>
    </div>
  </article>

  {/* Tarjeta 2 */}
  <article className="space-y-3">
    <div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-[1.9rem] border-4 border-[var(--accent)]/40">
      <img
        src={step2Img}
        alt="Profesional conectado con Omedso gestionando teleconsultas"
        className="h-full w-full object-cover rounded-[1.7rem]"
      />
      <span
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white shadow-lg"
        style={{ backgroundColor: 'rgba(0, 67, 206, 0.8)' }}
      >
        02
      </span>
    </div>
    <div className="text-center px-2">
      <h3 className="text-sm font-semibold text-[var(--primary)]">
        Conectados con Omedso
      </h3>
      <p className="text-sm text-[var(--text-light)]">
        Los mejores profesionales usan Omedso,
        así no repites todo cada vez y tu atención tiene continuidad.
      </p>
    </div>
  </article>

  {/* Tarjeta 3 */}
  <article className="space-y-3">
    <div className="relative mx-auto aspect-[4/5] max-w-xs overflow-hidden rounded-[1.9rem] border-4 border-[var(--accent)]/40">
      <img
        src={step3Img}
        alt="Equipo médico revisando estándares de calidad"
        className="h-full w-full object-cover rounded-[1.7rem]"
      />
      <span
        className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full text-base font-semibold text-white shadow-lg"
        style={{ backgroundColor: 'rgba(0, 67, 206, 0.8)' }}
      >
        03
      </span>
    </div>
    <div className="text-center px-2">
      <h3 className="text-sm font-semibold text-[var(--primary)]">
        Calidad garantizada
      </h3>
      <p className="text-sm text-[var(--text-light)]">
        Monitoreamos la actividad de los perfiles, la respuesta a los pacientes y la
        calidad de la información que comparten. 
      </p>
    </div>
  </article>
</div>

</section>


      {/* Sección: Gadgets de salud gratuitos mas adelante */}

      {/* Visión a futuro */}
<section className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] items-center">
  {/* Composición visual: lado izquierdo en desktop */}
  <div className="relative">
    <div className="aspect-[4/3] rounded-2xl border border-[var(--line)] bg-[var(--surface)]/80 shadow-lg overflow-hidden">
       <img
        src={visionImg}
        alt="Visión de salud digital en Ecuador"
        className="h-full w-full object-cover"
      /> 
    </div>
  </div>

  {/* Texto: lado derecho */}
  <div className="space-y-4 max-w-xl">
    <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
      Nuestra visión
    </p>

    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight">
      La salud digital en Ecuador
    </h2>

    <p className="text-sm md:text-base text-[var(--text-light)]">
      Consulta Médica Ecuador nace con un enfoque claro: construir el ecosistema de salud
      digital más confiable del país, conectando lo mejor del mundo presencial con lo mejor
      de la tecnología.
    </p>

    <p className="text-sm md:text-base text-[var(--text-light)]">
      Hoy empezamos en Ecuador. Nuestro objetivo es acompañarte en cada etapa de tu vida,
      acercándote a profesionales cuidadosamente seleccionados, integrando herramientas de
      <span className="text-[var(--primary)] font-medium"> Omedso</span> y
      <span className="text-[var(--primary)] font-medium"> Syrosmed</span>, para poner la tecnología 
      al servicio de todas personas para democratizar el acceso a la salud.
    </p>

    <p className="text-sm md:text-base text-[var(--text-light)]">
      Cuando pienses en salud, queremos que tengas un lugar claro al que acudir para
      encontrar, agendar y consultar de forma segura.
    </p>
  </div>
</section>

    </main>
  )
}







