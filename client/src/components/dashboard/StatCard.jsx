export default function StatCard({ title, value, hint, accent = 'from-primary to-secondary' }) {
  return (
    <div className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-neon backdrop-blur-xl sm:p-5">
      <div className={`mb-4 h-1.5 w-14 rounded-full bg-gradient-to-r ${accent}`} />
      <div className="text-xs text-slate-400 sm:text-sm">{title}</div>
      <div className="mt-1 break-words text-2xl font-bold leading-tight text-white sm:text-3xl">{value}</div>
      <div className="mt-2 text-sm leading-6 text-slate-300">{hint}</div>
    </div>
  );
}
