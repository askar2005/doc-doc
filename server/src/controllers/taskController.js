import prisma from '../config/prisma.js';
import { calculateTaskMetrics, scoreStatus } from '../services/scoreService.js';
import { buildTaskHistory, getOrCreateTodayTask, summarizeTasks, taskFieldMap } from '../services/taskService.js';
import { getOrCreateUserStats, syncUserStats, streakBonusXP } from '../services/statsService.js';
import { getDayKey } from '../utils/time.js';

export async function getTodayTask(req, res, next) {
  try {
    const task = await getOrCreateTodayTask(req.user.id);
    const stats = await getOrCreateUserStats(req.user.id);
    const metrics = calculateTaskMetrics(task, stats.streak);
    res.json({
      task: {
        ...task,
        ...metrics,
        status: scoreStatus(metrics.score)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const { key, completed } = req.body;
    const field = taskFieldMap[key];

    if (!field) {
      return res.status(400).json({ message: 'Invalid task key' });
    }

    const task = await getOrCreateTodayTask(req.user.id);
    const timestampField = `${field}At`;
    const currentStats = await getOrCreateUserStats(req.user.id);

    const updated = await prisma.dailyTask.update({
      where: { id: task.id },
      data: {
        [field]: Boolean(completed),
        [timestampField]: completed ? new Date() : null
      }
    });

    const metrics = calculateTaskMetrics(updated, currentStats.streak);
    const bonusXP = completed ? streakBonusXP(currentStats.streak) : 0;
    const scored = await prisma.dailyTask.update({
      where: { id: task.id },
      data: {
        score: metrics.score,
        consistency: metrics.consistency,
        streakMultiplier: metrics.streakMultiplier,
        xp: metrics.xp + bonusXP
      }
    });

    await syncUserStats(req.user.id);
    res.json({
      task: {
        ...scored,
        status: scoreStatus(scored.score)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function history(req, res, next) {
  try {
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 90
    });

    res.json({
      tasks: buildTaskHistory(tasks),
      summary: summarizeTasks(tasks)
    });
  } catch (error) {
    next(error);
  }
}

export async function summary(req, res, next) {
  try {
    const tasks = await prisma.dailyTask.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    res.json({
      tasks: buildTaskHistory(tasks),
      summary: summarizeTasks(tasks),
      currentDayKey: getDayKey()
    });
  } catch (error) {
    next(error);
  }
}
