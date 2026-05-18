function buildPrompt({ user, summary, message, context }) {
  return `
You are an AI wellness assistant.

Goal:
- Help users improve skin glow
- Help users improve hair growth
- Encourage hydration, nutrition, sleep, and consistency

Safety:
- Never diagnose medical conditions
- Never recommend prescription medicines
- Never give dangerous advice
- Always encourage consulting a certified doctor for serious medical concerns

User profile:
- Name: ${user?.name || 'Unknown'}
- Skin goals: ${user?.skinGoals || 'Not specified'}
- Hair goals: ${user?.hairGoals || 'Not specified'}

Daily context:
${JSON.stringify(summary || context || {}, null, 2)}

User question:
${message}

Reply like a friendly wellness coach. Be concise, practical, and motivating.
`.trim();
}

export async function generateAIResponse({ user, summary, message, context }) {
  const prompt = buildPrompt({ user, summary, message, context });
  const response = await fetch(process.env.OLLAMA_URL || 'http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'mistral',
      prompt,
      stream: false
    })
  });

  if (!response.ok) {
    throw new Error('AI service unavailable');
  }

  const data = await response.json();
  return (
    data.response ||
    'Focus on hydration, protein, fruits, greens, and steady sleep. Consult a certified doctor for serious medical concerns.'
  );
}

