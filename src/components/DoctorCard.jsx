import { Link } from 'react-router-dom'

export default function DoctorCard({ doctor, horizontal=false }){
  const Wrapper = ({children}) => (
    <div className={horizontal? 'flex p-4 border rounded-xl shadow-card gap-4 bg-white' : 'p-4 border rounded-xl shadow-card bg-white'}>{children}</div>
  )
  
  // Determinar si ofrece presencial o en línea (por ahora asumimos ambos)
  const offersPresencial = true
  const offersOnline = true
  
  return (
    <Wrapper>
      <div className={horizontal? 'w-28 h-28 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden' : 'w-full h-40 bg-gray-100 rounded-xl overflow-hidden'}>
        {doctor.photoUrl ? (
          <img 
            src={doctor.photoUrl.startsWith('http') ? doctor.photoUrl : `${import.meta.env.VITE_API_URL?.replace('/api', '') || ''}${doctor.photoUrl}`} 
            alt={doctor.fullName || 'Doctor'} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'flex'
              }
            }}
          />
        ) : null}
        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{ display: doctor.photoUrl ? 'none' : 'flex' }}>
          Sin foto
        </div>
      </div>
      <div className={horizontal? 'flex-1' : 'mt-3'}>
        <div className="font-semibold text-lg">{doctor.fullName || doctor.name || 'Doctor'}</div>
        <div className="text-sm text-gray-600">
          {doctor.specialty?.name || 'Especialidad no especificada'} · {doctor.city?.name || 'Ciudad no especificada'}
        </div>
        
        {/* Tags presencial/en línea */}
        <div className="mt-2 flex flex-wrap gap-2">
          {offersPresencial && (
            <span className="text-xs bg-blue-100 text-blue-700 rounded-full px-2 py-1 font-medium">
              Presencial
            </span>
          )}
          {offersOnline && (
            <span className="text-xs bg-green-100 text-green-700 rounded-full px-2 py-1 font-medium">
              En línea
            </span>
          )}
        </div>
        
        {doctor.insurances?.length ? (
          <div className="mt-2 flex flex-wrap gap-2">
            {doctor.insurances.slice(0,3).map((s,i)=>(<span key={i} className="text-xs bg-gray-100 rounded px-2 py-1">{s}</span>))}
          </div>
        ): null}
        
        {/* Leyenda de deducible */}
        {doctor.insurances?.length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            - Deducible con: {doctor.insurances.join(', ')}
          </div>
        )}
        {(!doctor.insurances || doctor.insurances.length === 0) && (
          <div className="mt-2 text-xs text-gray-500">
            - No deducible con seguros privados
          </div>
        )}
        
        <div className="mt-3 flex items-center gap-3">
          <Link to={`/medico/${doctor.id}`} className="px-4 py-2 rounded-btn bg-accent text-white hover:opacity-90 transition">Ver perfil</Link>
          {doctor.whatsapp && (
            <a 
              href={`https://wa.me/${doctor.whatsapp.replace(/[^0-9]/g, '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              WhatsApp
            </a>
          )}
        </div>
      </div>
    </Wrapper>
  )
}






