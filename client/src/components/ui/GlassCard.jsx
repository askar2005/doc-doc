export default function GlassCard({ className = '', children }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/5 p-5 shadow-neon backdrop-blur-xl ${className}`}>
      {children}
    </div>
  );
}

