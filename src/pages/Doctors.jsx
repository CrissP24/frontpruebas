import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import DoctorList from '../components/DoctorList'
import DoctorSearchBar from '../components/DoctorSearchBar'

export default function Doctors(){
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({ total: 0, data: [], results: 0, page: 1, limit: 20 })
  const q = searchParams.get('q') || ''
  const city = searchParams.get('city') || ''
  const specialty = searchParams.get('specialty') || ''
  const visitType = searchParams.get('visitType') || ''
  const insurance = searchParams.get('insurance') || ''

  const [page, setPage] = useState(1)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(1)
  }, [q, city, specialty, visitType, insurance])

  const query = useMemo(()=>{
    const p = new URLSearchParams()
    const hasSearchFilters = (q && q.trim()) || (city && city.trim()) || (specialty && specialty.trim())
    
    if (q && q.trim()) p.set('q', q.trim())
    if (city && city.trim()) p.set('city', city.trim())
    if (specialty && specialty.trim()) p.set('specialty', specialty.trim())
    if (visitType && visitType.trim()) p.set('visitType', visitType.trim())
    
    // Solo agregar insurance si:
    // 1. Hay otros filtros de búsqueda activos, O
    // 2. El usuario seleccionó explícitamente 'si' (tiene seguros)
    // Esto evita que el valor por defecto 'no' filtre cuando no hay búsqueda
    if (insurance && insurance.trim() !== '') {
      if (hasSearchFilters || insurance === 'si') {
        p.set('insurance', insurance)
      }
      // Si no hay filtros y es 'no', no agregar el parámetro (mostrar todos)
    }
    
    // Solo mostrar doctores activos en la búsqueda pública
    p.set('status', 'active')
    p.set('page', String(page))
    p.set('limit', '10')
    return p.toString()
  }, [q, city, specialty, visitType, insurance, page])

  useEffect(()=>{
    setLoading(true)
    api.get(`/doctors?${query}`).then(res=> {
      console.log('Respuesta del backend:', res.data)
      
      // Manejar estructura de respuesta del backend
      let doctorsData = []
      let totalCount = 0
      let resultsCount = 0
      let currentPage = page
      let currentLimit = 10

      if (res.data) {
        // El backend devuelve { featured: [...], doctors: [...] }
        // Combinar featured y doctors para mostrar todos
        const featured = res.data.featured || []
        const doctors = res.data.doctors || []
        
        // Combinar featured primero, luego los demás
        doctorsData = [...featured, ...doctors]
        
        console.log('Featured:', featured.length, 'Doctors:', doctors.length, 'Total combinado:', doctorsData.length)
        
        // Si no hay estructura featured/doctors, buscar en otras ubicaciones
        if (doctorsData.length === 0) {
          if (Array.isArray(res.data)) {
            doctorsData = res.data
          } else if (res.data.data && Array.isArray(res.data.data)) {
            doctorsData = res.data.data
          }
        }

        // Obtener metadatos de paginación
        if (res.data.meta?.pagination) {
          totalCount = res.data.meta.pagination.total || 0
          // resultsCount debe incluir featured + doctors de esta página
          resultsCount = doctorsData.length
          currentPage = res.data.meta.pagination.page || page
          currentLimit = res.data.meta.pagination.limit || 10
        } else if (res.data.total !== undefined) {
          totalCount = res.data.total || 0
          // resultsCount debe incluir featured + doctors de esta página
          resultsCount = doctorsData.length
          currentPage = res.data.page || page
          currentLimit = res.data.limit || 10
        } else {
          // Si no hay metadatos, usar la longitud de los datos
          totalCount = doctorsData.length
          resultsCount = doctorsData.length
        }
      }

      // Asegurar que siempre sea un array
      if (!Array.isArray(doctorsData)) {
        doctorsData = []
      }

      console.log('Doctores finales a mostrar:', doctorsData.length, 'Total:', totalCount)

      setData({
        data: doctorsData,
        total: totalCount,
        results: resultsCount,
        page: currentPage,
        limit: currentLimit
      })
    }).catch((error) => {
      console.error('Error cargando doctores:', error)
      console.error('Error completo:', error.response?.data || error.message)
      setData({ total: 0, data: [], results: 0, page: 1, limit: 20 })
    }).finally(()=> setLoading(false))
  }, [query, page])

  return (
    <div>
      <section className="bg-white border-b">
        <div className="container py-8">
          <DoctorSearchBar />
        </div>
      </section>
      <div className="container py-8">
        <div className="text-sm text-gray-600 mb-4">Mostrando {data.results || 0} de {data.total || 0} resultados</div>
        
        {/* Contenedor de resultados con background #fff */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          {loading ? (
            <div className="text-center py-8">Cargando...</div>
          ) : (
            <>
              <DoctorList doctors={data.data} />
              {/* Leyenda de deducible */}
              <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-600 space-y-1">
                <p>- Deducible con: $seguros-</p>
                <p>- No deducible con seguros privados-</p>
              </div>
            </>
          )}
        </div>
        
        <div className="mt-6 flex gap-2">
          <button disabled={page<=1} onClick={()=>setPage(p=>Math.max(1, p-1))} className="btn-outline">Anterior</button>
          <button disabled={(data.page*data.limit)>=data.total} onClick={()=>setPage(p=>p+1)} className="btn-outline">Siguiente</button>
        </div>
      </div>
    </div>
  )
}
