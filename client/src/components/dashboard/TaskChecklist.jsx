import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

export default function TaskChecklist({ tasks, onToggle }) {
  const labels = {
    water: 'Drink 3L water',
    egg: 'Eat one boiled egg',
    fruits: 'Eat 2 fruits',
    vegetables: 'Eat vegetables',
    sundal: 'Eat sundal',
    protein: 'Eat fish or mutton',
    keerai: 'Weekly keerai reminder'
  };

  return (
    <div className="space-y-3">
      {Object.entries(labels).map(([key, label]) => {
        const completed = Boolean(tasks[key]);
        return (
          <motion.button
            key={key}
            type="button"
            onClick={() => onToggle(key)}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:border-cyan-400/30 hover:bg-white/10"
          >
            <div>
              <div className="font-medium text-white">{label}</div>
              <div className="text-xs text-slate-400">{completed ? 'Completed today' : 'Tap to complete'}</div>
            </div>
            {completed ? <CheckCircle2 className="text-cyan-300" /> : <Circle className="text-slate-500" />}
          </motion.button>
        );
      })}
    </div>
  );
}
