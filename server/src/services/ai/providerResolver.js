import { generateWithGemini } from './geminiProvider.js';
import { generateWithOllama } from './ollamaProvider.js';

const providers = {
  gemini: generateWithGemini,
  ollama: generateWithOllama
};

export async function runAIProvider(prompt, preferredProvider = process.env.AI_PROVIDER || 'gemini') {
  const normalized = String(preferredProvider || 'gemini').toLowerCase();
  const ordered = normalized === 'ollama' ? ['ollama', 'gemini'] : ['gemini', 'ollama'];

  let lastError = null;

  for (const name of ordered) {
    const provider = providers[name];
    if (!provider) continue;

    try {
      const output = await provider(prompt);
      if (output && String(output).trim()) {
        return output;
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return '';
}
