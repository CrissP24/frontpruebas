import { useEffect, useRef, useState } from 'react'
import { api } from '../lib/api'
import DoctorCard from './DoctorCard'

export default function FeaturedDoctors(){
  const [items, setItems] = useState([])
  const scroller = useRef(null)
  useEffect(()=>{
    api.get('/doctors?featured=true')
      .then(res=> {
        // Manejar nueva estructura de respuesta
        const data = res.data
        setItems(Array.isArray(data) ? data : (data.data || []))
      })
      .catch(()=> setItems([]))
  },[])
  if (!items.length) return null

  const scrollBy = (dx) => {
    if (scroller.current) scroller.current.scrollBy({ left: dx, behavior: 'smooth' })
  }

  return (
    <section className="container py-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Médicos destacados en Consulta Médica</h2>
        <div className="flex gap-2">
          <button onClick={()=>scrollBy(-300)} className="btn-outline">◀</button>
          <button onClick={()=>scrollBy(300)} className="btn-outline">▶</button>
        </div>
      </div>
      <div ref={scroller} className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {items.map(d => (
          <div key={d.id} className="min-w-[260px] max-w-[260px]">
            <DoctorCard doctor={d} />
          </div>
        ))}
      </div>
    </section>
  )
}
