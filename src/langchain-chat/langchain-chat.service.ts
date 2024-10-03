import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { traceable } from 'langsmith/traceable';
import { wrapOpenAI } from 'langsmith/wrappers';

@Injectable()
export class LangChainChatService {
  getHello(): string {
    return 'Hello World!';
  }

  async test(): Promise<any> {
    console.log('Testing...', process.env.OPENAI_API_KEY);
    // Auto-trace LLM calls in-context
    const client = wrapOpenAI(
      new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    );

    // Auto-trace this function
    const pipeline = traceable(async (user_input) => {
      const result = await client.chat.completions.create({
        messages: [{ role: 'user', content: user_input }],
        model: 'gpt-3.5-turbo',
      });
      return result.choices[0].message.content;
    });

    await pipeline;

    console.log('...ending.');
    // Out: Hello there! How can I assist you today?
    return 'Hello World!';
  }
}
