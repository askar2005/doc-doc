const weights = {
  water: 20,
  egg: 10,
  fruits: 15,
  vegetables: 15,
  sundal: 10,
  protein: 15,
  keerai: 15
};

const fieldMap = {
  water: 'waterCompleted',
  egg: 'eggCompleted',
  fruits: 'fruitsCompleted',
  vegetables: 'vegetablesCompleted',
  sundal: 'sundalCompleted',
  protein: 'proteinCompleted',
  keerai: 'keeraiCompleted'
};

export function normalizeTask(task = {}) {
  return Object.entries(fieldMap).reduce((acc, [shortKey, longKey]) => {
    acc[shortKey] = Boolean(task[longKey] ?? task[shortKey]);
    return acc;
  }, {});
}

export function calculateHealthScore(tasks = {}) {
  const normalized = normalizeTask(tasks);
  const entries = Object.entries(weights);
  return entries.reduce((total, [key, points]) => total + (normalized[key] ? points : 0), 0);
}

export function scoreLabel(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Average';
  return 'Needs Improvement';
}

export function completionPercentage(tasks = {}) {
  const normalized = normalizeTask(tasks);
  const total = Object.keys(weights).length;
  const done = Object.keys(weights).filter((key) => normalized[key]).length;
  return Math.round((done / total) * 100);
}

export function toShortTask(task = {}) {
  return normalizeTask(task);
}
