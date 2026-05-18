import GlassCard from '../components/ui/GlassCard';
import useAuthStore from '../store/authStore';
import useAppStore from '../store/appStore';

export default function Profile() {
  const user = useAuthStore((state) => state.user);
  const stats = useAuthStore((state) => state.stats);
  const reminderSettings = useAppStore((state) => state.reminderSettings);

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <GlassCard>
        <h2 className="text-lg font-semibold text-white sm:text-xl">Profile</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="Name" value={user?.name || '-'} />
          <Info label="Email" value={user?.email || '-'} />
          <Info label="Age" value={user?.age ?? '-'} />
          <Info label="Gender" value={user?.gender || '-'} />
          <Info label="Skin goals" value={user?.skinGoals || '-'} />
          <Info label="Hair goals" value={user?.hairGoals || '-'} />
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-base font-semibold text-white sm:text-lg">User Stats</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Info label="Level" value={stats?.level || 'Bronze'} />
          <Info label="Streak" value={`${stats?.streak || 0} days`} />
          <Info label="Longest streak" value={`${stats?.longestStreak || 0} days`} />
          <Info label="Total XP" value={stats?.totalXP || 0} />
          <Info label="Completed tasks" value={stats?.totalCompletedTasks || 0} />
          <Info label="Average score" value={Math.round(stats?.averageScore || 0)} />
        </div>

        <h3 className="mt-6 text-base font-semibold text-white sm:text-lg">Reminder Snapshot</h3>
        <div className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
          {Object.entries({
            waterReminder: 'Water reminder',
            fruitReminder: 'Fruit reminder',
            sleepReminder: 'Sleep reminder',
            keeraiReminder: 'Weekly keerai reminder'
          }).map(([key, label]) => {
            const enabled = reminderSettings[key];
            return (
              <div key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <span>{label}</span>
                <span className={enabled ? 'text-emerald-300' : 'text-slate-500'}>{enabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.25em] text-slate-500">{label}</div>
      <div className="mt-1 break-words text-sm text-white sm:text-base">{value}</div>
    </div>
  );
}
