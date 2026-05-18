import prisma from '../config/prisma.js';
import { currentStreak } from './scoreService.js';

export async function getOrCreateUserStats(userId) {
  const existing = await prisma.userStats.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.userStats.create({
    data: {
      userId
    }
  });
}

export async function syncUserStats(userId) {
  const [tasks, stats] = await Promise.all([
    prisma.dailyTask.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    getOrCreateUserStats(userId)
  ]);

  const totalCompletedTasks = tasks.reduce((sum, task) => {
    const completed = [
      task.waterCompleted,
      task.eggCompleted,
      task.fruitsCompleted,
      task.vegetablesCompleted,
      task.sundalCompleted,
      task.proteinCompleted,
      task.keeraiCompleted
    ].filter(Boolean).length;
    return sum + completed;
  }, 0);

  const averageScore = tasks.length ? tasks.reduce((sum, task) => sum + (task.score || 0), 0) / tasks.length : 0;
  const streak = currentStreak(tasks);
  const longestStreak = Math.max(stats.longestStreak || 0, streak);
  const totalXP = tasks.reduce((sum, task) => sum + (task.xp || 0), 0);

  return prisma.userStats.update({
    where: { userId },
    data: {
      streak,
      longestStreak,
      totalXP,
      totalCompletedTasks,
      averageScore,
      level: levelFromXP(totalXP)
    }
  });
}

export function levelFromXP(totalXP = 0) {
  if (totalXP >= 2500) return 'Diamond';
  if (totalXP >= 1400) return 'Gold';
  if (totalXP >= 600) return 'Silver';
  return 'Bronze';
}

export function streakBonusXP(streak = 0) {
  if (streak >= 21) return 60;
  if (streak >= 14) return 40;
  if (streak >= 7) return 20;
  return 0;
}
