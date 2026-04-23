import { useNavigate } from 'react-router-dom';

const PoliticasConsultaMedica = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white text-gray-600 antialiased font-sans">
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-3xl mx-auto">
          
          {/* ENCABEZADO */}
          <div className="mb-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-[#03045e] mb-2 tracking-tight font-display">
              Política de Privacidad <br></br> "CONSULTA MÉDICA ECUADOR"
            </h1>
            <div className="h-1 w-20 bg-[#045e03] mx-auto rounded-full mb-4"></div>
            <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
              Un producto operado por OMEDSO S.A.S. — Última actualización: 02/03/2026
            </p>
          </div>

          {/* CONTENIDO */}
          <div className="space-y-10 text-justify leading-relaxed text-sm md:text-base">

            {/* SECCIÓN 1 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">1. Introducción y Ámbito</h2>
              <p className="mb-4">
                La presente Política de Privacidad regula el tratamiento de los datos personales de los usuarios (Pacientes y Profesionales de la Salud, en adelante "EL USUARIO") que utilizan el directorio digital y plataforma de agendamiento denominada Consulta Médica Ecuador (en adelante, "CONSULTA MÉDICA" o "LA PLATAFORMA").
              </p>
              <p>
                EL USUARIO reconoce y acepta que CONSULTA MÉDICA es un producto tecnológico desarrollado, operado y administrado legalmente por OMEDSO S.A.S. (en adelante "OMEDSO"). Por tanto, OMEDSO es el Responsable del Tratamiento de los datos recopilados en este portal para fines de intermediación, garantizando su protección conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador (LOPDP).
              </p>
            </div>

            {/* SECCIÓN 2 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">2. Identificación del Responsable</h2>
              <ul className="list-none space-y-1 pl-4 border-l-2 border-[#045e03]/20">
                <li><strong>Razón social:</strong> OMEDSO S.A.S.</li>
                <li><strong>RUC:</strong> 1391936412001</li>
                <li><strong>Domicilio:</strong> Calle Rocafuerte y Colón, Jipijapa (130101), Ecuador.</li>
                <li><strong>Correo de contacto:</strong> omedso@aevumcast.com | +1 (917) 730-3627</li>
                <li><strong>Delegado de Protección de Datos (DPO):</strong> Damian Pincay.</li>
              </ul>
            </div>

            {/* SECCIÓN 3 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">3. Datos Personales que se Recogen</h2>
              <p className="mb-4">Para cumplir con la función de conectar pacientes con especialistas, LA PLATAFORMA recopila y procesa las siguientes categorías de datos:</p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Datos de Cuenta Única (Ecosistema OMEDSO):</strong> Al acceder mediante el sistema de inicio de sesión único (SSO), CONSULTA MÉDICA utiliza los datos identificativos base de su cuenta de OMEDSO AI (Nombres, apellidos, cédula, correo electrónico y número de celular).</li>
                <li><strong>Datos de Búsqueda y Navegación:</strong> Especialidad requerida, ciudad, geolocalización, filtros aplicados y perfiles de especialistas visitados.</li>
                <li><strong>Datos de Salud (Nivel Básico para Agendamiento):</strong> Motivo de la consulta (ingresado voluntariamente por EL USUARIO al agendar) y especialidad requerida.</li>
                <li><strong>Datos del Especialista (Públicos):</strong> En el caso de los médicos registrados, se recopila y publica su información profesional, académica, fotografías, certificaciones y dirección de consultorio físico o virtual.</li>
                <li><strong>Datos Técnicos:</strong> Dirección IP, cookies y métricas de uso de la plataforma.</li>
              </ul>
            </div>

            {/* SECCIÓN 4 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">4. Finalidad del Tratamiento</h2>
              <p className="mb-4">Los datos personales serán tratados exclusivamente con las siguientes finalidades:</p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Gestión de Agendamiento:</strong> Procesar la reserva de citas médicas y conectar al Paciente con el Especialista seleccionado.</li>
                <li><strong>Notificaciones:</strong> Envío de confirmaciones de cita, recordatorios (vía WhatsApp/Email) y alertas sobre cambios de horario.</li>
                <li><strong>Publicación en Directorio:</strong> Mostrar el perfil público de los profesionales de la salud a los usuarios buscadores.</li>
                <li><strong>Calidad y Reseñas:</strong> Gestión del sistema de valoración donde los pacientes opinan sobre la atención recibida.</li>
                <li><strong>Estadística y Big Data:</strong> Uso de datos anonimizados y disociados sobre tendencias de búsqueda (ej: "¿Qué especialidades se buscan más en una ciudad?") para fines de mejora del algoritmo, investigación de mercado y salud pública.</li>
              </ul>
            </div>

            {/* SECCIÓN 5 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">5. Base Legal del Tratamiento</h2>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Ejecución de un contrato:</strong> Para procesar la solicitud de agendamiento de cita por parte de EL USUARIO.</li>
                <li><strong>Consentimiento Explícito:</strong> Para el tratamiento y transferencia de datos sensibles (motivo de consulta) al médico, y envío de comunicaciones.</li>
                <li><strong>Interés Legítimo:</strong> Para la prevención de fraude, analítica web y seguridad técnica de LA PLATAFORMA.</li>
              </ul>
            </div>

            {/* SECCIÓN 6 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">6. Destinatarios y Transferencia de Datos (Cláusula de Intermediación)</h2>
              <p className="mb-4">Como plataforma de intermediación, la transferencia de datos es esencial para el servicio:</p>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Transferencia al Especialista:</strong> Al confirmar una reserva, EL USUARIO autoriza expresamente a OMEDSO a transferir sus datos de contacto (Nombre, Teléfono, Email y Motivo de Consulta) al Médico Especialista o Centro de Salud seleccionado, con el único fin de concretar la atención.</li>
                <li><strong>Límite de Responsabilidad en la Custodia:</strong> Una vez transferidos los datos a través de LA PLATAFORMA, el Médico Especialista asume la calidad de Responsable del Tratamiento respecto a la custodia de dicha información en su propio expediente clínico legal.</li>
                <li><strong>Proveedores Tecnológicos:</strong> Servidores de alojamiento en la nube, servicios de mensajería (WhatsApp Business API) y pasarelas de pago certificadas.</li>
                <li><strong>Autoridades:</strong> Únicamente bajo requerimiento legal o judicial fundamentado.</li>
              </ul>
            </div>

            {/* SECCIÓN 7 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">7. Tiempo de Conservación</h2>
              <ul className="list-disc pl-5 space-y-3 marker:text-[#045e03]">
                <li><strong>Usuarios Pacientes:</strong> Los datos vinculados a la cuenta se mantienen mientras EL USUARIO no solicite su baja del ecosistema OMEDSO.</li>
                <li><strong>Registros de Agendamiento:</strong> Los logs de citas creadas se conservan por un periodo mínimo de 5 años para fines de auditoría técnica, soporte y resolución de disputas.</li>
                <li><strong>Especialistas:</strong> La información pública del perfil se mantiene mientras el profesional mantenga su cuenta activa en el ecosistema.</li>
              </ul>
            </div>

            {/* SECCIÓN 8 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">8. Derechos del Titular (Derechos ARCO)</h2>
              <p className="mb-4">
                EL USUARIO podrá ejercer sus derechos de Acceso, Rectificación, Cancelación, Oposición y Portabilidad enviando una solicitud a <strong>omedso@aevumcast.com</strong>.
              </p>
              <p>
                <strong>Derecho al Olvido y Limitación:</strong> EL USUARIO puede solicitar la eliminación de su cuenta. Sin embargo, EL USUARIO comprende que OMEDSO no tiene control ni acceso a los historiales clínicos definitivos que los médicos externos hayan creado y almacenado en sus propios sistemas a raíz de las citas agendadas a través de LA PLATAFORMA. Para borrar dichos historiales, EL USUARIO deberá contactar directamente al consultorio médico respectivo.
              </p>
            </div> 

            {/* SECCIÓN 9 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">9. Revocación del Consentimiento</h2>
              <p>
                EL USUARIO declara haber sido informado de que sus datos de contacto serán compartidos con los médicos que él mismo elija agendar. EL USUARIO puede revocar su consentimiento para recibir comunicaciones de marketing en cualquier momento escribiendo al correo oficial o utilizando los enlaces de cancelación en los correos recibidos.
              </p>
            </div>

            {/* SECCIÓN 10 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">10. Medidas de Seguridad</h2>
              <p>
                OMEDSO implementa protocolos de seguridad estándar de la industria (HTTPS/TLS), encriptación de bases de datos y controles de acceso restringido para proteger la información dentro de la infraestructura tecnológica de LA PLATAFORMA, previniendo su alteración, pérdida o acceso no autorizado.
              </p>
            </div>

            {/* SECCIÓN 11 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">11. Modificaciones a la Política</h2>
              <p>
                OMEDSO podrá actualizar esta política para reflejar cambios en el producto, integraciones con Inteligencia Artificial o normativas legales. Las actualizaciones sustanciales se notificarán de forma visible en el sitio web.
              </p>
            </div>

            {/* SECCIÓN 12 */}
            <div>
              <h2 className="text-[#03045e] font-bold text-lg mb-3 font-display">12. Vigencia</h2>
              <p>
                Esta política entra en vigor a partir de su fecha de publicación y rige la relación estricta de uso de datos dentro del directorio entre EL USUARIO y OMEDSO S.A.S.
              </p>
            </div>

            <div className="text-[10px] text-gray-400 pt-8 border-t border-gray-100 text-center uppercase tracking-widest font-bold">
              © 2026 Omedso S.A.S. Todos los derechos reservados.
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

export default PoliticasConsultaMedica;