export default function ConfigPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Información del Sistema</h1>
        <p className="text-gray-600 mt-1">Detalles y operaciones del sistema</p>
      </div>

      {/* Información del Sistema */}
      <div className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold mb-6">Información General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Nombre de la Plataforma</p>
            <p className="text-2xl font-bold text-blue-900 mt-2">MySimo</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Tipo</p>
            <p className="text-2xl font-bold text-green-900 mt-2">Sistema de Citas Médicas</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-sm text-purple-600 font-medium">Estado</p>
            <p className="text-2xl font-bold text-purple-900 mt-2">Activo</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-sm text-orange-600 font-medium">Versión</p>
            <p className="text-2xl font-bold text-orange-900 mt-2">1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}



