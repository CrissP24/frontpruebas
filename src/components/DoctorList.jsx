import DoctorCard from './DoctorCard'

export default function DoctorList({ doctors }){
  if (!doctors?.length) return <div className="text-sm text-gray-500">No hay resultados.</div>
  return (
    <div className="space-y-4">
      {doctors.map(d => <DoctorCard key={d.id} doctor={d} horizontal />)}
    </div>
  )
}








