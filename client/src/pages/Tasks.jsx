import GlassCard from '../components/ui/GlassCard';
import TaskChecklist from '../components/dashboard/TaskChecklist';
import useAppStore from '../store/appStore';
import useUiStore from '../store/uiStore';
import { toShortTask } from '../utils/score';

export default function Tasks() {
  const { todayTask, toggleTask, reminderSettings, setReminderSettings } = useAppStore();
  const pushToast = useUiStore((state) => state.pushToast);
  const shortTask = toShortTask(todayTask);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      pushToast({ type: 'warning', title: 'Notifications unavailable', message: 'This browser does not support notifications.' });
      return;
    }

    const permission = await Notification.requestPermission();
    pushToast({
      type: permission === 'granted' ? 'success' : 'warning',
      title: 'Notification setting',
      message: permission === 'granted' ? 'Browser reminders enabled.' : 'Notification permission not granted.'
    });
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <GlassCard>
        <h2 className="text-xl font-semibold text-white">Daily Tasks</h2>
        <p className="mt-2 text-sm text-slate-400">Tap each task to track consistency and XP.</p>
        <div className="mt-5">
          <TaskChecklist tasks={shortTask} onToggle={toggleTask} />
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white">Reminder Settings</h3>
        <p className="mt-2 text-sm text-slate-400">Browser reminders are stored locally and can be expanded into push notifications later.</p>
        <div className="mt-5 space-y-3">
          {[
            ['waterReminder', 'Water reminder'],
            ['fruitReminder', 'Fruit reminder'],
            ['sleepReminder', 'Sleep reminder'],
            ['keeraiReminder', 'Weekly keerai reminder']
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setReminderSettings({ [key]: !reminderSettings[key] })}
              className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left transition hover:bg-white/10"
            >
              <span className="text-sm text-white">{label}</span>
              <span className={`rounded-full px-3 py-1 text-xs ${reminderSettings[key] ? 'bg-emerald-400/20 text-emerald-200' : 'bg-white/5 text-slate-400'}`}>
                {reminderSettings[key] ? 'On' : 'Off'}
              </span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={requestNotificationPermission}
          className="mt-5 w-full rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50 transition hover:bg-cyan-400/15"
        >
          Enable browser notifications
        </button>
      </GlassCard>
    </div>
  );
}
