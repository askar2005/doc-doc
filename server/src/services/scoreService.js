import { getDayKey } from '../utils/time.js';

const pointsMap = {
  waterCompleted: 20,
  eggCompleted: 10,
  fruitsCompleted: 15,
  vegetablesCompleted: 15,
  sundalCompleted: 10,
  proteinCompleted: 15,
  keeraiCompleted: 15
};

export function calculateTaskScore(task = {}) {
  return Object.entries(pointsMap).reduce((total, [key, points]) => total + (task[key] ? points : 0), 0);
}

export function scoreStatus(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  return 'Poor';
}

export function calculateConsistency(task = {}) {
  const total = Object.keys(pointsMap).length;
  const completed = Object.keys(pointsMap).filter((key) => task[key]).length;
  return total ? Math.round((completed / total) * 100) : 0;
}

export function calculateXP(task = {}, streakMultiplier = 1) {
  const base = calculateTaskScore(task);
  return Math.round(base + base * 0.1 * Math.max(streakMultiplier - 1, 0));
}

export function getStreakMultiplier(streak = 0) {
  if (streak >= 21) return 1.5;
  if (streak >= 7) return 1.25;
  return 1;
}

export function calculateTaskMetrics(task = {}, streak = 0) {
  const score = calculateTaskScore(task);
  const consistency = calculateConsistency(task);
  const streakMultiplier = getStreakMultiplier(streak);
  const xp = calculateXP(task, streakMultiplier);
  return { score, consistency, streakMultiplier, xp };
}

export function currentStreak(tasks = []) {
  const uniqueDays = [...new Set(tasks.map((task) => task.dayKey))].sort((a, b) => String(b).localeCompare(String(a)));
  if (!uniqueDays.length) return 0;

  let streak = 1;
  let cursor = new Date(`${uniqueDays[0]}T00:00:00.000Z`);

  for (let index = 1; index < uniqueDays.length; index += 1) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    const expected = getDayKey(cursor);
    if (uniqueDays[index] === expected) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}
