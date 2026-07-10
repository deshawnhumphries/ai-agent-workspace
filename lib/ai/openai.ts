import { createOpenAI } from '@ai-sdk/openai';

let openaiClient: ReturnType<typeof createOpenAI> | null = null;

export function getOpenAIClient() {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }

    openaiClient = createOpenAI({
      apiKey,
    });
  }

  return openaiClient;
}

export function isApiKeyConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}
