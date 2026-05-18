import prisma from '../config/prisma.js';
import { calculateTaskMetrics, currentStreak } from './scoreService.js';
import { getDayKey } from '../utils/time.js';

export const taskFieldMap = {
  water: 'waterCompleted',
  egg: 'eggCompleted',
  fruits: 'fruitsCompleted',
  vegetables: 'vegetablesCompleted',
  sundal: 'sundalCompleted',
  protein: 'proteinCompleted',
  keerai: 'keeraiCompleted'
};

export const taskLabelMap = {
  water: 'Drink 3L water',
  egg: 'Eat boiled egg',
  fruits: 'Eat 2 fruits',
  vegetables: 'Eat vegetables',
  sundal: 'Eat sundal',
  protein: 'Eat fish or mutton',
  keerai: 'Weekly keerai tracking'
};

export function createBlankTask(userId, dayKey = getDayKey()) {
  return prisma.dailyTask.create({
    data: {
      userId,
      dayKey
    }
  });
}

export async function getOrCreateTodayTask(userId) {
  const dayKey = getDayKey();
  const existing = await prisma.dailyTask.findUnique({
    where: {
      userId_dayKey: {
        userId,
        dayKey
      }
    }
  });

  if (existing) return existing;
  return createBlankTask(userId, dayKey);
}

export function hydrateTaskMetrics(task, streak = 0) {
  const metrics = calculateTaskMetrics(task, streak);
  return {
    ...task,
    ...metrics
  };
}

export function buildTaskHistory(tasks = []) {
  return tasks.map((task) => hydrateTaskMetrics(task));
}

export function summarizeTasks(tasks = []) {
  const totalDays = tasks.length;
  const averageScore = totalDays ? Math.round(tasks.reduce((sum, task) => sum + (task.score || 0), 0) / totalDays) : 0;
  const averageConsistency = totalDays ? Math.round(tasks.reduce((sum, task) => sum + (task.consistency || 0), 0) / totalDays) : 0;
  const streak = currentStreak(tasks);

  return {
    averageScore,
    averageConsistency,
    consistency: averageConsistency,
    streak,
    totalDays
  };
}

