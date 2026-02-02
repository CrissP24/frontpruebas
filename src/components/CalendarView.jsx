import { useState } from 'react'

export default function CalendarView({ appointments, onSelectDate, onSelectAppointment }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getAppointmentsForDate = (date) => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date || apt.dateTime || apt.date_time)
      return aptDate.getDate() === date.getDate() &&
        aptDate.getMonth() === date.getMonth() &&
        aptDate.getFullYear() === date.getFullYear()
    })
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
  }

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={previousMonth}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ← Anterior
          </button>
          <button
            onClick={nextMonth}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Siguiente →
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="aspect-square"></div>
          }

          const dayAppointments = getAppointmentsForDate(day)
          const isToday = new Date().toDateString() === day.toDateString()

          return (
            <div
              key={day.toDateString()}
              className={`aspect-square border rounded-lg p-2 cursor-pointer hover:shadow-md transition ${
                isToday ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200'
              } overflow-hidden`}
              onClick={() => onSelectDate?.(day)}
            >
              <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {day.getDate()}
              </div>
              <div className="space-y-0.5 text-xs">
                {dayAppointments.slice(0, 2).map((apt, i) => (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectAppointment?.(apt)
                    }}
                    className={`px-1 py-0.5 rounded truncate cursor-pointer hover:opacity-80 ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      apt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {apt.patient_name || 'Cita'}
                  </div>
                ))}
                {dayAppointments.length > 2 && (
                  <div className="text-gray-500 text-xs">
                    +{dayAppointments.length - 2} más
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
