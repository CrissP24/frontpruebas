export default function StatCard({ icon, title, value, subtitle, trend, color = 'primary' }) {
  const iconStyles = {
    primary: 'bg-[#140172] text-white',
    accent: 'bg-[#eef0ff] text-[#140172]',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-amber-50 text-amber-600',
    danger: 'bg-red-50 text-red-500',
  }

  const IconComponent = icon

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-[#140172]/25 hover:shadow-[0_8px_32px_-8px_rgba(20,1,114,0.14)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-slate-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
          {subtitle && <p className="text-[12px] text-slate-400 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-[12px] font-medium ${trend.positive ? 'text-emerald-600' : 'text-red-500'}`}>
              <span>{trend.positive ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        {IconComponent && (
          <div className={`flex-shrink-0 p-3 rounded-xl ${iconStyles[color]}`}>
            <IconComponent className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  )
}
