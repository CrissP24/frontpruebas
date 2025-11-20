import { useEffect } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '../hooks/useAuth'
import PatientDashboard from './dashboard/PatientDashboard'
import DoctorDashboard from './dashboard/DoctorDashboard'
import AdminDashboard from './dashboard/AdminDashboard'
import UsersManagement from './dashboard/admin/UsersManagement'
import DoctorsManagement from './dashboard/admin/DoctorsManagement'
import AppointmentsManagement from './dashboard/admin/AppointmentsManagement'
import SpecialtiesManagement from './dashboard/admin/SpecialtiesManagement'
import ProfilePage from './dashboard/admin/ProfilePage'
import ConfigPage from './dashboard/admin/ConfigPage'

export default function Dashboard() {
  const { auth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!auth?.token) {
      navigate('/login')
      return
    }
  }, [auth, navigate])

  if (!auth?.token) {
    return null
  }

  const role = auth?.user?.role

  return (
    <DashboardLayout>
      <Routes>
        {role === 'admin' && (
          <>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/usuarios" element={<UsersManagement />} />
            <Route path="/doctores" element={<DoctorsManagement />} />
            <Route path="/citas" element={<AppointmentsManagement />} />
            <Route path="/especialidades" element={<SpecialtiesManagement />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/configuracion" element={<ConfigPage />} />
          </>
        )}
        {role === 'doctor' && (
          <>
            <Route path="/" element={<DoctorDashboard />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </>
        )}
        {role === 'patient' && (
          <>
            <Route path="/" element={<PatientDashboard />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </>
        )}
        <Route path="*" element={
          <div className="card p-8 text-center">
            <p className="text-gray-600">Página no encontrada</p>
          </div>
        } />
      </Routes>
    </DashboardLayout>
  )
}
