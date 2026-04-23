import { useNavigate } from 'react-router-dom';

const TerminosConsultaMedica = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white text-gray-600 antialiased font-sans">
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          
          {/* ENCABEZADO */}
          <div className="mb-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#03045e] mb-2 tracking-tight font-display">
              Términos y Condiciones de Uso <br></br> "CONSULTA MÉDICA ECUADOR"
            </h1>
            <div className="h-1 w-20 bg-[#045e03] mx-auto rounded-full mb-4"></div>
            <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
              Un producto de OMEDSO S.A.S. — Última actualización: 02/03/2026
            </p>
          </div>

          {/* CONTENIDO */}
          <div className="space-y-10 text-justify leading-relaxed text-sm md:text-base">

            {/* SECCIÓN 1 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">1. Objeto y Ámbito de Aplicación</h2>
              <p className="mb-4">
                Los presentes Términos y Condiciones regulan el acceso y uso del directorio médico, buscador inteligente y plataforma de agendamiento denominada Consulta Médica Ecuador (en adelante, y para efectos de este contrato, "CONSULTA MÉDICA" o "LA PLATAFORMA").
              </p>
              <p>
                EL USUARIO reconoce y acepta que LA PLATAFORMA es un producto tecnológico desarrollado, operado y administrado por OMEDSO S.A.S. (en adelante "OMEDSO"), cuya finalidad principal es servir de punto de encuentro digital e intermediación entre profesionales de la salud independientes (en adelante "EL ESPECIALISTA") y pacientes (en adelante "EL USUARIO").
              </p>
            </div>

            {/* SECCIÓN 2 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">2. Identificación del Proveedor</h2>
              <ul className="list-none space-y-1 pl-4 border-l-2 border-[#045e03]/20">
                <li><strong>Titular:</strong> OMEDSO S.A.S.</li>
                <li><strong>RUC:</strong> 1391936412001</li>
                <li><strong>Domicilio:</strong> Calle Rocafuerte y Colón, Jipijapa (130101), Ecuador.</li>
                <li><strong>Correo de contacto:</strong> omedso@aevumcast.com | +1 (917) 730-3627</li>
              </ul>
            </div>

            {/* SECCIÓN 3 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">3. Naturaleza del Servicio (Cláusula de Intermediación)</h2>
              <p className="mb-4">
                EL USUARIO comprende y acepta expresamente que, a través de CONSULTA MÉDICA, OMEDSO actúa exclusivamente como un intermediario tecnológico (Directorio y Agenda).
              </p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Independencia:</strong> Los Especialistas listados en LA PLATAFORMA son profesionales independientes, registrados mediante OMEDSO PRO, y NO tienen relación de dependencia laboral, societaria ni de subordinación con OMEDSO.</li>
                <li><strong>Responsabilidad Médica:</strong> OMEDSO NO presta servicios médicos a través de este directorio, ni interviene en el diagnóstico, tratamiento, prescripción o criterio clínico que EL ESPECIALISTA brinde a EL USUARIO.</li>
                <li><strong>Exención de Responsabilidad:</strong> OMEDSO no será responsable civil, penal ni administrativamente por casos de mala praxis, negligencia, diagnósticos erróneos, cancelaciones de citas unilaterales por parte del médico o disputas derivadas de la relación directa entre EL USUARIO y EL ESPECIALISTA.</li>
              </ul>
            </div>

            {/* SECCIÓN 4 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">4. Condiciones de Acceso, Uso y Ecosistema OMEDSO</h2>
              <p className="p-4 bg-[#03045e]/5 border-l-4 border-[#03045e] rounded-r-lg italic text-gray-700 mb-4">
                <strong>Cuenta Única (SSO):</strong> El acceso a LA PLATAFORMA está integrado al ecosistema de OMEDSO. EL USUARIO utilizará las mismas credenciales (cuenta) creadas en OMEDSO AI para acceder a CONSULTA MÉDICA. Al hacerlo, ratifica su aceptación de las Políticas de Privacidad generales de OMEDSO.
              </p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Uso Adecuado:</strong> El acceso es gratuito para los Pacientes. EL USUARIO se compromete a utilizar el buscador inteligente y el sistema de agendamiento de buena fe, proporcionando datos de contacto reales y veraces.</li>
                <li><strong>Bloqueo de Cuenta:</strong> OMEDSO se reserva el derecho de suspender o bloquear a nivel global (en todo el ecosistema) la cuenta de Usuarios que realicen agendamientos masivos falsos (spam) o que sistemáticamente reserven citas a las que no asisten ("No Show").</li>
              </ul>
            </div>

            {/* SECCIÓN 5 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">5. Reglas de Agendamiento y Pagos</h2>
              <p className="mb-4">Al reservar una cita a través de LA PLATAFORMA:</p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Compromiso:</strong> EL USUARIO adquiere el compromiso de asistir a la consulta en la fecha y hora seleccionada.</li>
                <li>
                  <strong>Pagos:</strong> Dependiendo de la configuración del perfil de cada ESPECIALISTA, el pago de la consulta podrá realizarse:
                  <ul className="list-[circle] pl-5 mt-2 space-y-2 text-gray-600">
                    <li>Directamente en el consultorio físico o virtual de EL ESPECIALISTA (Pago en sitio).</li>
                    <li>A través de la pasarela de pagos de LA PLATAFORMA (Pago anticipado). En este último caso, OMEDSO actúa únicamente como agente recaudador tecnológico por cuenta y orden de EL ESPECIALISTA.</li>
                  </ul>
                </li>
                <li><strong>Tarifas:</strong> Los precios de las consultas son fijados libremente por cada ESPECIALISTA independiente. OMEDSO no controla, regula ni sugiere los honorarios médicos de terceros.</li>
              </ul>
            </div>

            {/* SECCIÓN 6 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">6. Cancelaciones y Ausentismo (Médicos Externos)</h2>
              <p className="mb-4">Las políticas de cancelación dependen de cada consultorio particular. Sin embargo, como regla general de LA PLATAFORMA:</p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Cancelación por EL USUARIO:</strong> EL USUARIO debe cancelar o reprogramar su cita con la antelación que indique el perfil de EL ESPECIALISTA (generalmente 24 a 48 horas).</li>
                <li><strong>Cancelación por el Médico:</strong> Si EL ESPECIALISTA cancela la cita por motivos de fuerza mayor, es responsabilidad exclusiva de dicho profesional o de su equipo contactar a EL USUARIO para reagendar o gestionar la devolución del dinero (si hubo pago anticipado). OMEDSO no realiza reembolsos directos por servicios médicos no prestados por terceros.</li>
              </ul>
            </div>

            {/* SECCIÓN 7 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">7. Sistema de Reseñas y Calificaciones</h2>
              <p className="mb-4">LA PLATAFORMA permite a los Usuarios calificar y dejar reseñas sobre la atención recibida.</p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Veracidad:</strong> OMEDSO no verifica la veracidad técnica de cada opinión, asumiendo la buena fe de la comunidad.</li>
                <li><strong>Moderación:</strong> OMEDSO se reserva el derecho de eliminar, sin previo aviso, comentarios que contengan lenguaje ofensivo, difamatorio, discriminatorio, spam o datos personales sensibles. No se eliminarán críticas negativas si estas se basan en una experiencia de servicio real, respetuosa y comprobable.</li>
              </ul>
            </div>

            {/* SECCIÓN 8 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">8. Propiedad Intelectual y Anti-Scraping</h2>
              <p>
                La marca CONSULTA MÉDICA, el software, el código fuente, la arquitectura SEO (Search Engine Optimization), la optimización para motores de Inteligencia Artificial (AIO), el diseño del directorio y las bases de datos son propiedad exclusiva de OMEDSO S.A.S. Queda estrictamente prohibido el "scraping" (extracción automatizada o masiva de datos) de los perfiles de los médicos para alimentar bases de datos, IA de terceros o directorios externos sin autorización escrita.
              </p>
            </div>

            {/* SECCIÓN 9 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">9. Tratamiento de Datos Personales (Transferencia Consentida)</h2>
              <p className="mb-4">
                El tratamiento de datos se rige por la Política de Privacidad del ecosistema OMEDSO.
              </p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Consentimiento de Transferencia:</strong> EL USUARIO acepta expresamente que, al hacer clic en "Agendar Cita", OMEDSO transferirá sus datos de contacto (Nombre, Teléfono, Email, y Motivo de Consulta) a EL ESPECIALISTA seleccionado con el único y exclusivo fin de que este pueda gestionar la atención médica solicitada y habilitar su Historia Clínica.</li>
              </ul>
            </div>

            {/* SECCIÓN 10 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">10. Enlaces y Verificación de Profesionales</h2>
              <p>
                OMEDSO realiza esfuerzos razonables para verificar la existencia del título profesional de EL ESPECIALISTA al momento de su registro inicial en el ecosistema (vía SENESCYT / ACESS u organismos competentes). Sin embargo, OMEDSO no controla ni garantiza la disponibilidad continua de sus servicios, la vigencia de sus permisos de funcionamiento, ni la actualización de sus consultorios físicos.
              </p>
            </div>

            {/* SECCIÓN 11 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">11. Modificaciones</h2>
              <p>
                OMEDSO podrá modificar estos términos en cualquier momento para adaptarlos a nuevas funcionalidades tecnológicas o legales. Las modificaciones entrarán en vigor desde su publicación en la web.
              </p>
            </div>

            {/* SECCIÓN 12 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">12. Jurisdicción y Ley Aplicable</h2>
              <p>
                Los presentes Términos y Condiciones se rigen por las leyes de la República del Ecuador. Para cualquier controversia derivada del uso de LA PLATAFORMA tecnológica intermediaria (y no de la atención médica propiamente dicha), las partes renuncian a su fuero y se someten a la jurisdicción de los jueces competentes de la ciudad de Jipijapa, Ecuador, o al Centro de Mediación que OMEDSO designe.
              </p>
            </div>

            <div className="text-[10px] text-gray-400 pt-8 border-t border-gray-100 text-center uppercase tracking-widest font-bold">
              © 2026 Omedso. Todos los derechos reservados.
            </div>

            {/* BOTÓN VOLVER */}
            <div className="mt-12 text-center">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#03045e] hover:text-[#045e03] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </button>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default TerminosConsultaMedica;