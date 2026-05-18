const taskLabels = {
  waterCompleted: 'water',
  eggCompleted: 'egg',
  fruitsCompleted: 'fruits',
  vegetablesCompleted: 'vegetables',
  sundalCompleted: 'sundal',
  proteinCompleted: 'protein',
  keeraiCompleted: 'keerai'
};

const casualPatterns = [
  /\bwhat('?s| is) your name\b/i,
  /\bwho are you\b/i,
  /^\s*hi\b/i,
  /^\s*hello\b/i,
  /\bhow are you\b/i
];

const wellnessPatterns = [
  /\bhair growth\b/i,
  /\bskin\b/i,
  /\bglow\b/i,
  /\bdull\b/i,
  /\bhydration\b/i,
  /\bwellness\b/i
];

const dietPatterns = [
  /\bwhat should i eat\b/i,
  /\bsuggest (?:a )?meal\b/i,
  /\bbreakfast\b/i,
  /\blunch\b/i,
  /\bdinner\b/i,
  /\bfood\b/i,
  /\bdiet\b/i
];

function getTaskSummary(todayTask = {}) {
  const completed = [];
  const missed = [];

  for (const [field, label] of Object.entries(taskLabels)) {
    if (todayTask[field]) {
      completed.push(label);
    } else {
      missed.push(label);
    }
  }

  return { completed, missed };
}

export function isCasualQuestion(question = '') {
  return casualPatterns.some((pattern) => pattern.test(question.trim())) || question.trim().split(/\s+/).length <= 3;
}

export function isDietQuestion(question = '') {
  return dietPatterns.some((pattern) => pattern.test(question));
}

export function isWellnessQuestion(question = '') {
  return wellnessPatterns.some((pattern) => pattern.test(question));
}

function pickRecentFacts(items = [], limit = 3) {
  return items.filter(Boolean).slice(0, limit);
}

function buildCasualPrompt(question) {
  return `
You are Doc-Doc AI, a friendly wellness assistant.

Rules:
- Answer the user's actual question directly.
- Keep responses short and natural.
- Use 2-6 lines unless the user asks for detail.
- Avoid long motivational speeches.
- Be conversational and supportive.
- Never diagnose diseases.
- Never prescribe medicines.
- Suggest consulting a doctor only for serious medical concerns.
- Sound human, modern, and friendly.
- Keep the response under 120 words unless the user explicitly asks for a detailed explanation.

User question:
${question}

If the user asks your name or who you are, answer like:
"I'm Doc-Doc AI :) Your wellness assistant for skin glow, hair growth, and healthy habits."

Respond in a casual, human tone.
`.trim();
}

function buildWellnessPrompt({ user, todayTask, streakSummary, weeklySummary, question, recentConversation = [] }) {
  const { completed, missed } = getTaskSummary(todayTask);
  const relevantFacts = [];

  if (completed.includes('fruits') || missed.includes('fruits')) relevantFacts.push(`Fruits today: ${completed.includes('fruits') ? 'completed' : 'missed'}`);
  if (completed.includes('vegetables') || missed.includes('vegetables')) relevantFacts.push(`Vegetables today: ${completed.includes('vegetables') ? 'completed' : 'missed'}`);
  if (completed.includes('protein') || missed.includes('protein')) relevantFacts.push(`Protein today: ${completed.includes('protein') ? 'completed' : 'missed'}`);
  if (completed.includes('water') || missed.includes('water')) relevantFacts.push(`Water today: ${completed.includes('water') ? 'completed' : 'missed'}`);

  const weeklyFacts = [
    streakSummary?.streak ? `Streak: ${streakSummary.streak} days` : null,
    weeklySummary?.averageScore != null ? `Weekly average score: ${weeklySummary.averageScore}` : null,
    weeklySummary?.consistency != null ? `Weekly consistency: ${weeklySummary.consistency}%` : null
  ].filter(Boolean);

  return `
You are Doc-Doc AI, a friendly wellness assistant.

Your role:
- help users with skin glow
- help users with hair growth
- suggest healthy habits
- answer wellness questions naturally

Rules:
- Answer the user's actual question directly.
- Keep responses short and natural.
- Use 2-6 lines unless the user asks for detail.
- Avoid repeating hydration/sleep/protein advice unless relevant.
- Avoid long motivational speeches.
- Be conversational and supportive.
- Casual questions should receive casual answers.
- Health questions should receive practical answers.
- Never diagnose diseases.
- Never prescribe medicines.
- Suggest consulting a doctor only for serious medical concerns.
- Sound human, modern, and friendly.
- Keep the response under 120 words unless the user explicitly asks for a detailed explanation.

User:
- Name: ${user?.name || 'Unknown'}
- Goal: ${user?.hairGoals || user?.skinGoals || 'General wellness'}

Relevant context:
${relevantFacts.length ? relevantFacts.slice(0, 4).map((item) => `- ${item}`).join('\n') : '- No relevant task context'}
${weeklyFacts.length ? `\nWeekly context:\n${pickRecentFacts(weeklyFacts, 3).map((item) => `- ${item}`).join('\n')}` : ''}
${recentConversation.length ? `\nRecent conversation:\n${recentConversation.map((item) => `- ${item.role}: ${item.content}`).join('\n')}` : ''}

User question:
${question}

Respond naturally, with one clear answer first and a small follow-up suggestion only if useful.
`.trim();
}

function buildDietPrompt({ user, todayTask, recentConversation = [], recentPatterns = [], question }) {
  const { completed, missed } = getTaskSummary(todayTask);
  const dietFacts = [
    completed.includes('fruits') ? 'Fruits completed today' : missed.includes('fruits') ? 'Fruits missed today' : null,
    completed.includes('vegetables') ? 'Vegetables completed today' : missed.includes('vegetables') ? 'Vegetables missed today' : null,
    completed.includes('protein') ? 'Protein completed today' : missed.includes('protein') ? 'Protein missed today' : null,
    completed.includes('water') ? 'Water completed today' : missed.includes('water') ? 'Water missed today' : null
  ].filter(Boolean);

  return `
You are Doc-Doc AI, a friendly wellness assistant.

Rules:
- Answer the user's actual question directly.
- Keep responses short and natural.
- Use 2-6 lines unless the user asks for detail.
- Avoid repeating hydration/sleep/protein advice unless relevant.
- Avoid long motivational speeches.
- Be conversational and supportive.
- Never diagnose diseases.
- Never prescribe medicines.
- Suggest consulting a doctor only for serious medical concerns.
- Keep the response under 120 words unless the user explicitly asks for a detailed explanation.

User question:
${question}

Relevant diet context:
${dietFacts.length ? dietFacts.slice(0, 4).map((item) => `- ${item}`).join('\n') : '- No recent diet context'}
${recentPatterns.length ? `\nRecent meal/habit patterns:\n${recentPatterns.slice(0, 3).map((item) => `- ${item}`).join('\n')}` : ''}
${recentConversation.length ? `\nRecent conversation:\n${recentConversation.map((item) => `- ${item.role}: ${item.content}`).join('\n')}` : ''}

Respond with practical meal suggestions that fit a glow and hair-growth wellness plan.
`.trim();
}

export function buildPrompt({
  user,
  todayTask,
  weeklySummary,
  streakSummary,
  question,
  recentPatterns = [],
  recentConversation = []
}) {
  const normalizedQuestion = question || '';

  if (isCasualQuestion(normalizedQuestion)) {
    return buildCasualPrompt(normalizedQuestion);
  }

  if (isDietQuestion(normalizedQuestion)) {
    return buildDietPrompt({
      user,
      todayTask,
      recentConversation: pickRecentFacts(recentConversation, 3),
      recentPatterns,
      question: normalizedQuestion
    });
  }

  if (isWellnessQuestion(normalizedQuestion)) {
    return buildWellnessPrompt({
      user,
      todayTask,
      streakSummary,
      weeklySummary,
      question: normalizedQuestion,
      recentConversation: pickRecentFacts(recentConversation, 3)
    });
  }

  return `
You are Doc-Doc AI, a friendly wellness assistant.

Rules:
- Answer the user's actual question directly.
- Keep responses short and natural.
- Use 2-6 lines unless the user asks for detail.
- Avoid repetitive advice.
- Never diagnose diseases.
- Never prescribe medicines.
- Keep the response under 120 words unless the user explicitly asks for a detailed explanation.

User question:
${normalizedQuestion}

Recent context:
${pickRecentFacts(recentConversation, 3).map((item) => `- ${item.role}: ${item.content}`).join('\n') || '- None'}

Respond naturally and directly.
`.trim();
}
