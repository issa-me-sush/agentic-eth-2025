import { AI_CONFIG } from '../../config/ai.config';
import OpenAI from 'openai';
// import type { ChatCompletionMessageParam } from 'openai/resources';
import { ChatCompletionMessageParam } from 'openai/src/resources/index.js';
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const processMessageStream = async (
  stream: AsyncIterable<any>,
  onChunk: (content: string) => void
) => {
  try {
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Stream processing error:', error);
    throw error;
  }
};

export const createCompletion = async (
  messages: ChatCompletionMessageParam[],
  options = {}
) => {
  try {
    console.log('Creating completion with model:', AI_CONFIG.model.name);
    
    return await openai.chat.completions.create({
      model: AI_CONFIG.model.name,
      messages,
      temperature: AI_CONFIG.model.temperature,
      stream: true,
      ...options,
    });
  } catch (error) {
    console.error('Completion creation error:', error);
    throw error;
  }
}; 