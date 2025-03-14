import axios from 'axios';

const API_KEY = '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';

const openAI = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export const generateText = async (prompt: string): Promise<string> => {
  try {
    const response = await openAI.post('/completions', {
      model: 'gpt-4',
      prompt,
      max_tokens: 150,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error generating text:', error);
    throw error;
  }
};
