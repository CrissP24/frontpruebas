import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

export default function SpecialtiesManagement() {
  const [specialties, setSpecialties] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSpecialty, setEditingSpecialty] = useState(null)
  const [formData, setFormData] = useState({ name: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [specialtiesRes, doctorsRes] = await Promise.all([
        api.get('/admin/specialties'),
        api.get('/doctors?status=active&limit=1000') // Get all active doctors
      ])
      setSpecialties(specialtiesRes.data || [])
      setDoctors(doctorsRes.data?.doctors || doctorsRes.data || [])
    } catch (error) {
      console.error('Error cargando datos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingSpecialty) {
        await api.put(`/admin/specialties/${editingSpecialty.id}`, formData)
        alert('Especialidad actualizada exitosamente')
      } else {
        await api.post('/admin/specialties', formData)
        alert('Especialidad creada exitosamente')
      }
      setShowModal(false)
      setEditingSpecialty(null)
      setFormData({ name: '' })
      loadData()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al guardar especialidad')
    }
  }

  const handleEdit = (specialty) => {
    setEditingSpecialty(specialty)
    setFormData({ name: specialty.name })
    setShowModal(true)
  }

  const getDoctorCount = (specialtyName) => {
    return doctors.filter(doctor => doctor.specialty === specialtyName).length
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Especialidades</h1>
          <p className="text-gray-600 mt-1">Administra las especialidades médicas</p>
        </div>
        <button
          onClick={() => {
            setEditingSpecialty(null)
            setFormData({ name: '' })
            setShowModal(true)
          }}
          className="btn-primary"
        >
          + Nueva Especialidad
        </button>
      </div>

      {/* Lista */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : specialties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay especialidades</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Médicos</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {specialties.map(specialty => (
                <tr key={specialty.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{specialty.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {getDoctorCount(specialty.name)} médico(s)
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(specialty)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(specialty.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingSpecialty ? 'Editar Especialidad' : 'Nueva Especialidad'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingSpecialty(null)
                  }}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingSpecialty ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}



