import { GoogleGenerativeAI } from '@google/generative-ai';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  return new GoogleGenerativeAI(apiKey);
}

export async function generateWithGemini(prompt) {
  const genAI = getGeminiClient();
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash'
  });

  const result = await model.generateContent({
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 120
    }
  });

  const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || '';
  return String(text).trim();
}
