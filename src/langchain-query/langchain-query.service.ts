import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { OpenAI } from 'openai';
// import { traceable } from 'langsmith/traceable';
// import { wrapOpenAI } from 'langsmith/wrappers';
import { BasicMessageDto } from './dto/query.dto';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { getSuccessResponse } from '../common/utils/common-function';

@Injectable()
export class LangChainQueryService {
  async query(basicMessageDto: BasicMessageDto) {
    try {
      const prompt = PromptTemplate.fromTemplate('BASIC_CHAT_TEMPLATE');

      const model = new ChatOpenAI({
        // temperature: +openAI.BASIC_CHAT_OPENAI_TEMPERATURE,
        modelName: 'gpt-3.5-turbo', //openAI.GPT_3_5_TURBO_1106.toString(),
      });

      const outputParser = new HttpResponseOutputParser();
      const chain = prompt.pipe(model).pipe(outputParser);
      const response = await chain.invoke({
        input: basicMessageDto.query,
      });
      return getSuccessResponse(
        HttpStatus.OK,

        Object.values(response)
          .map((code) => String.fromCharCode(code))
          .join(''),
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async test(): Promise<any> {
  //   console.log('Testing...', process.env.OPENAI_API_KEY);
  //   // Auto-trace LLM calls in-context
  //   const client = wrapOpenAI(
  //     new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
  //   );

  //   // Auto-trace this function
  //   const pipeline = traceable(async (user_input) => {
  //     const result = await client.chat.completions.create({
  //       messages: [{ role: 'user', content: user_input }],
  //       model: 'gpt-3.5-turbo',
  //     });
  //     return result.choices[0].message.content;
  //   });

  //   await pipeline;

  //   console.log('...ending.');
  //   // Out: Hello there! How can I assist you today?
  //   return 'Hello World!';
  // }
}
