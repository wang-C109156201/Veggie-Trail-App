import axios from 'axios';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';  // 讀取 .env 變數

const openAI = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${EXPO_PUBLIC_OPENAI_API_KEY}`,
  },
});

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await openAI.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 50,
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
};
