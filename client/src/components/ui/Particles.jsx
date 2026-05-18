export default function Particles() {
  const dots = Array.from({ length: 14 });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {dots.map((_, index) => (
        <span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/30 blur-[1px]"
          style={{
            left: `${(index * 13) % 100}%`,
            top: `${(index * 9) % 100}%`,
            animation: `float ${10 + index * 1.2}s ease-in-out infinite`,
            opacity: 0.35 + (index % 4) * 0.1
          }}
        />
      ))}
    </div>
  );
}
