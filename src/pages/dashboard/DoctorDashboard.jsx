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
    if (!form.education.trim()) {
      setMessage('La información de educación es requerida.');
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
      await api.patch(`/doctors/${doctor.id}`, {
        biography: form.biography,
        experience_years: parseInt(form.experience_years),
        education: form.education,
        consultation_fee: parseFloat(form.consultation_fee),
        availability: form.availability,
        profile_completed: true
      });
      success = true;
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Error al enviar el perfil. Inténtalo de nuevo.');
    }
    // Actualizar estado en localStorage a 'en_revision'
    if (doctor?.full_name) {
      const [first, ...lastArr] = doctor.full_name.split(' ');
      const last = lastArr.join('_');
      const key = `doctor_${first.trim().toLowerCase()}_${last.trim().toLowerCase()}`;
      const localDoctor = localStorage.getItem(key);
      if (localDoctor) {
        const docObj = JSON.parse(localDoctor);
        docObj.status = 'en_revision';
        docObj.biography = form.biography;
        docObj.experience_years = form.experience_years;
        docObj.education = form.education;
        docObj.consultation_fee = form.consultation_fee;
        docObj.availability = form.availability;
        docObj.updated_at = new Date().toISOString();
        localStorage.setItem(key, JSON.stringify(docObj));
      }
    }
    if (success) {
      setMessage('Perfil completado y enviado para aprobación. El administrador revisará tu información.');
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

            {/* Educación */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Educación y títulos *
              </label>
              <textarea
                value={form.education}
                onChange={e => updateForm('education', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lista tus títulos académicos, universidades y años de graduación..."
                required
              />
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

  return (
    <div className="space-y-6">
      {/* Status Banner */}
      {doctor && doctor.status === 'pending' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Tu perfil está siendo revisado por el administrador. Una vez aprobado, podrás recibir citas de pacientes.
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

      {/* Acciones Rápidas */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => navigate('/dashboard/citas')}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            Ver Todas las Citas
          </button>
          <button
            onClick={() => navigate('/dashboard/perfil')}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            Editar Perfil
          </button>
          <button
            onClick={() => navigate('/dashboard/horarios')}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <ClockIcon className="w-4 h-4" />
            Gestionar Horarios
          </button>
        </div>
      </div>

      {/* Información del Perfil */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Información del Perfil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Usuario</p>
            <p className="font-medium">{doctor.username}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Especialidad</p>
            <p className="font-medium">{doctor.specialty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Ubicación</p>
            <p className="font-medium">{doctor.city}, {doctor.province}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Teléfono</p>
            <p className="font-medium">{doctor.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Estado</p>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              doctor.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {doctor.status === 'active' ? 'Aprobado' : 'Pendiente'}
            </span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => navigate('/dashboard/estadisticas')}
            className="btn-outline"
          >
            Ver Estadísticas
          </button>
          <button
            onClick={() => {/* lógica para actualizar datos */}}
            className="btn-primary"
          >
            Actualizar datos
          </button>
          <button
            onClick={() => {/* lógica para enviar a revisión */}}
            className="btn-success"
          >
            Enviar
          </button>
        </div>
        {doctor.status === 'pending' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800">Tu perfil está siendo revisado por el administrador. Pronto recibirás una respuesta.</p>
          </div>
        )}
      </div>
    </div>
  )
}

