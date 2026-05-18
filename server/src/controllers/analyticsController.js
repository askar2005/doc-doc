import prisma from '../config/prisma.js';
import { currentStreak } from '../services/scoreService.js';
import { buildTaskHistory, summarizeTasks } from '../services/taskService.js';

function buildTrend(tasks = []) {
  return tasks.map((task) => ({
    day: task.dayKey,
    score: task.score || 0,
    xp: task.xp || 0,
    water: task.waterCompleted ? 3 : 0,
    fruits: task.fruitsCompleted ? 1 : 0,
    vegetables: task.vegetablesCompleted ? 1 : 0
  }));
}

export async function overview(req, res, next) {
  try {
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'asc' }
    });

    const history = buildTaskHistory(tasks);
    const summary = summarizeTasks(history);
    res.json({
      totalDays: tasks.length,
      completionRate: tasks.length ? Math.round((tasks.filter((task) => task.score >= 50).length / tasks.length) * 100) : 0,
      streak: currentStreak(tasks),
      trend: buildTrend(history),
      summary
    });
  } catch (error) {
    next(error);
  }
}

export async function weekly(req, res, next) {
  try {
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 7
    });

    const history = buildTaskHistory(tasks).reverse();

    res.json({
      data: history,
      summary: summarizeTasks(history)
    });
  } catch (error) {
    next(error);
  }
}

export async function monthly(req, res, next) {
  try {
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const history = buildTaskHistory(tasks).reverse();
    const summary = summarizeTasks(history);
    const monthlyAverage = summary.averageScore;

    res.json({
      data: history,
      summary: {
        ...summary,
        monthlyAverage
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function streak(req, res, next) {
  try {
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    const stats = await prisma.userStats.findUnique({ where: { userId: req.user.id } });

    res.json({
      streak: stats?.streak || currentStreak(tasks),
      longestStreak: stats?.longestStreak || 0,
      bonusXP: stats?.streak ? Math.round(stats.streak * 5) : 0,
      badge: (stats?.streak || 0) >= 21 ? 'Flame Master' : (stats?.streak || 0) >= 7 ? 'Hot Streak' : 'Starter'
    });
  } catch (error) {
    next(error);
  }
}
