import { useState, useEffect } from 'react'
import { api } from '../../../lib/api'

export default function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  })
  const [filters, setFilters] = useState({ role: '', q: '' })
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    loadUsers()
  }, [page, filters])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ page: page.toString(), limit: '20' })
      if (filters.role) params.set('role', filters.role)
      if (filters.q) params.set('q', filters.q)
      
      const res = await api.get(`/admin/users?${params}`)
      // El interceptor puede retornar data directamente o con estructura { data, meta }
      let usersData = []
      let totalData = 0
      
      // Manejar diferentes estructuras de respuesta
      if (res.data) {
        if (Array.isArray(res.data)) {
          // Array directo
          usersData = res.data
          totalData = res.data.length
        } else if (res.data.data && Array.isArray(res.data.data)) {
          // Estructura { data: [...], meta: {...} }
          usersData = res.data.data
          totalData = res.data.meta?.pagination?.total || res.data.meta?.total || 0
        } else if (Array.isArray(res.data)) {
          usersData = res.data
          totalData = res.data.length
        }
      }
      
      setUsers(usersData)
      setTotal(totalData)
      
      console.log('Usuarios cargados:', usersData.length, 'de', totalData, 'total')
      console.log('Respuesta completa:', res)
    } catch (error) {
      console.error('Error cargando usuarios:', error)
      console.error('Respuesta completa:', error?.response)
      alert('Error al cargar usuarios: ' + (error?.response?.data?.error || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await api.put(`/admin/users/${editingUser.id}`, formData)
        alert('Usuario actualizado exitosamente')
      } else {
        await api.post('/admin/users', formData)
        alert('Usuario creado exitosamente')
      }
      setShowModal(false)
      setEditingUser(null)
      setFormData({ name: '', email: '', password: '', role: 'patient' })
      loadUsers()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al guardar usuario')
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'patient'
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    try {
      await api.delete(`/admin/users/${id}`)
      alert('Usuario eliminado exitosamente')
      loadUsers()
    } catch (error) {
      alert(error?.response?.data?.error || 'Error al eliminar usuario')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null)
            setFormData({ name: '', email: '', password: '', role: 'patient' })
            setShowModal(true)
          }}
          className="btn-primary"
        >
          + Nuevo Usuario
        </button>
      </div>

      {/* Filtros */}
      <div className="card p-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email..."
          value={filters.q}
          onChange={e => { setFilters({...filters, q: e.target.value}); setPage(1) }}
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <select
          value={filters.role}
          onChange={e => { setFilters({...filters, role: e.target.value}); setPage(1) }}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Todos los roles</option>
          <option value="patient">Paciente</option>
          <option value="doctor">Doctor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No hay usuarios</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Rol</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{user.name || '-'}</td>
                  <td className="px-4 py-3 text-sm">{user.email}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-700' :
                      user.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nombre</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contraseña {editingUser && '(dejar vacío para no cambiar)'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rol</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="patient">Paciente</option>
                  <option value="doctor">Doctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingUser(null)
                  }}
                  className="btn-outline"
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

