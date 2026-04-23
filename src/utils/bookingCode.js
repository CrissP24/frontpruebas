// ─────────────────────────────────────────────
//  Booking Code — Omedso
//  Genera un código único por solicitud de cita
//  que el bot de WA puede interpretar.
//
//  TODO (dev): cuando el backend esté listo:
//  1. POST /booking-requests { code, doctorId, specialty, patientId }
//  2. El médico ingresa el código en su portal → PATCH /booking-requests/:code { status: 'confirmed' }
//  3. Backend envía email de confirmación al paciente (ver plantilla en /templates/booking-confirm.html)
// ─────────────────────────────────────────────

const OMEDSO_BOT = '19177303627'

/** Genera un código alfanumérico de 6 caracteres sin caracteres ambiguos (0, O, 1, I, L). */
export function generateBookingCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

/**
 * Construye el mensaje de WhatsApp que el paciente envía al bot.
 * El bot interpretará el código para identificar la solicitud.
 *
 * @param {{ specialty: string, code: string }} options
 */
export function buildBookingMessage({ specialty, code }) {
  const lines = [
    `Hola, quiero agendar una cita médica.`,
    ``,
    `🏥 Especialidad: ${specialty}`,
    `🔖 Código de solicitud: *${code}*`,
    ``,
    `_(El código identifica mi solicitud. Por favor confírmame disponibilidad.)_`,
  ]
  return lines.join('\n')
}

/**
 * Devuelve el link de WhatsApp ajustado al dispositivo:
 * - Mobile  → abre la app nativa
 * - Desktop → abre WhatsApp Web
 */
export function buildWhatsAppLink(message) {
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
  const base = isMobile ? 'whatsapp://send' : 'https://web.whatsapp.com/send'
  return `${base}?phone=${OMEDSO_BOT}&text=${encodeURIComponent(message)}`
}

/**
 * Helper completo: genera código, construye mensaje y abre WA.
 * Retorna el código generado por si el caller lo necesita guardar.
 */
export function openBookingWhatsApp({ specialty }) {
  const code = generateBookingCode()
  const message = buildBookingMessage({ specialty, code })
  window.open(buildWhatsAppLink(message), '_blank')
  return code
}
