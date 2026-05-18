export default function StatCard({ title, value, hint, accent = 'from-primary to-secondary' }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-neon backdrop-blur-xl">
      <div className={`mb-4 h-1.5 w-14 rounded-full bg-gradient-to-r ${accent}`} />
      <div className="text-sm text-slate-400">{title}</div>
      <div className="mt-1 text-3xl font-bold text-white">{value}</div>
      <div className="mt-2 text-sm text-slate-300">{hint}</div>
    </div>
  );
}

