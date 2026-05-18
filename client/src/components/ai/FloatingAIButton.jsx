import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FloatingAIButton() {
  return (
    <Link
      to="/ai"
      className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white shadow-neon md:bottom-6"
    >
      <Sparkles size={16} />
      Ask AI
    </Link>
  );
}

