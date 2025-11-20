import { Routes, Route, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import DoctorProfile from './pages/DoctorProfile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import About from './pages/About'

function AppContent() {
  const { auth } = useAuth()
  const location = useLocation()
  const isAdmin = auth?.user?.role === 'admin'
  const isDashboardRoute = location.pathname.startsWith('/dashboard')

  // Si es admin en dashboard, no mostrar Navbar ni Footer
  if (isAdmin && isDashboardRoute) {
    return (
      <Routes>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Routes>
    )
  }

  // Para otras rutas, mostrar Navbar y Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctores" element={<Doctors />} />
          <Route path="/medico/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return <AppContent />
}
