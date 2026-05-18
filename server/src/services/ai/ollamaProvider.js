export async function generateWithOllama(prompt) {
  const response = await fetch(process.env.OLLAMA_URL || 'http://localhost:11434/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'mistral',
      prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 120,
        top_p: 0.9
      }
    })
  });

  if (!response.ok) {
    throw new Error('AI service unavailable');
  }

  const data = await response.json();
  return data.response || '';
}
