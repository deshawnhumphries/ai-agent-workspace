import { openai as openaiProvider } from '@ai-sdk/openai';

export const models = {
  chat: {
    primary: openaiProvider('gpt-4o-mini'),
    alternative: openaiProvider('gpt-4o'),
  },
};

export type ChatModel = keyof typeof models.chat;

export function getChatModel(model: ChatModel = 'primary') {
  return models.chat[model];
}
