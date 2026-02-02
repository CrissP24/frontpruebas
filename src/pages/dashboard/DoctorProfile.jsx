import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function DoctorProfile() {
  const { auth } = useAuth()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  
  // Formulario de información personal
  const [personalForm, setPersonalForm] = useState({
    username: '',
    full_name: '',
    email: '',
    phone: '',
    new_password: '',
    confirm_password: ''
  })

  // Formulario de información profesional
  const [professionalForm, setProfessionalForm] = useState({
    photoUrl: '',
    specialty: '',
    license_number: '', // Cédula profesional
    biography: '',
    experience_years: '',
    titles: [{ name: '', institution: '', year: '', image: '' }], // Array de títulos
    consultation_fee: '',
    availability: {
      monday: { enabled: false, start: '09:00', end: '17:00' },
      tuesday: { enabled: false, start: '09:00', end: '17:00' },
      wednesday: { enabled: false, start: '09:00', end: '17:00' },
      thursday: { enabled: false, start: '09:00', end: '17:00' },
      friday: { enabled: false, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '09:00', end: '17:00' },
      sunday: { enabled: false, start: '09:00', end: '17:00' }
    }
  })

  useEffect(() => {
    loadDoctorData()
  }, [])

  const loadDoctorData = () => {
    try {
      const doctors = JSON.parse(localStorage.getItem('mysimo_doctors') || '[]')
      const doctorData = doctors.find(d => d.id === auth.user.id || d.email === auth.user.email)
      
      if (doctorData) {
        setDoctor(doctorData)
        setPersonalForm({
          username: doctorData.username || '',
          full_name: doctorData.full_name || '',
          email: doctorData.email || '',
          phone: doctorData.phone || '',
          new_password: '',
          confirm_password: ''
        })
        setProfessionalForm({
          photoUrl: doctorData.photoUrl || '',
          specialty: doctorData.specialty || '',
          license_number: doctorData.license_number || '',
          biography: doctorData.biography || '',
          experience_years: doctorData.experience_years || '',
          titles: doctorData.titles || [{ name: '', institution: '', year: '', image: '' }],
          consultation_fee: doctorData.consultation_fee || '',
          availability: doctorData.availability || professionalForm.availability
        })
      }
    } catch (error) {
      console.error('Error loading doctor data:', error)
    }
  }

  // Funciones para manejar títulos
  const addTitle = () => {
    setProfessionalForm(prev => ({
      ...prev,
      titles: [...prev.titles, { name: '', institution: '', year: '', image: '' }]
    }))
  }

  const removeTitle = (index) => {
    if (professionalForm.titles.length > 1) {
      setProfessionalForm(prev => ({
        ...prev,
        titles: prev.titles.filter((_, i) => i !== index)
      }))
    }
  }

  const updateTitle = (index, field, value) => {
    setProfessionalForm(prev => ({
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

  const handlePersonalUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Validaciones
      if (personalForm.new_password && personalForm.new_password !== personalForm.confirm_password) {
        setMessage('Las contraseñas no coinciden')
        setLoading(false)
        return
      }

      // Actualizar en localStorage
      const doctors = JSON.parse(localStorage.getItem('mysimo_doctors') || '[]')
      const doctorIndex = doctors.findIndex(d => d.id === auth.user.id)
      
      if (doctorIndex !== -1) {
        doctors[doctorIndex] = {
          ...doctors[doctorIndex],
          username: personalForm.username,
          full_name: personalForm.full_name,
          email: personalForm.email,
          phone: personalForm.phone,
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('mysimo_doctors', JSON.stringify(doctors))

        // Actualizar usuario
        const users = JSON.parse(localStorage.getItem('mysimo_users') || '[]')
        const userIndex = users.findIndex(u => u.id === auth.user.id)
        if (userIndex !== -1) {
          users[userIndex] = {
            ...users[userIndex],
            username: personalForm.username,
            name: personalForm.full_name,
            email: personalForm.email
          }
          if (personalForm.new_password) {
            users[userIndex].password = personalForm.new_password
          }
          localStorage.setItem('mysimo_users', JSON.stringify(users))
        }

        setMessage('Información personal actualizada correctamente')
        setPersonalForm({ ...personalForm, new_password: '', confirm_password: '' })
        loadDoctorData()
      }
    } catch (error) {
      console.error('Error updating personal info:', error)
      setMessage('Error al actualizar la información personal')
    } finally {
      setLoading(false)
    }
  }

  const handleProfessionalUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Validaciones
      if (!professionalForm.specialty.trim()) {
        setMessage('La especialidad es requerida')
        setLoading(false)
        return
      }
      if (!professionalForm.license_number.trim()) {
        setMessage('La cédula profesional es requerida')
        setLoading(false)
        return
      }
      if (!professionalForm.biography.trim()) {
        setMessage('La biografía es requerida')
        setLoading(false)
        return
      }
      
      // Validar que al menos un título tenga nombre e imagen
      const validTitles = professionalForm.titles.filter(t => t.name.trim() && t.image)
      if (validTitles.length === 0) {
        setMessage('Debe agregar al menos un título con su imagen')
        setLoading(false)
        return
      }

      // Actualizar en localStorage
      const doctors = JSON.parse(localStorage.getItem('mysimo_doctors') || '[]')
      const doctorIndex = doctors.findIndex(d => d.id === auth.user.id)
      
      if (doctorIndex !== -1) {
        // Generar texto de educación a partir de los títulos
        const educationText = professionalForm.titles
          .filter(t => t.name.trim())
          .map(t => `${t.name}${t.institution ? ' - ' + t.institution : ''}${t.year ? ' (' + t.year + ')' : ''}`)
          .join('\n')

        doctors[doctorIndex] = {
          ...doctors[doctorIndex],
          photoUrl: professionalForm.photoUrl,
          specialty: professionalForm.specialty,
          license_number: professionalForm.license_number,
          biography: professionalForm.biography,
          experience_years: parseInt(professionalForm.experience_years) || 0,
          education: educationText,
          titles: professionalForm.titles.filter(t => t.name.trim()),
          consultation_fee: parseFloat(professionalForm.consultation_fee) || 0,
          availability: professionalForm.availability,
          profile_completed: true,
          status: 'pending', // Cambia a pending para que admin verifique documentos
          updated_at: new Date().toISOString()
        }
        localStorage.setItem('mysimo_doctors', JSON.stringify(doctors))

        setMessage('Información profesional actualizada. Pendiente de aprobación del administrador.')
        loadDoctorData()
      }
    } catch (error) {
      console.error('Error updating professional info:', error)
      setMessage('Error al actualizar la información profesional')
    } finally {
      setLoading(false)
    }
  }

  const updateAvailability = (day, field, value) => {
    setProfessionalForm(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: { ...prev.availability[day], [field]: value }
      }
    }))
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Actualiza tu información personal y profesional</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* SECCIÓN 1: INFORMACIÓN PERSONAL */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Información Personal</h2>
        </div>
        <form onSubmit={handlePersonalUpdate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de usuario *
              </label>
              <input
                type="text"
                value={personalForm.username}
                onChange={e => setPersonalForm({ ...personalForm, username: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                value={personalForm.full_name}
                onChange={e => setPersonalForm({ ...personalForm, full_name: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={personalForm.email}
                onChange={e => setPersonalForm({ ...personalForm, email: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="tel"
                value={personalForm.phone}
                onChange={e => setPersonalForm({ ...personalForm, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="+593 99 123 4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nueva contraseña (opcional)
              </label>
              <input
                type="password"
                value={personalForm.new_password}
                onChange={e => setPersonalForm({ ...personalForm, new_password: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar contraseña
              </label>
              <input
                type="password"
                value={personalForm.confirm_password}
                onChange={e => setPersonalForm({ ...personalForm, confirm_password: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Confirma tu contraseña"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Actualizar información personal'}
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: INFORMACIÓN PROFESIONAL */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Información Profesional</h2>
          <p className="text-sm text-gray-600 mt-1">Esta información será revisada por el administrador</p>
        </div>
        <form onSubmit={handleProfessionalUpdate} className="p-6 space-y-4">
          {/* Foto de perfil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de perfil
            </label>
            <div className="flex items-center gap-4">
              {professionalForm.photoUrl && (
                <img 
                  src={professionalForm.photoUrl} 
                  alt="Foto de perfil" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <input
                type="url"
                value={professionalForm.photoUrl}
                onChange={e => setProfessionalForm({ ...professionalForm, photoUrl: e.target.value })}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                placeholder="URL de la foto"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Especialidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidad médica *
              </label>
              <select
                value={professionalForm.specialty}
                onChange={e => setProfessionalForm({ ...professionalForm, specialty: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              >
                <option value="">Seleccione especialidad</option>
                <option value="Medicina General">Medicina General</option>
                <option value="Cardiología">Cardiología</option>
                <option value="Dermatología">Dermatología</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Ginecología">Ginecología</option>
                <option value="Traumatología">Traumatología</option>
                <option value="Oftalmología">Oftalmología</option>
                <option value="Odontología">Odontología</option>
                <option value="Psiquiatría">Psiquiatría</option>
                <option value="Neurología">Neurología</option>
                <option value="Gastroenterología">Gastroenterología</option>
                <option value="Endocrinología">Endocrinología</option>
                <option value="Otorrinolaringología">Otorrinolaringología</option>
                <option value="Urología">Urología</option>
                <option value="Neumología">Neumología</option>
              </select>
            </div>

            {/* Cédula profesional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cédula profesional / Registro médico *
              </label>
              <input
                type="text"
                value={professionalForm.license_number}
                onChange={e => setProfessionalForm({ ...professionalForm, license_number: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ej: 1234567890"
                required
              />
            </div>
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía profesional *
            </label>
            <textarea
              value={professionalForm.biography}
              onChange={e => setProfessionalForm({ ...professionalForm, biography: e.target.value })}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe tu experiencia profesional, especialidades y enfoque..."
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Años de experiencia */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Años de experiencia *
              </label>
              <input
                type="number"
                value={professionalForm.experience_years}
                onChange={e => setProfessionalForm({ ...professionalForm, experience_years: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ej: 5"
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
                value={professionalForm.consultation_fee}
                onChange={e => setProfessionalForm({ ...professionalForm, consultation_fee: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ej: 50"
                required
              />
            </div>
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
              {professionalForm.titles.map((title, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Título #{index + 1}</span>
                    {professionalForm.titles.length > 1 && (
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
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Ej: Médico Cirujano"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Institución</label>
                      <input
                        type="text"
                        value={title.institution}
                        onChange={e => updateTitle(index, 'institution', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        placeholder="Ej: Universidad Central"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Año</label>
                      <input
                        type="text"
                        value={title.year}
                        onChange={e => updateTitle(index, 'year', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
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
                      <div className="mt-2 relative inline-block">
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
                    <p className="text-xs text-gray-500 mt-1">Sube una imagen clara del título (JPG, PNG - máx 5MB)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disponibilidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Horarios de disponibilidad *
            </label>
            <div className="space-y-3">
              {Object.entries(professionalForm.availability).map(([day, schedule]) => (
                <div key={day} className="flex items-center gap-4">
                  <div className="w-28">
                    <span className="text-sm capitalize">{day}</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={schedule.enabled}
                      onChange={e => updateAvailability(day, 'enabled', e.target.checked)}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Disponible</span>
                  </label>
                  {schedule.enabled && (
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={schedule.start}
                        onChange={e => updateAvailability(day, 'start', e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                      <span className="text-sm text-gray-500">a</span>
                      <input
                        type="time"
                        value={schedule.end}
                        onChange={e => updateAvailability(day, 'end', e.target.value)}
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-success px-6 py-2 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : 'Actualizar información profesional'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
