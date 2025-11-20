import { useState } from 'react'

export default function ConfigPage() {
  const [config, setConfig] = useState({
    siteName: 'MySimo',
    siteDescription: 'Plataforma de citas médicas',
    maintenanceMode: false,
    allowRegistrations: true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implementar guardado de configuración
    alert('Configuración guardada (funcionalidad pendiente)')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">Ajustes del sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Configuración General</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre del sitio</label>
              <input
                type="text"
                value={config.siteName}
                onChange={e => setConfig({...config, siteName: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                value={config.siteDescription}
                onChange={e => setConfig({...config, siteDescription: e.target.value})}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={e => setConfig({...config, maintenanceMode: e.target.checked})}
                className="h-4 w-4"
              />
              <label className="text-sm">Modo mantenimiento</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={config.allowRegistrations}
                onChange={e => setConfig({...config, allowRegistrations: e.target.checked})}
                className="h-4 w-4"
              />
              <label className="text-sm">Permitir nuevos registros</label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="btn-primary">
            Guardar Configuración
          </button>
        </div>
      </form>
    </div>
  )
}



