import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../hooks/useAuth'
import { ecuadorProvinces, ecuadorInsurances, ecuadorUniversities } from '../../../data/ecuadorData'

const API_URL = import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'

export default function ProfilePage() {
  const { auth, setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [doctor, setDoctor] = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Doctor fields
    fullName: '',
    specialtyId: '',
    cityId: '',
    province: '',
    city: '',
    about: '',
    price: '',
    insurances: [],
    whatsapp: '',
    photoUrl: '',
    pregrado: '',
    postgrado: '',
    almaMater: '',
    additionalEducation: [],
    address: '',
    experience: '',
    languages: '',
    certifications: ''
  })
  const [specialties, setSpecialties] = useState([])
  const [cities, setCities] = useState([])

  useEffect(() => {
    loadProfile()
    loadSpecialties()
    loadCities()
  }, [])

  const loadProfile = async () => {
    try {
      const userRes = await api.get(`/admin/users/${auth.user.id}`)
      const user = userRes.data
      
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }))

      // Si es doctor, cargar perfil de doctor
      if (user.role === 'doctor' && user.doctor) {
        const doctorRes = await api.get(`/doctors/${user.doctor.id}`)
        const doctorData = doctorRes.data
        setDoctor(doctorData)
        
        if (doctorData.photoUrl) {
          setPhotoPreview(doctorData.photoUrl.startsWith('http') 
            ? doctorData.photoUrl 
            : `${API_URL.replace('/api', '')}${doctorData.photoUrl}`)
        }
        
        setFormData(prev => ({
          ...prev,
          fullName: doctorData.fullName || '',
          specialtyId: doctorData.specialtyId?.toString() || '',
          cityId: doctorData.cityId?.toString() || '',
          about: doctorData.about || '',
          price: doctorData.price?.toString() || '',
          insurances: doctorData.insurances || [],
          whatsapp: doctorData.whatsapp || '',
          photoUrl: doctorData.photoUrl || '',
          pregrado: doctorData.pregrado || '',
          postgrado: doctorData.postgrado || '',
          almaMater: doctorData.almaMater || '',
          address: doctorData.address || '',
          experience: doctorData.experience || '',
          languages: doctorData.languages || '',
          certifications: doctorData.certifications || ''
        }))
      }
    } catch (error) {
      console.error('Error cargando perfil:', error)
    }
  }

  const loadSpecialties = async () => {
    try {
      const res = await api.get('/specialties')
      setSpecialties(res.data || [])
    } catch (error) {
      console.error('Error cargando especialidades:', error)
    }
  }

  const loadCities = async () => {
    try {
      const res = await api.get('/cities')
      setCities(res.data || [])
    } catch (error) {
      console.error('Error cargando ciudades:', error)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen')
      return
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB')
      return
    }

    try {
      setUploadingPhoto(true)
      const formData = new FormData()
      formData.append('photo', file)

      const token = auth?.token
      const response = await fetch(`${API_URL}/upload/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al subir foto')
      }

      // Actualizar URL de foto
      const photoUrl = data.data.url
      const fullUrl = data.data.fullUrl || (photoUrl.startsWith('http') 
        ? photoUrl 
        : `${API_URL.replace('/api', '')}${photoUrl}`)
      
      setFormData(prev => ({...prev, photoUrl}))
      setPhotoPreview(fullUrl)
      
      alert('Foto subida exitosamente')
    } catch (error) {
      console.error('Error subiendo foto:', error)
      alert('Error al subir foto: ' + error.message)
    } finally {
      setUploadingPhoto(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      // Validar contraseñas si se proporcionaron
      if (formData.password) {
        if (formData.password !== formData.confirmPassword) {
          alert('Las contraseñas no coinciden')
          return
        }
        if (formData.password.length < 8) {
          alert('La contraseña debe tener al menos 8 caracteres')
          return
        }
      }
      
      // Actualizar usuario
      const userData = {
        name: formData.name,
        email: formData.email
      }
      if (formData.password) {
        userData.password = formData.password
      }
      
      const userRes = await api.put(`/admin/users/${auth.user.id}`, userData)
      
      // Si es doctor, actualizar perfil de doctor
      if (auth.user.role === 'doctor' && doctor) {
        const doctorData = {
          fullName: formData.fullName,
          specialtyId: formData.specialtyId ? Number(formData.specialtyId) : null,
          cityId: formData.cityId ? Number(formData.cityId) : null,
          about: formData.about,
          price: formData.price ? Number(formData.price) : null,
          insurances: formData.insurances,
          whatsapp: formData.whatsapp,
          photoUrl: formData.photoUrl,
          pregrado: formData.pregrado,
          postgrado: formData.postgrado,
          almaMater: formData.almaMater,
          address: formData.address,
          experience: formData.experience,
          languages: formData.languages,
          certifications: formData.certifications
        }
        
        await api.put(`/doctors/${doctor.id}`, doctorData)
      }
      
      // Actualizar auth
      setAuth({
        ...auth,
        user: {
          ...auth.user,
          name: userRes.data.name,
          email: userRes.data.email
        }
      })
      
      alert('Perfil actualizado exitosamente')
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  const toggleInsurance = (insurance) => {
    setFormData(prev => ({
      ...prev,
      insurances: prev.insurances.includes(insurance)
        ? prev.insurances.filter(i => i !== insurance)
        : [...prev.insurances, insurance]
    }))
  }

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      additionalEducation: [...prev.additionalEducation, { almaMater: '', tipo: 'postgrado' }]
    }))
  }

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalEducation: prev.additionalEducation.filter((_, i) => i !== index)
    }))
  }

  const isDoctor = auth?.user?.role === 'doctor'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-600 mt-1">Actualiza tu información personal y profesional</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre completo *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmar Email *</label>
              <input
                type="email"
                required
                value={formData.confirmEmail || ''}
                onChange={e => setFormData({...formData, confirmEmail: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="+593 99 123 4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nueva contraseña (opcional)</label>
              <input
                type="password"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmar contraseña</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                disabled={!formData.password}
              />
            </div>
          </div>
        </div>

        {/* Información de doctor */}
        {isDoctor && (
          <div className="card p-6 space-y-6">
            <h2 className="text-xl font-semibold">Información Profesional</h2>
            
            {/* Foto de perfil */}
            <div>
              <label className="block text-sm font-medium mb-2">Foto de perfil</label>
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {photoPreview ? (
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/128'
                      }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                      <span className="text-gray-400 text-sm">Sin foto</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {uploadingPhoto && (
                    <p className="text-sm text-blue-600 mt-2">Subiendo foto...</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Formatos permitidos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre completo profesional *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Especialidad</label>
                <select
                  value={formData.specialtyId}
                  onChange={e => setFormData({...formData, specialtyId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  {specialties.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ciudad</label>
                <select
                  value={formData.cityId}
                  onChange={e => setFormData({...formData, cityId: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Precio de consulta</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">WhatsApp</label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="+593 99 123 4567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Dirección de consultorio"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Sobre mí</label>
              <textarea
                value={formData.about}
                onChange={e => setFormData({...formData, about: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                rows={4}
                placeholder="Describe tu experiencia y especialización..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Años de experiencia</label>
              <input
                type="number"
                value={formData.experience}
                onChange={e => setFormData({...formData, experience: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej: 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Idiomas</label>
              <input
                type="text"
                value={formData.languages}
                onChange={e => setFormData({...formData, languages: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Ej: Español, Inglés, Francés"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Certificaciones</label>
              <textarea
                value={formData.certifications}
                onChange={e => setFormData({...formData, certifications: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
                placeholder="Lista tus certificaciones y acreditaciones..."
              />
            </div>

            {/* Educación */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Educación</h3>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Alma Mater</label>
                    <input
                      type="text"
                      value={formData.almaMater}
                      onChange={e => setFormData({...formData, almaMater: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Universidad Católica"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select
                      value={formData.pregrado}
                      onChange={e => setFormData({...formData, pregrado: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Seleccionar</option>
                      <option value="pregrado">Pregrado</option>
                      <option value="postgrado">Postgrado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postgrado</label>
                  <input
                    type="text"
                    value={formData.postgrado}
                    onChange={e => setFormData({...formData, postgrado: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Universidad de Palermo"
                  />
                </div>
                
                {/* Educación adicional */}
                {formData.additionalEducation.map((edu, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-sm">Educación adicional {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Alma Mater</label>
                        <input
                          type="text"
                          value={edu.almaMater}
                          onChange={e => {
                            const newEdu = [...formData.additionalEducation]
                            newEdu[index].almaMater = e.target.value
                            setFormData({...formData, additionalEducation: newEdu})
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Tipo</label>
                        <select
                          value={edu.tipo}
                          onChange={e => {
                            const newEdu = [...formData.additionalEducation]
                            newEdu[index].tipo = e.target.value
                            setFormData({...formData, additionalEducation: newEdu})
                          }}
                          className="w-full border rounded-lg px-3 py-2"
                        >
                          <option value="postgrado">Postgrado</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addEducation}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  + Agregar educación adicional
                </button>
              </div>
            </div>

            {/* Seguros */}
            <div>
              <label className="block text-sm font-medium mb-2">Seguros aceptados (editable)</label>
              <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3">
                {ecuadorInsurances.map(insurance => (
                  <label key={insurance} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                    <input
                      type="checkbox"
                      checked={formData.insurances.includes(insurance)}
                      onChange={() => toggleInsurance(insurance)}
                      className="h-4 w-4"
                    />
                    <span className="text-xs">{insurance}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button type="submit" disabled={loading || uploadingPhoto} className="btn-primary">
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  )
}
