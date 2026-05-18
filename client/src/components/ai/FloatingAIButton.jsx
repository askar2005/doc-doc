import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingAIButton() {
  return (
    <Link
      to="/ai"
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-4 right-4 z-40 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-neon sm:left-auto sm:right-4 sm:w-auto sm:px-5 md:bottom-6"
    >
      <Sparkles size={16} />
      Ask AI
    </Link>
  );
}
