import { generateWithOllama } from './ollamaProvider.js';
import { buildPrompt } from './promptBuilder.js';

export async function generateAIResponse({ user, todayTask, weeklySummary, monthlySummary, streakSummary, question, recentPatterns, recentConversation, context }) {
  const prompt = buildPrompt({
    user,
    todayTask,
    weeklySummary,
    monthlySummary,
    streakSummary,
    question,
    recentPatterns,
    recentConversation,
    context
  });

  try {
    const response = await generateWithOllama(prompt);
    if (response) return normalizeResponse(response);
  } catch (error) {
    // Fall through to a safe canned response.
  }

  return 'Focus on water, fruits, vegetables, protein, and sleep today. Consult a certified doctor for serious medical concerns.';
}

function normalizeResponse(text) {
  const cleaned = String(text)
    .replace(/\r/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const words = cleaned.split(/\s+/);
  if (words.length <= 120) {
    return cleaned;
  }

  return `${words.slice(0, 120).join(' ')}...`;
}
