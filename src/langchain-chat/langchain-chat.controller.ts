import { Controller, Get, Post } from '@nestjs/common';
import { LangChainChatService } from './langchain-chat.service';

@Controller('/chat')
export class LangChainChatController {
  constructor(private readonly appService: LangChainChatService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async test(): Promise<any> {
    return this.appService.test();
  }
}
