import { Module } from '@nestjs/common';
import { LangChainChatController } from './langchain-chat.controller';
import { LangChainChatService } from './langchain-chat.service';

@Module({
  imports: [],
  controllers: [LangChainChatController],
  providers: [LangChainChatService],
})
export class LangChainChatModule {}
