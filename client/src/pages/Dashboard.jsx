import { Sparkles, Droplets, HeartPulse } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import ProgressRing from '../components/ui/ProgressRing';
import StatCard from '../components/dashboard/StatCard';
import TaskChecklist from '../components/dashboard/TaskChecklist';
import FloatingAIButton from '../components/ai/FloatingAIButton';
import useAppStore from '../store/appStore';
import useAuthStore from '../store/authStore';
import { completionPercentage, calculateHealthScore, scoreLabel, toShortTask } from '../utils/score';
import Skeleton from '../components/ui/Skeleton';
import HealthTip from '../components/dashboard/HealthTip';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const { todayTask, streakSummary, healthTip, loading, toggleTask } = useAppStore();
  const shortTask = toShortTask(todayTask);
  const score = calculateHealthScore(todayTask);
  const progress = completionPercentage(todayTask);
  const streak = streakSummary?.streak || 0;
  const xp = todayTask?.xp || 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
        <GlassCard className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(139,92,246,0.18),transparent_35%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm text-cyan-300/90">Hello, {user?.name || 'Glow seeker'}</p>
              <h2 className="mt-2 text-3xl font-bold text-white">Your skin and hair routine looks strong today.</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Stay consistent with hydration, protein, fruits, and greens. The AI coach will keep your plan personal and practical.
              </p>
            </div>
            <div className="flex justify-center">
              <ProgressRing value={score} label={scoreLabel(score)} />
            </div>
          </div>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <StatCard title="Daily score" value={`${score}/100`} hint="Dynamic health score from today's habits." />
          <StatCard title="Daily streak" value={`${streak} days`} hint="Consistency compounds, keep the streak alive." accent="from-cyan-400 to-primary" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Water intake" value={shortTask.water ? '3L' : '0L'} hint="Target: 3L for the day." accent="from-accent to-cyan-400" />
        <StatCard title="XP earned" value={xp} hint={`${progress}% of the checklist is complete.`} />
        <StatCard title="Completion" value={`${progress}%`} hint="Animated daily habit progress." accent="from-green-400 to-cyan-400" />
        <StatCard title="Health status" value={scoreLabel(score)} hint="Friendly wellness status, not a diagnosis." accent="from-fuchsia-500 to-cyan-400" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard>
          <div className="mb-4 flex items-center gap-2 text-white">
            <HeartPulse size={18} className="text-pink-300" />
            <h3 className="text-lg font-semibold">Daily task checklist</h3>
          </div>
          {loading ? <Skeleton className="h-80 w-full skeleton-shimmer" /> : <TaskChecklist tasks={shortTask} onToggle={toggleTask} />}
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <div className="mb-3 flex items-center gap-2 text-white">
              <Droplets size={18} className="text-cyan-300" />
              <h3 className="text-lg font-semibold">Health tips</h3>
            </div>
            {healthTip ? <HealthTip text={`${healthTip.title}: ${healthTip.description}`} /> : <Skeleton className="h-24 w-full skeleton-shimmer" />}
          </GlassCard>

          <GlassCard>
            <div className="mb-3 flex items-center gap-2 text-white">
              <Sparkles size={18} className="text-purple-300" />
              <h3 className="text-lg font-semibold">AI suggestions</h3>
            </div>
            <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              {streak >= 7 ? 'Your streak is building momentum. Keep the food and hydration pattern steady to protect it.' : 'Small actions today create a stronger glow and growth routine tomorrow.'}
            </p>
          </GlassCard>
        </div>
      </div>

      <FloatingAIButton />
    </div>
  );
}
