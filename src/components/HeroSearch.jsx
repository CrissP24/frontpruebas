import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function HeroSearch() {
  const [cities, setCities] = useState([])
  const [q, setQ] = useState('')
  const [city, setCity] = useState('')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/cities')
      .then(res => {
        // Manejar nueva estructura de respuesta
        const data = res.data
        setCities(Array.isArray(data) ? data : (data.data || []))
      })
      .catch(() => setCities([]))
    setQ(searchParams.get('q') || '')
    setCity(searchParams.get('ciudad') || '')
  }, [])

  function onSubmit(e){
    e.preventDefault()
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (city) params.set('ciudad', city)
    navigate(`/doctores?${params.toString()}`)
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-light text-white">
      <div className="container py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl font-bold">Encuentra al médico que necesitas</h1>
        <p className="mt-2 text-white/90">+1000 profesionales están aquí para ti</p>
        <form onSubmit={onSubmit} className="mt-8 bg-white rounded-xl shadow-card p-4 grid md:grid-cols-3 gap-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Especialidad o nombre del médico" className="w-full border rounded-lg px-3 py-3" />
          <select value={city} onChange={e=>setCity(e.target.value)} className="w-full border rounded-lg px-3 py-3">
            <option value="">Selecciona ciudad</option>
            {cities.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <button className="bg-accent text-white rounded-btn px-5 py-3">Buscar</button>
        </form>
      </div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full" />
    </div>
  )
}




