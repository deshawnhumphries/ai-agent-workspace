import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import type { Agent, AgentExecutionContext } from '@/lib/agents/types';

const DEFAULT_MODEL = 'gpt-4o-mini';
const DEFAULT_TEMPERATURE = 0.7;

export class BaseAgent implements Agent {
  constructor(
    public readonly id: Agent['id'],
    public readonly systemPrompt: string,
  ) {}

  async execute(ctx: AgentExecutionContext): Promise<ReadableStream<Uint8Array>> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('AI service is not configured.');
    }

    const openai = createOpenAI({ apiKey });
    const model = ctx.model || DEFAULT_MODEL;
    const temperature = ctx.temperature ?? DEFAULT_TEMPERATURE;

    const result = streamText({
      model: openai(model),
      system: ctx.systemPrompt,
      messages: ctx.messages,
      temperature,
      onFinish: async ({ text }) => {
        if (text) {
          await ctx.onFinish(text);
        }
      },
    });

    return result.toTextStreamResponse().body!;
  }
}
