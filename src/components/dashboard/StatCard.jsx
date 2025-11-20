/**
 * Tarjeta de estadística para dashboard
 */
export default function StatCard({ icon, title, value, subtitle, trend, color = 'primary' }) {
  const colorClasses = {
    primary: 'bg-[var(--primary)] text-white',
    accent: 'bg-[#eef0ff] text-[var(--primary)]',
    success: 'bg-green-50 text-green-700',
    warning: 'bg-yellow-50 text-yellow-700',
    danger: 'bg-red-50 text-red-700',
  }

  const IconComponent = icon

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {IconComponent && (
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <IconComponent className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}





