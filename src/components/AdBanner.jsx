export default function AdBanner({ className = '' }) {
  return (
    <div className={`w-full px-4 md:px-8 py-4 ${className}`}>
      <a
        href="https://omedso.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full border-2 border-dashed border-slate-300 rounded-xl py-3 px-5 hover:border-[#140172]/60 hover:bg-[#140172]/4 transition-all group cursor-pointer"
      >
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest select-none">Publicidad</span>
        <span className="w-px h-3.5 bg-slate-300 flex-shrink-0" />
        <span className="text-[13px] text-slate-500 group-hover:text-[#140172] transition-colors">
          Visita <span className="font-bold">omedso.com</span>
        </span>
      </a>
    </div>
  )
}
