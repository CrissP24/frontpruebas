import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/dashboard/StatCard'
import AppointmentCard from '../../components/dashboard/AppointmentCard'
import { CalendarIcon, ClockIcon, CheckCircleIcon, UserIcon, ChartBarIcon } from '../../components/dashboard/IconComponents'

function DoctorProfileCompletion({ doctor, onProfileSubmitted }) {
  const [form, setForm] = useState({
    biography: doctor.biography || '',
    experience_years: doctor.experience_years || '',
    education: doctor.education || '',
    titles: doctor.titles || [{ name: '', institution: '', year: '', image: '' }], // Array de títulos
    certifications: doctor.certifications || [],
    languages: doctor.languages || [],
    consultation_fee: doctor.consultation_fee || '',
    availability: doctor.availability || {
      monday: { enabled: false, start: '09:00', end: '17:00' },
      tuesday: { enabled: false, start: '09:00', end: '17:00' },
      wednesday: { enabled: false, start: '09:00', end: '17:00' },
      thursday: { enabled: false, start: '09:00', end: '17:00' },
      friday: { enabled: false, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '17:00' },
      sunday: { enabled: false, start: '09:00', end: '17:00' }
    }
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateAvailability = (day, field, value) => {
    setForm(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], [field]: value }
      }
    }))
  }

  // Funciones para manejar títulos
  const addTitle = () => {
    setForm(prev => ({
      ...prev,
      titles: [...prev.titles, { name: '', institution: '', year: '', image: '' }]
    }))
  }

  const removeTitle = (index) => {
    if (form.titles.length > 1) {
      setForm(prev => ({
        ...prev,
        titles: prev.titles.filter((_, i) => i !== index)
      }))
    }
  }

  const updateTitle = (index, field, value) => {
    setForm(prev => ({
      ...prev,
      titles: prev.titles.map((title, i) => 
        i === index ? { ...title, [field]: value } : title
      )
    }))
  }

  const handleTitleImageUpload = (index, e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Solo se permiten archivos de imagen')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setMessage('La imagen no debe superar 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        updateTitle(index, 'image', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validaciones
    if (!form.biography.trim()) {
      setMessage('La biografía es requerida.');
      setLoading(false);
      return;
    }
    if (!form.experience_years || form.experience_years < 0) {
      setMessage('Los años de experiencia son requeridos y deben ser un número positivo.');
      setLoading(false);
      return;
    }
    
    // Validar que al menos un título tenga nombre e imagen
    const validTitles = form.titles.filter(t => t.name.trim() && t.image)
    if (validTitles.length === 0) {
      setMessage('Debes agregar al menos un título con su imagen.');
      setLoading(false);
      return;
    }

    if (!form.consultation_fee || form.consultation_fee <= 0) {
      setMessage('La tarifa de consulta es requerida y debe ser mayor a 0.');
      setLoading(false);
      return;
    }

    // Check if at least one day is available
    const hasAvailability = Object.values(form.availability).some(day => day.enabled);
    if (!hasAvailability) {
      setMessage('Debes seleccionar al menos un día de disponibilidad.');
      setLoading(false);
      return;
    }

    let success = false;
    try {
      // Actualizar en localStorage
      const doctors = JSON.parse(localStorage.getItem('mysimo_doctors') || '[]')
      const doctorIndex = doctors.findIndex(d => d.id === doctor.id)
      
      if (doctorIndex !== -1) {
        // Generar texto de educación a partir de los títulos
        const educationText = form.titles
          .filter(t => t.name.trim())
          .map(t => `${t.name}${t.institution ? ' - ' + t.institution : ''}${t.year ? ' (' + t.year + ')' : ''}`)
          .join('\n')

        doctors[doctorIndex] = {
          ...doctors[doctorIndex],
          biography: form.biography,
          experience_years: parseInt(form.experience_years),
          education: educationText,
          titles: form.titles.filter(t => t.name.trim()), // Guardar títulos con imágenes
          consultation_fee: parseFloat(form.consultation_fee),
          availability: form.availability,
          profile_completed: true,
          status: 'pending', // Mantener en pending hasta que admin apruebe
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('mysimo_doctors', JSON.stringify(doctors))
        success = true
        setMessage('Perfil completado y enviado para aprobación. El administrador revisará tu información.')
      } else {
        setMessage('Error: No se encontró tu perfil de doctor.')
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error al guardar el perfil. Inténtalo de nuevo.');
    }
    
    if (success) {
      setTimeout(() => {
        onProfileSubmitted();
      }, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Perfil pendiente de aprobación
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>Completa tu perfil profesional para que el administrador pueda aprobar tu cuenta.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Completa tu perfil profesional
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Biografía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biografía profesional *
              </label>
              <textarea
                value={form.biography}
                onChange={e => updateForm('biography', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe tu experiencia profesional, especialidades y enfoque en el cuidado de pacientes..."
                required
              />
            </div>

            {/* Años de experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de experiencia *
              </label>
              <input
                type="number"
                value={form.experience_years}
                onChange={e => updateForm('experience_years', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 5"
                required
              />
            </div>

            {/* Educación - Títulos con imágenes */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Títulos académicos *
                </label>
                <button
                  type="button"
                  onClick={addTitle}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Agregar título
                </button>
              </div>
              
              <div className="space-y-4">
                {form.titles.map((title, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm font-medium text-gray-700">Título #{index + 1}</span>
                      {form.titles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTitle(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Nombre del título *</label>
                        <input
                          type="text"
                          value={title.name}
                          onChange={e => updateTitle(index, 'name', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Médico Cirujano"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Institución</label>
                        <input
                          type="text"
                          value={title.institution}
                          onChange={e => updateTitle(index, 'institution', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: Universidad Central"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Año de graduación</label>
                        <input
                          type="text"
                          value={title.year}
                          onChange={e => updateTitle(index, 'year', e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Ej: 2015"
                        />
                      </div>
                    </div>
                    
                    {/* Subir imagen del título */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Imagen del título *</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleTitleImageUpload(index, e)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                      />
                      {title.image && (
                        <div className="mt-2 relative">
                          <img 
                            src={title.image} 
                            alt={`Título ${index + 1}`} 
                            className="max-h-40 rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => updateTitle(index, 'image', '')}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <p className="text-xs text-gray-500 mt-1">Sube una imagen clara del título para verificación (JPG, PNG - máx 5MB)</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tarifa de consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tarifa de consulta (USD) *
              </label>
              <input
                type="number"
                value={form.consultation_fee}
                onChange={e => updateForm('consultation_fee', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 50"
                required
              />
            </div>

            {/* Disponibilidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Horarios de disponibilidad *
              </label>
              <div className="space-y-3">
                {Object.entries(form.availability).map(([day, schedule]) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-24">
                      <span className="text-sm capitalize">{day}</span>
                    </div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={e => updateAvailability(day, 'enabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Disponible</span>
                    </label>
                    {schedule.enabled && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="time"
                          value={schedule.start}
                          onChange={e => updateAvailability(day, 'start', e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">a</span>
                        <input
                          type="time"
                          value={schedule.end}
                          onChange={e => updateAvailability(day, 'end', e.target.value)}
                          className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar para aprobación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function DoctorDashboard() {
  const navigate = useNavigate()
  const { auth } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    today: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    let doctorData = null;
    try {
      // Intentar cargar desde backend
      const doctorRes = await api.get('/doctors/me');
      doctorData = doctorRes.data;
    } catch (error) {
      // Si falla, buscar en localStorage usando nombre+apellido
      if (auth?.user?.full_name) {
        const [first, ...lastArr] = auth.user.full_name.split(' ');
        const last = lastArr.join('_');
        const key = `doctor_${first.trim().toLowerCase()}_${last.trim().toLowerCase()}`;
        const localDoctor = localStorage.getItem(key);
        if (localDoctor) {
          doctorData = JSON.parse(localDoctor);
        }
      }
    }
    setDoctor(doctorData);
    // ...cargar citas y estadísticas como antes...
    try {
      const appointmentsRes = await api.get('/appointments/me');
      const data = Array.isArray(appointmentsRes.data) ? appointmentsRes.data : (appointmentsRes.data.data || []);
      setAppointments(data);
      // Calcular estadísticas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const statsData = {
        total: data.length,
        pending: data.filter(a => a.status === 'pending').length,
        confirmed: data.filter(a => a.status === 'confirmed').length,
        cancelled: data.filter(a => a.status === 'cancelled').length,
        today: data.filter(a => {
          const apptDate = new Date(a.dateTime || a.date_time);
          return apptDate >= today && apptDate < tomorrow && a.status !== 'cancelled';
        }).length,
      };
      setStats(statsData);
    } catch (error) {
      setAppointments([]);
    }
    setLoading(false);
  };

  const todayAppointments = appointments
    .filter(a => {
      const apptDate = new Date(a.dateTime || a.date_time)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      return apptDate >= today && apptDate < tomorrow && a.status !== 'cancelled'
    })
    .sort((a, b) => new Date(a.dateTime || a.date_time) - new Date(b.dateTime || b.date_time))

  const pendingAppointments = appointments
    .filter(a => a.status === 'pending')
    .sort((a, b) => new Date(a.dateTime || a.date_time) - new Date(b.dateTime || b.date_time))
    .slice(0, 5)

  const handleViewAppointment = (appointment) => {
    navigate(`/dashboard/citas/${appointment.id}`)
  }

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await api.patch(`/appointments/${appointmentId}/status`, { status: newStatus })
      loadAppointments()
    } catch (error) {
      console.error('Error actualizando estado:', error)
      alert('Error al actualizar el estado de la cita')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Cargando...</div>
      </div>
    )
  }

  // Si el doctor no ha completado su perfil, mostrar el formulario de completar perfil
  if (doctor && !doctor.profile_completed && doctor.status === 'pending') {
    return <DoctorProfileCompletion doctor={doctor} onProfileSubmitted={loadData} />
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner for New Doctors */}
      {doctor && doctor.status === 'pending' && doctor.profile_completed && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                ¡Bienvenido! Tu perfil está siendo revisado por el administrador. Una vez aprobado, podrás recibir citas de pacientes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Status Banner */}
      {doctor && doctor.status === 'pending' && !doctor.profile_completed && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Por favor completa tu perfil profesional para que el administrador pueda aprobar tu cuenta.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel Médico</h1>
        <p className="text-gray-600 mt-1">Gestiona tus citas y pacientes</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={CalendarIcon}
          title="Total Citas"
          value={stats.total}
          subtitle="Todas las citas"
          color="primary"
        />
        <StatCard
          icon={ClockIcon}
          title="Hoy"
          value={stats.today}
          subtitle="Citas de hoy"
          color="accent"
        />
        <StatCard
          icon={ClockIcon}
          title="Pendientes"
          value={stats.pending}
          subtitle="Esperando confirmación"
          color="warning"
        />
        <StatCard
          icon={CheckCircleIcon}
          title="Confirmadas"
          value={stats.confirmed}
          subtitle="Citas confirmadas"
          color="success"
        />
        <StatCard
          icon={UserIcon}
          title="Canceladas"
          value={stats.cancelled}
          subtitle="Citas canceladas"
          color="danger"
        />
      </div>

      {/* Citas de Hoy */}
      {todayAppointments.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Citas de Hoy</h2>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                showPatient={true}
                showDoctor={false}
                onAction={handleViewAppointment}
                actionLabel="Ver Detalles"
              />
            ))}
          </div>
        </div>
      )}

      {/* Citas Pendientes de Confirmar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Citas Pendientes de Confirmar</h2>
          {pendingAppointments.length > 0 && (
            <button
              onClick={() => navigate('/dashboard/citas')}
              className="text-sm text-[var(--primary)] hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>

        {pendingAppointments.length > 0 ? (
          <div className="space-y-3">
            {pendingAppointments.map((appointment) => (
              <div key={appointment.id} className="card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pendiente
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(appointment.dateTime || appointment.date_time).toLocaleDateString('es-ES', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-1">
                      {new Date(appointment.dateTime || appointment.date_time).toLocaleTimeString('es-ES', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {appointment.patient && (
                      <div className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Paciente: {appointment.patient.name || appointment.patient.email}</span>
                      </div>
                    )}
                    {appointment.notes && (
                      <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                    className="btn-primary btn-sm flex-1"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                    className="btn-outline btn-sm flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-6 text-center">
            <CheckCircleIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No hay citas pendientes de confirmar</p>
          </div>
        )}
      </div>

      {/* Mensaje de Perfil Pendiente */}
      {doctor.status === 'pending' && (
        <div className="card p-6">
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">Tu perfil está siendo revisado por el administrador. Pronto recibirás una respuesta.</p>
          </div>
        </div>
      )}
    </div>
  )
}

