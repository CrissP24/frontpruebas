import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'
import { useAuth } from '../../../hooks/useAuth'
import { ecuadorProvinces, ecuadorInsurances } from '../../../data/ecuadorData'

const API_URL = import.meta.env.VITE_API_URL || 'https://mysimobackend.onrender.com/api'

export default function DoctorsManagement() {
  const { auth } = useAuth()
  const [doctors, setDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [cities, setCities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDocumentsModal, setShowDocumentsModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    specialtyId: '',
    cityId: '',
    province: '',
    city: '',
    about: '',
    price: '',
    insurances: [],
    whatsapp: '',
    photoUrl: '',
    status: 'pending'
  })
  const [filters, setFilters] = useState({ q: '', status: '' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [photoPreview, setPhotoPreview] = useState('')
  const [uploadingPhoto, setUploadingPhoto] = useState(false)

  useEffect(() => {
    loadDoctors()
    loadSpecialties()
    loadCities()
  }, [page, filters])

  const loadDoctors = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (filters.q) params.set('q', filters.q)
      if (filters.status) params.set('status', filters.status)
      
      const res = await api.get(`/doctors?${params}`)
      
      // Manejar diferentes estructuras de respuesta
      let doctorsData = []
      let totalCount = 0
      
      if (res.data) {
        // Si es un objeto con doctors y featured
        if (res.data.doctors && Array.isArray(res.data.doctors)) {
          doctorsData = res.data.doctors
        } 
        // Si es un array directo
        else if (Array.isArray(res.data)) {
          doctorsData = res.data
        }
        // Si está dentro de data.data
        else if (res.data.data && Array.isArray(res.data.data)) {
          doctorsData = res.data.data
        }
        // Si está dentro de data.data.doctors
        else if (res.data.data && res.data.data.doctors && Array.isArray(res.data.data.doctors)) {
          doctorsData = res.data.data.doctors
        }
        
        // Obtener total
        if (res.data.meta?.pagination?.total) {
          totalCount = res.data.meta.pagination.total
        } else if (res.data.total) {
          totalCount = res.data.total
        } else if (res.meta?.pagination?.total) {
          totalCount = res.meta.pagination.total
        }
      }
      
      // Asegurar que siempre sea un array
      if (!Array.isArray(doctorsData)) {
        doctorsData = []
      }
      
      setDoctors(doctorsData)
      setTotal(totalCount)
    } catch (error) {
      console.error('Error cargando doctores:', error)
      setDoctors([])
      setTotal(0)
    } finally {
      setLoading(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validar nombre completo
      if (!formData.fullName || !formData.fullName.trim()) {
        alert('El nombre completo es requerido')
        return
      }
      
      // Validar email
      if (!formData.email || !formData.email.trim()) {
        alert('El email es requerido')
        return
      }
      
      // Validar email formato
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        alert('El email no tiene un formato válido')
        return
      }
      
      // Validar contraseña solo para nuevos doctores
      if (!editingDoctor && (!formData.password || formData.password.length < 6)) {
        alert('La contraseña es requerida y debe tener al menos 6 caracteres')
        return
      }
      
      const data = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        specialtyId: formData.specialtyId ? Number(formData.specialtyId) : null,
        cityId: formData.cityId ? Number(formData.cityId) : null,
        price: formData.price ? Number(formData.price) : null,
        about: formData.about || '',
        insurances: formData.insurances || [],
        whatsapp: formData.whatsapp || '',
        photoUrl: formData.photoUrl || '',
        status: formData.status || 'pending',
      }
      
      if (editingDoctor) {
        await api.put(`/doctors/${editingDoctor.id}`, data)
        alert('Doctor actualizado exitosamente')
      } else {
        await api.post('/doctors', data)
        alert('Doctor creado exitosamente')
      }
      setShowModal(false)
      setEditingDoctor(null)
      resetForm()
      loadDoctors()
    } catch (error) {
      console.error('Error al guardar doctor:', error)
      alert(error?.response?.data?.error || error?.message || 'Error al guardar doctor')
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      password: '',
      specialtyId: '',
      cityId: '',
      province: '',
      city: '',
      about: '',
      price: '',
      insurances: [],
      whatsapp: '',
      photoUrl: '',
      status: 'pending'
    })
    setPhotoPreview('')
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB')
      return
    }

    try {
      setUploadingPhoto(true)
      const formDataUpload = new FormData()
      formDataUpload.append('photo', file)

      const token = auth?.token
      const response = await fetch(`${API_URL}/upload/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataUpload
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al subir foto')
      }

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

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor)
    const photoUrl = doctor.photoUrl || ''
    setFormData({
      fullName: doctor.fullName || '',
      email: doctor.email || '',
      specialtyId: doctor.specialtyId?.toString() || '',
      cityId: doctor.cityId?.toString() || '',
      province: '',
      city: doctor.city?.name || '',
      about: doctor.about || '',
      price: doctor.price?.toString() || '',
      insurances: doctor.insurances || [],
      whatsapp: doctor.whatsapp || '',
      photoUrl: photoUrl,
      status: doctor.status || 'pending'
    })
    if (photoUrl) {
      const fullUrl = photoUrl.startsWith('http') 
        ? photoUrl 
        : `${API_URL.replace('/api', '')}${photoUrl}`
      setPhotoPreview(fullUrl)
    } else {
      setPhotoPreview('')
    }
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este doctor?')) return
    try {
      await api.delete(`/doctors/${id}`)
      alert('Doctor eliminado exitosamente')
      loadDoctors()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al eliminar doctor')
    }
  }

  const handleApprove = async (id) => {
    if (!confirm('¿Estás seguro de aprobar este doctor?')) return
    try {
      await api.put(`/doctors/${id}`, { status: 'active' })
      alert('Doctor aprobado exitosamente')
      loadDoctors()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al aprobar doctor')
    }
  }

  const handleReject = async (id) => {
    if (!confirm('¿Estás seguro de rechazar este doctor?')) return
    try {
      await api.put(`/doctors/${id}`, { status: 'rejected' })
      alert('Doctor rechazado')
      loadDoctors()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al rechazar doctor')
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

  const selectedProvinceData = ecuadorProvinces.find(p => p.name === formData.province)
  const availableCities = selectedProvinceData?.cities || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Doctores</h1>
          <p className="text-gray-600 mt-1">Administra los perfiles médicos</p>
        </div>
        <button
          onClick={() => {
            setEditingDoctor(null)
            resetForm()
            setShowModal(true)
          }}
          className="btn-primary"
        >
          + Nuevo Doctor
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filters.q}
          onChange={e => { setFilters({...filters, q: e.target.value}); setPage(1) }}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <select
          value={filters.status}
          onChange={e => { setFilters({...filters, status: e.target.value}); setPage(1) }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="pending">Pendiente</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : doctors.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay doctores</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Especialidad</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ciudad</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Estado</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {doctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{doctor.fullName}</td>
                  <td className="px-4 py-3 text-sm">{doctor.specialty?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">{doctor.city?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      doctor.status === 'active' ? 'bg-green-100 text-green-700' : 
                      doctor.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {doctor.status === 'active' ? 'Activo' : 
                       doctor.status === 'pending' ? 'Pendiente' : 
                       doctor.status === 'rejected' ? 'Rechazado' : doctor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor)
                          setShowDocumentsModal(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm px-2 py-1 bg-indigo-50 rounded"
                      >
                        Ver Docs
                      </button>
                      {doctor.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(doctor.id)}
                            className="text-green-600 hover:text-green-800 text-sm px-2 py-1 bg-green-50 rounded"
                          >
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleReject(doctor.id)}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 bg-red-50 rounded"
                          >
                            Rechazar
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Paginación */}
      {total > 20 && (
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Mostrando {((page - 1) * 20) + 1} - {Math.min(page * 20, total)} de {total}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-outline disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page * 20 >= total}
              className="btn-outline disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl my-8">
            <h2 className="text-xl font-bold mb-4">
              {editingDoctor ? 'Editar Doctor' : 'Nuevo Doctor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Foto de perfil */}
              <div>
                <label className="block text-sm font-medium mb-2">Foto de perfil</label>
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/96'
                        }}
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                        <span className="text-gray-400 text-xs">Sin foto</span>
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
                      Formatos: JPG, PNG, GIF, WEBP. Máx: 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
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
                {!editingDoctor && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Contraseña *</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                )}
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
                  <label className="block text-sm font-medium mb-1">Precio</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
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
                  <label className="block text-sm font-medium mb-1">Estado</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="active">Activo</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Sobre</label>
                <textarea
                  value={formData.about}
                  onChange={e => setFormData({...formData, about: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Seguros</label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {ecuadorInsurances.map(insurance => (
                    <label key={insurance} className="flex items-center gap-2 cursor-pointer">
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
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingDoctor(null)
                  }}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingDoctor ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de documentos */}
      {showDocumentsModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Documentos del Doctor</h2>
              <button
                onClick={() => {
                  setShowDocumentsModal(false)
                  setSelectedDoctor(null)
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                <div>
                  <p className="text-sm text-gray-600">Nombre completo</p>
                  <p className="font-semibold">{selectedDoctor.fullName || selectedDoctor.full_name || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-semibold">{selectedDoctor.email || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Especialidad</p>
                  <p className="font-semibold">{selectedDoctor.specialty?.name || selectedDoctor.specialty || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cédula profesional</p>
                  <p className="font-semibold">{selectedDoctor.license_number || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-semibold">{selectedDoctor.phone || selectedDoctor.whatsapp || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Años de experiencia</p>
                  <p className="font-semibold">{selectedDoctor.experience_years || '0'} años</p>
                </div>
              </div>

              {/* Biografía */}
              {selectedDoctor.biography && (
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-2">Biografía profesional</p>
                  <p className="text-gray-800">{selectedDoctor.biography}</p>
                </div>
              )}

              {/* Títulos académicos */}
              {selectedDoctor.titles && selectedDoctor.titles.length > 0 ? (
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-3">Títulos académicos ({selectedDoctor.titles.length})</p>
                  <div className="space-y-4">
                    {selectedDoctor.titles.map((title, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{title.name || 'Sin nombre'}</h4>
                            <p className="text-gray-600">{title.institution || 'Institución no especificada'}</p>
                            {title.year && <p className="text-sm text-gray-500">Año: {title.year}</p>}
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Título #{index + 1}
                          </span>
                        </div>
                        {title.image ? (
                          <div className="border rounded-lg overflow-hidden bg-white">
                            <img 
                              src={title.image} 
                              alt={`Certificado: ${title.name}`} 
                              className="w-full h-auto max-h-96 object-contain"
                            />
                            <p className="text-xs text-gray-500 p-2 text-center bg-gray-100">
                              Clic derecho para ver en tamaño completo
                            </p>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <span className="text-gray-400">⚠️ Sin imagen del certificado</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedDoctor.education ? (
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-2">Educación (formato anterior)</p>
                  <p className="text-gray-800 whitespace-pre-line">{selectedDoctor.education}</p>
                  {selectedDoctor.education_certificate && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500 mb-2">Certificado adjunto:</p>
                      <img 
                        src={selectedDoctor.education_certificate} 
                        alt="Certificado profesional" 
                        className="w-full h-auto max-h-96 object-contain border rounded"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-2">Títulos académicos</p>
                  <p className="text-gray-400 italic">No ha subido títulos académicos</p>
                </div>
              )}

              {/* Horarios de disponibilidad */}
              {selectedDoctor.availability && (
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-3">Horarios de disponibilidad</p>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(selectedDoctor.availability).map(([day, schedule]) => (
                      schedule.enabled && (
                        <div key={day} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                          <span className="capitalize font-medium">{day}</span>
                          <span className="text-gray-600">{schedule.start} - {schedule.end}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Tarifa */}
              <div className="pb-4 border-b">
                <p className="text-sm text-gray-600">Tarifa de consulta</p>
                <p className="text-2xl font-bold text-green-600">
                  ${selectedDoctor.consultation_fee || selectedDoctor.price || '0'} USD
                </p>
              </div>

              {/* Foto de perfil */}
              {selectedDoctor.photoUrl && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">Foto de perfil</p>
                  <img 
                    src={selectedDoctor.photoUrl} 
                    alt="Foto de perfil" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                  />
                </div>
              )}

              {/* Acciones de aprobación */}
              {selectedDoctor.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => {
                      handleApprove(selectedDoctor.id)
                      setShowDocumentsModal(false)
                    }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    ✓ Aprobar Doctor
                  </button>
                  <button
                    onClick={() => {
                      handleReject(selectedDoctor.id)
                      setShowDocumentsModal(false)
                    }}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-semibold"
                  >
                    ✗ Rechazar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

