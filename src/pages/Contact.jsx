import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    phoneCode: '+593',
    who: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    // Formatear mensaje para WhatsApp
    const whatsappMessage = `*Nueva consulta desde mysimo*\n\n` +
      `*Nombre:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*Teléfono:* ${formData.phoneCode} ${formData.phone}\n` +
      `*Quién es:* ${formData.who}\n\n` +
      `*Mensaje:*\n${formData.message}`

    // Codificar para URL de WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage)
    const whatsappNumber = '593992646005' // +593 99 264 6005 sin espacios ni signos
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Abrir WhatsApp
    window.open(whatsappUrl, '_blank')
    
    setSuccess(true)
    setLoading(false)
    
    // Reset form after 2 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        phoneCode: '+593',
        who: '',
        message: ''
      })
      setSuccess(false)
    }, 3000)
  }

  return (
    <section className="py-16 md:py-20 bg-[var(--bg)]">
      <div className="container space-y-10">
        {/* Título página */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text)]">
            ¿Necesitas ayuda?
          </h1>
          <p className="text-[var(--text-light)] text-sm md:text-base">
           Pacientes y profesionales pueden contactarnos desde aquí.</p>
        </div>

        {/* Grid principal */}
        <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr] items-start">
          {/* IZQUIERDA: tarjetas que llevan a Omedso */}
          <div className="space-y-6">
            {/* Teleconsultas por suscripción */}
            <div className="rounded-3xl bg-gradient-to-br from-[#140172]/20 to-white text-[var(--text)] p-8 md:p-10 shadow-xl border border-slate-200/70 space-y-7">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">
                  Teleconsultas por suscripción
                </h2>
                <p className="mt-2 text-sm text-[var(--text-light)] max-w-sm">
                  Si eres un paciente visita{' '}
                  <span className="font-semibold text-[var(--primary)]">Omedso.com</span>, y recibe consultas ilimitadas en línea de medicina general,
                  nutrición y psicología.
                </p>
              </div>

              {/* CTA a Omedso */}
              <div className="pt-2">
                <a
                  href="https://omedso.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#031b4e] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#005E00]"
                >
                  Suscríbete ahora
                </a>
                <p className="mt-2 text-[11px] text-[var(--text-light)] leading-tight">
                  * Te redirigiremos a omedso.com, donde podrás contratar tu plan anual y recibir tus
                  consultas ilimitadas en línea mientras dure tu suscripción.
                </p>
              </div>
            </div>

            {/* Historia clínica digital */}
            <div className="rounded-3xl bg-gradient-to-br from-[#e6fbf5] to-white text-[var(--text)] p-8 md:p-10 shadow-xl border border-emerald-100/70 space-y-7">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold">
                  Historia clínica digital
                </h2>
              <p className="mt-2 text-sm text-[var(--text-light)] max-w-sm">
                Si eres un profesional de la salud visita{' '}
                <span className="font-semibold text-[var(--primary)]">Omedso.com</span>, y recibe una demo para gestionar
                tus pacientes en un solo lugar: expediente clínico, agenda, facturación, recetas y más.
              </p>

              </div>
              {/* CTA HCE Omedso */}
              <div className="pt-2">
                <a
                  href="https://omedso.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full bg-[#031b4e] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#005E00]"
                >
                  Agenda una demo
                </a>
                <p className="mt-2 text-[11px] text-[var(--text-light)] leading-tight">
                  * Te redirigiremos a omedso.com, donde podrás conocer más sobre la historia clínica
                  digital y cómo esta puede impulsar tu práctica.
                </p>
              </div>
            </div>
          </div>

          {/* DERECHA: formulario para profesionales / clínicas */}
          {/* DERECHA: formulario unificado de contacto */}
          <div className="rounded-3xl bg-white shadow-xl p-6 md:p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[var(--text)]">
                Envíanos tu consulta
              </h2>
              <p className="mt-2 text-sm text-[var(--text-light)]">
                Aquí podemos ayudarte tanto si eres paciente, profesional de la salud o empresa
                interesada en telemedicina, historias clínicas digitales o cualquier duda de
                soporte en el uso de nuestra plataforma.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Nombre completo"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
              />

              <input
                type="email"
                placeholder="Email de contacto"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
              />

              {/* Teléfono con país + ejemplo */}
              <div className="grid gap-3 md:grid-cols-[0.45fr,1.55fr]">
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                  value={formData.phoneCode}
                  onChange={e => setFormData({...formData, phoneCode: e.target.value})}
                >
                  <option value="+593">EC +593</option>
                  <option value="+57">CO +57</option>
                  <option value="+51">PE +51</option>
                  <option value="+54">AR +54</option>
                </select>
                <input
                  type="tel"
                  placeholder="Ej.: 99 123 4567"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[var(--text)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                />
              </div>

              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
                value={formData.who}
                onChange={e => setFormData({...formData, who: e.target.value})}
                required
              >
                <option value="" disabled>
                  ¿Quién eres?
                </option>
                <option value="paciente">Paciente</option>
                <option value="profesional">Profesional de la salud</option>
                <option value="empresa">Empresa interesada en telemedicina / HCE</option>
                <option value="otro">Otro</option>
              </select>

              <textarea
                rows={4}
                placeholder="Cuéntanos en qué podemos ayudarte: teleconsultas, historia clínica digital, implementación para tu empresa o soporte."
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.6 text-sm text-[var(--text)] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)]"
              />

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                  ✓ Mensaje preparado. Se abrirá WhatsApp en una nueva ventana.
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full justify-center rounded-full bg-[#005CEE] px-7 py-2 text-sm font-semibold text-white shadow-md hover:bg-[#0046c0] transition disabled:opacity-50"
                >
                  {loading ? 'Preparando...' : 'Enviar mensaje a WhatsApp'}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </section>
  )
}





