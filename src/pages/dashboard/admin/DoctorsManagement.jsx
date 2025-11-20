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
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [formData, setFormData] = useState({
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
      
      const data = {
        fullName: formData.fullName.trim(),
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
      // Nota: Necesitarías un endpoint DELETE en el backend
      alert('Funcionalidad de eliminar pendiente de implementar en backend')
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al eliminar doctor')
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
                      doctor.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {doctor.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Eliminar
                      </button>
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
    </div>
  )
}

