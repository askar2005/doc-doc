export default function GlassCard({ className = '', children }) {
  return (
    <div className={`min-w-0 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-neon backdrop-blur-xl sm:p-5 ${className}`}>
      {children}
    </div>
  );
}
