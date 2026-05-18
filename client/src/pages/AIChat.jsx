import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { SendHorizonal } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import PrimaryButton from '../components/ui/PrimaryButton';
import Skeleton from '../components/ui/Skeleton';
import useAppStore from '../store/appStore';
import useAuthStore from '../store/authStore';
import useUiStore from '../store/uiStore';

function toConversation(history = []) {
  const entries = [...history].sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
  return entries.flatMap((item) => [
    { role: 'user', content: item.message, createdAt: item.createdAt },
    { role: 'assistant', content: item.response, createdAt: item.createdAt }
  ]);
}

function renderMessage(content = '', isUser = false) {
  const lines = String(content)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return content;
  }

  return lines.map((line, index) => {
    const isBullet = line.startsWith('- ');
    const text = isBullet ? line.slice(2) : line;
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

    return (
      <p key={`${index}-${text}`} className={isBullet ? `flex gap-2 pl-1 ${isUser ? 'text-white' : 'text-slate-100'}` : isUser ? 'text-white' : 'text-slate-100'}>
        {isBullet ? <span className={isUser ? 'text-white/80' : 'text-cyan-300'}>-</span> : null}
        <span>
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={`${partIndex}-${part}`} className={`font-semibold ${isUser ? 'text-white' : 'text-white'}`}>
                  {part.slice(2, -2)}
                </strong>
              );
            }

            return <span key={`${partIndex}-${part}`}>{part}</span>;
          })}
        </span>
      </p>
    );
  });
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-2 w-2 rounded-full bg-cyan-300"
          animate={{ y: [0, -4, 0], opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: index * 0.16 }}
        />
      ))}
    </div>
  );
}

export default function AIChat() {
  const user = useAuthStore((state) => state.user);
  const { aiHistory, sendChat, loadChatHistory, todayTask, weeklyAnalytics, streakSummary, loading } = useAppStore();
  const pushToast = useUiStore((state) => state.pushToast);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const conversation = useMemo(() => toConversation(aiHistory), [aiHistory]);

  useEffect(() => {
    if (!aiHistory.length) {
      loadChatHistory();
    }
  }, [aiHistory.length, loadChatHistory]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.length, sending]);

  const context = useMemo(
    () => ({
      profile: {
        name: user?.name,
        skinGoals: user?.skinGoals,
        hairGoals: user?.hairGoals
      },
      todayTask,
      weeklySummary: weeklyAnalytics?.summary,
      streakSummary
    }),
    [user, todayTask, weeklyAnalytics, streakSummary]
  );

  const send = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;

    const message = question.trim();
    setQuestion('');
    setSending(true);

    try {
      await sendChat(message, context);
    } catch (error) {
      pushToast({
        type: 'error',
        title: 'AI unavailable',
        message: error.response?.data?.message || error.message || 'Please try again'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
      <GlassCard className="flex min-h-[60vh] flex-col">
        <h2 className="text-lg font-semibold text-white sm:text-xl">AI Health Assistant</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Friendly wellness coach mode. No diagnosis, no medicine advice, only practical support.
        </p>

        <div className="mt-4 max-h-[55vh] flex-1 space-y-3 overflow-y-auto pr-1 sm:mt-5 sm:max-h-[60vh] sm:space-y-4 lg:max-h-[62vh]">
          {loading && !conversation.length ? (
            <Skeleton className="h-32 w-full skeleton-shimmer sm:h-36" />
          ) : null}

          {!loading && !conversation.length ? (
            <div className="max-w-[88%] rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-100 sm:max-w-[78%]">
              Hi, I am your wellness coach. Ask me how to improve skin glow, hair growth, hydration, or what to eat next.
            </div>
          ) : null}

          {conversation.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}-${message.createdAt}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className={[
                'max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] sm:text-[15px]',
                message.role === 'user'
                  ? 'ml-auto bg-gradient-to-r from-primary to-secondary text-white shadow-neon'
                  : 'border border-white/10 bg-white/5 text-slate-100 backdrop-blur-xl'
              ].join(' ')}
            >
              {message.pending ? <TypingDots /> : <div className="space-y-2 whitespace-pre-wrap break-words">{renderMessage(message.content, message.role === 'user')}</div>}
            </motion.div>
          ))}

          <div className="text-xs text-slate-500">Consult a certified doctor for serious medical concerns.</div>
          <div ref={bottomRef} />
        </div>

        <form onSubmit={send} className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 pb-[env(safe-area-inset-bottom)] sm:flex-row sm:items-center">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about skin, hair, food, or routine"
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-[#0B0F1A]/60 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50 sm:text-base"
          />
          <PrimaryButton type="submit" disabled={sending} className="w-full sm:w-auto">
            <SendHorizonal size={16} />
          </PrimaryButton>
        </form>
      </GlassCard>

      <div className="space-y-3 sm:space-y-4">
        <GlassCard>
          <h3 className="text-base font-semibold text-white sm:text-lg">Context snapshot</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <StatLine label="Goal" value={user?.hairGoals || user?.skinGoals || 'Wellness'} />
            <StatLine label="Weekly streak" value={`${streakSummary?.streak || 0} days`} />
            <StatLine label="Weekly average" value={weeklyAnalytics?.summary?.averageScore || 0} />
            <StatLine label="Latest history" value={aiHistory.length || 0} />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-base font-semibold text-white sm:text-lg">Example prompts</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            {['How to improve hair growth?', 'Why is my skin dull?', 'Best foods for glowing skin?', 'What should I eat tomorrow?'].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuestion(example)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm leading-6 transition hover:border-cyan-300/40 hover:bg-white/10"
              >
                {example}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function StatLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-slate-400">{label}</span>
      <span className="min-w-0 break-words text-right text-white">{value}</span>
    </div>
  );
}
