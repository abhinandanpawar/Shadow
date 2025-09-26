import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Sends a prompt to the LLM and returns the content of the first choice.
 * @param prompt - The prompt to send to the language model.
 * @returns The suggestion from the language model, or a default error message.
 */
export async function getLLMSuggestions(prompt: string): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });

    return completion.choices[0]?.message?.content || 'No suggestions available.';
  } catch (error) {
    console.error('Error fetching LLM suggestions:', error);
    // In a real-world scenario, you might want to handle this more gracefully
    return 'Failed to fetch suggestions due to an error.';
  }
}