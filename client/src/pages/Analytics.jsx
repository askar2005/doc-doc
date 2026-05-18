import GlassCard from '../components/ui/GlassCard';
import useAppStore from '../store/appStore';
import { ScoreTrendChart, WaterTrendChart, XpTrendChart } from '../components/charts/ScoreTrendChart';
import Skeleton from '../components/ui/Skeleton';

export default function Analytics() {
  const { weeklyAnalytics, monthlyAnalytics, streakSummary, taskHistory, loading } = useAppStore();
  const weeklyData = weeklyAnalytics?.data || [];
  const monthlyData = monthlyAnalytics?.data || [];

  return (
    <div className="space-y-4 sm:space-y-5">
      <GlassCard>
        <h2 className="text-lg font-semibold text-white sm:text-xl">Analytics</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">Weekly score, monthly trends, consistency, and XP progression.</p>
      </GlassCard>

      <div className="grid gap-3 xl:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">Health score trend</h3>
          {loading ? <Skeleton className="h-64 w-full skeleton-shimmer sm:h-72" /> : <ScoreTrendChart data={monthlyData.length ? monthlyData : weeklyData} height={240} />}
        </GlassCard>
        <GlassCard>
          <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">Water trend</h3>
          {loading ? <Skeleton className="h-64 w-full skeleton-shimmer sm:h-72" /> : <WaterTrendChart data={weeklyData.length ? weeklyData : monthlyData} height={240} />}
        </GlassCard>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <GlassCard>
          <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">XP progression</h3>
          {loading ? <Skeleton className="h-64 w-full skeleton-shimmer sm:h-72" /> : <XpTrendChart data={monthlyData.length ? monthlyData : weeklyData} height={240} />}
        </GlassCard>
        <GlassCard>
          <h3 className="mb-4 text-base font-semibold text-white sm:text-lg">Consistency heatmap</h3>
          <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
            {taskHistory.slice(0, 28).map((task) => (
              <div
                key={`${task.id}-heat`}
                className={`h-8 rounded-2xl border sm:h-10 ${task.consistency >= 85 ? 'border-emerald-400/20 bg-emerald-400/20' : task.consistency >= 60 ? 'border-cyan-400/20 bg-cyan-400/15' : 'border-white/10 bg-white/5'}`}
              />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <GlassCard>
          <div className="text-sm text-slate-400">Weekly average</div>
          <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{weeklyAnalytics?.summary?.averageScore || 0}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-slate-400">Monthly average</div>
          <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{monthlyAnalytics?.summary?.monthlyAverage || 0}</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-slate-400">Current streak</div>
          <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{streakSummary?.streak || 0} days</div>
        </GlassCard>
        <GlassCard>
          <div className="text-sm text-slate-400">Level badge</div>
          <div className="mt-2 text-2xl font-bold text-white sm:text-3xl">{streakSummary?.badge || 'Starter'}</div>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-base font-semibold text-white sm:text-lg">Streak calendar</h3>
        <div className="mt-4 grid grid-cols-7 gap-1.5 sm:gap-2">
          {taskHistory.slice(0, 28).map((task) => (
            <div
              key={task.id}
              className={`rounded-2xl border px-1.5 py-2 text-center text-[10px] sm:px-2 sm:py-3 sm:text-xs ${task.score >= 90 ? 'border-emerald-400/20 bg-emerald-400/10 text-emerald-100' : task.score >= 50 ? 'border-cyan-400/20 bg-cyan-400/10 text-cyan-100' : 'border-white/10 bg-white/5 text-slate-400'}`}
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
