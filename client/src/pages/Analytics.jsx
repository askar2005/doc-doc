import GlassCard from '../components/ui/GlassCard';
import useAppStore from '../store/appStore';
import { ScoreTrendChart, WaterTrendChart, XpTrendChart } from '../components/charts/ScoreTrendChart';
import Skeleton from '../components/ui/Skeleton';

export default function Analytics() {
  const { weeklyAnalytics, monthlyAnalytics, streakSummary, taskHistory, loading } = useAppStore();
  const weeklyData = weeklyAnalytics?.data || [];
  const monthlyData = monthlyAnalytics?.data || [];

  return (
    <div className="space-y-4">
      <GlassCard>
        <h2 className="text-xl font-semibold text-white">Analytics</h2>
        <p className="mt-2 text-sm text-slate-400">Weekly score, monthly trends, consistency, and XP progression.</p>
      </GlassCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold text-white">Health score trend</h3>
          {loading ? <Skeleton className="h-72 w-full skeleton-shimmer" /> : <ScoreTrendChart data={monthlyData.length ? monthlyData : weeklyData} />}
        </GlassCard>
        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold text-white">Water trend</h3>
          {loading ? <Skeleton className="h-72 w-full skeleton-shimmer" /> : <WaterTrendChart data={weeklyData.length ? weeklyData : monthlyData} />}
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold text-white">XP progression</h3>
          {loading ? <Skeleton className="h-72 w-full skeleton-shimmer" /> : <XpTrendChart data={monthlyData.length ? monthlyData : weeklyData} />}
        </GlassCard>
        <GlassCard>
          <h3 className="mb-4 text-lg font-semibold text-white">Consistency heatmap</h3>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {taskHistory.slice(0, 28).map((task) => (
              <div
                key={`${task.id}-heat`}
                className={`h-10 rounded-2xl border ${task.consistency >= 85 ? 'border-emerald-400/20 bg-emerald-400/20' : task.consistency >= 60 ? 'border-cyan-400/20 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}
              />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <GlassCard>
          <div className="text-sm text-slate-400">Weekly average</div>
          <div className="mt-2 text-3xl font-bold text-white">{weeklyAnalytics?.summary?.averageScore || 0}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-slate-400">Monthly average</div>
          <div className="mt-2 text-3xl font-bold text-white">{monthlyAnalytics?.summary?.monthlyAverage || 0}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-slate-400">Current streak</div>
          <div className="mt-2 text-3xl font-bold text-white">{streakSummary?.streak || 0} days</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-slate-400">Level badge</div>
          <div className="mt-2 text-3xl font-bold text-white">{streakSummary?.badge || 'Starter'}</div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white">Streak calendar</h3>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {taskHistory.slice(0, 28).map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl border px-2 py-3 text-center text-xs ${task.score >= 90 ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : task.score >= 50 ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100' : 'border-white/10 bg-white/5 text-slate-400'}`}
            >
              <div>{task.dayKey}</div>
              <div className="mt-1 font-semibold">{task.score}</div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
