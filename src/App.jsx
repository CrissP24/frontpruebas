import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import DoctorProfile from './pages/DoctorProfile'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import About from './pages/About'
import Privacidad from './pages/Privacidad'
import Terminos from './pages/Terminos'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/buscar" element={<Doctors />} />
          <Route path="/profesional/:id" element={<DoctorProfile />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacidad" element={<Privacidad />} />
          <Route path="/terminos" element={<Terminos />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return <AppContent />
}
