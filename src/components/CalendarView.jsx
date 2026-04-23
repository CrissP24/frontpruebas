import { useState } from 'react'

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const DAYS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb']

const statusConfig = {
  pending:   { label: 'Pendiente',  pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',   dot: 'bg-amber-400',   bar: 'bg-amber-400' },
  confirmed: { label: 'Confirmada', pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-400', bar: 'bg-emerald-400' },
  cancelled: { label: 'Cancelada',  pill: 'bg-red-50 text-red-500 ring-1 ring-red-200',         dot: 'bg-red-400',     bar: 'bg-red-300' },
}

function getDateTime(apt) {
  return new Date(apt.dateTime || apt.date_time || apt.date)
}

function isSameDay(a, b) {
  return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
}

export default function CalendarView({ appointments = [], onSelectAppointment, onConfirm, onCancel, onReschedule }) {
  const [cursor, setCursor] = useState(new Date())
  const [selected, setSelected] = useState(null)
  const [draggingId, setDraggingId] = useState(null)
  const [dragOverDay, setDragOverDay] = useState(null)

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const today = new Date()

  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const aptsForDay = (date) => {
    if (!date) return []
    return appointments.filter(a => isSameDay(getDateTime(a), date))
  }

  const selectedApts = selected ? aptsForDay(selected) : []

  const upcomingApts = appointments
    .filter(a => {
      const dt = getDateTime(a)
      return dt >= today && a.status !== 'cancelled'
    })
    .sort((a, b) => getDateTime(a) - getDateTime(b))
    .slice(0, 8)

  const displayApts = selected ? selectedApts : upcomingApts
  const displayTitle = selected
    ? selectedApts.length > 0
      ? `${selectedApts.length} cita${selectedApts.length > 1 ? 's' : ''}`
      : 'Sin citas'
    : 'Próximas citas'
  const displaySubtitle = selected
    ? selected.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })
    : null

  const prevMonth = () => { setCursor(new Date(year, month - 1, 1)); setSelected(null) }
  const nextMonth = () => { setCursor(new Date(year, month + 1, 1)); setSelected(null) }
  const prevYear  = () => { setCursor(new Date(year - 1, month, 1)); setSelected(null) }
  const nextYear  = () => { setCursor(new Date(year + 1, month, 1)); setSelected(null) }
  const goToday   = () => { setCursor(new Date()); setSelected(null) }

  /* ── Drag handlers ── */
  const handleDragStart = (e, aptId) => {
    setDraggingId(aptId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(aptId))
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setDragOverDay(null)
  }

  const handleDayDragOver = (e, day) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverDay(day.toDateString())
  }

  const handleDayDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDay(null)
    }
  }

  const handleDayDrop = (e, day) => {
    e.preventDefault()
    const aptId = Number(e.dataTransfer.getData('text/plain')) || draggingId
    if (aptId && onReschedule) {
      onReschedule(aptId, day)
      setSelected(day)
    }
    setDraggingId(null)
    setDragOverDay(null)
  }

  const isDragging = draggingId !== null

  return (
    <div>
      {/* ── Cabecera del calendario ── */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
        <div>
          <h2 className="text-[17px] font-bold text-slate-900">{MONTHS[month]} {year}</h2>
          {selected && (
            <p className="text-[13px] text-[#140172] font-semibold mt-0.5 capitalize">
              {selected.toLocaleDateString('es-EC', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevYear} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition" title="Año anterior">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 19l-7-7 7-7M11 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition" aria-label="Mes anterior">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={goToday} className="px-3 py-1 text-[12px] font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition">
            Hoy
          </button>
          <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 transition" aria-label="Mes siguiente">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button onClick={nextYear} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition" title="Año siguiente">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 5l7 7-7 7M13 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Headers de día ── */}
      <div className="grid grid-cols-7 px-4 pt-3 pb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1">{d}</div>
        ))}
      </div>

      {/* ── Grid de días (drop targets) ── */}
      <div className={`grid grid-cols-7 px-4 pb-5 gap-1 ${isDragging ? 'cursor-grabbing' : ''}`}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} />

          const apts = aptsForDay(day)
          const isToday    = isSameDay(day, today)
          const isSelected = selected && isSameDay(day, selected)
          const isDropTarget = isDragging && dragOverDay === day.toDateString()

          return (
            <button
              key={day.toDateString()}
              onClick={() => !isDragging && setSelected(isSelected ? null : day)}
              onDragOver={(e) => handleDayDragOver(e, day)}
              onDragLeave={handleDayDragLeave}
              onDrop={(e) => handleDayDrop(e, day)}
              className={`relative flex flex-col items-center rounded-xl pt-2 pb-2 px-0.5 min-h-[52px] transition-all select-none ${
                isDropTarget
                  ? 'bg-[#140172]/15 ring-2 ring-[#140172] scale-105 shadow-md shadow-[#140172]/20'
                  : isSelected
                    ? 'bg-[#140172] shadow-lg shadow-[#140172]/20'
                    : isToday
                      ? 'bg-[#140172]/8 ring-2 ring-[#140172]/25'
                      : isDragging
                        ? 'hover:bg-[#140172]/10 hover:ring-2 hover:ring-[#140172]/30'
                        : 'hover:bg-slate-50'
              }`}
            >
              <span className={`text-[13px] font-bold leading-none mb-2 pointer-events-none ${
                isDropTarget ? 'text-[#140172]' : isSelected ? 'text-white' : isToday ? 'text-[#140172]' : 'text-slate-700'
              }`}>
                {day.getDate()}
              </span>

              {/* Dots de citas */}
              {apts.length > 0 && (
                <div className="flex gap-0.5 flex-wrap justify-center max-w-[30px] pointer-events-none">
                  {apts.slice(0, 3).map((apt, idx) => {
                    const cfg = statusConfig[apt.status] || statusConfig.pending
                    return (
                      <span
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isSelected ? 'bg-white/60' : cfg.dot}`}
                      />
                    )
                  })}
                  {apts.length > 3 && (
                    <span className={`text-[8px] font-bold leading-none ${isSelected ? 'text-white/60' : 'text-slate-400'}`}>
                      +{apts.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Icono drop cuando se arrastra encima */}
              {isDropTarget && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-6 h-6 rounded-full bg-[#140172] flex items-center justify-center shadow">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Lista de citas ── */}
      <div className="border-t border-slate-100">
        <div className="px-6 py-5">
          <div className="flex items-baseline gap-2 mb-4">
            <h3 className="text-[13px] font-bold text-slate-900">{displayTitle}</h3>
            {displaySubtitle && (
              <span className="text-[12px] text-slate-400 capitalize">{displaySubtitle}</span>
            )}
            {selected && (
              <button
                onClick={() => setSelected(null)}
                className="ml-auto text-[11px] text-slate-400 hover:text-slate-600 transition underline"
              >
                Ver próximas
              </button>
            )}
          </div>

          {/* Hint drag */}
          {onReschedule && displayApts.length > 0 && (
            <p className="text-[11px] text-slate-400 mb-3 flex items-center gap-1.5">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3" />
              </svg>
              Arrastrá una cita al día que desees para reagendarla
            </p>
          )}

          {displayApts.length === 0 ? (
            <div className="py-8 text-center">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[13px] text-slate-500">
                {selected ? 'Sin citas programadas para este día' : 'No tienes citas próximas'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {displayApts.map(apt => {
                const dt = getDateTime(apt)
                const isFuture = dt > today
                const cfg = statusConfig[apt.status] || statusConfig.pending
                const isBeingDragged = draggingId === apt.id

                return (
                  <div
                    key={apt.id}
                    draggable={onReschedule ? true : false}
                    onDragStart={(e) => handleDragStart(e, apt.id)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all group ${
                      isBeingDragged
                        ? 'opacity-40 border-[#140172]/30 bg-[#f5f3ff] shadow-inner'
                        : 'bg-slate-50 border-slate-100 hover:border-slate-200 hover:shadow-sm'
                    } ${onReschedule ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  >
                    {/* Handle drag indicator */}
                    {onReschedule && (
                      <div className="flex-shrink-0 text-slate-300 group-hover:text-slate-400 transition cursor-grab">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
                          <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
                          <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
                        </svg>
                      </div>
                    )}

                    {/* Hora */}
                    <div className="text-center flex-shrink-0 w-12">
                      <p className="text-[14px] font-bold text-slate-900 leading-none tabular-nums">
                        {dt.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {dt.toLocaleDateString('es-EC', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>

                    {/* Barra de color */}
                    <div className={`w-0.5 h-9 rounded-full flex-shrink-0 ${cfg.bar}`} />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate leading-none mb-0.5">
                        {apt.doctor?.fullName || apt.doctor?.name || apt.patient_name || 'Cita'}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {apt.doctor?.specialty?.name || apt.doctor?.specialty || apt.reason || 'Consulta'}
                      </p>
                    </div>

                    {/* Estado + acciones */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`hidden sm:inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold ${cfg.pill}`}>
                        {cfg.label}
                      </span>

                      {onConfirm && apt.status === 'pending' && isFuture && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onConfirm(apt.id) }}
                          className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition border border-emerald-200"
                          title="Confirmar cita"
                        >
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Confirmar
                        </button>
                      )}

                      {onCancel && apt.status !== 'cancelled' && isFuture && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onCancel(apt.id) }}
                          className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition"
                          title="Cancelar cita"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={(e) => { e.stopPropagation(); onSelectAppointment?.(apt) }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-[#140172] hover:bg-[#140172]/8 transition"
                        title="Ver detalles"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
