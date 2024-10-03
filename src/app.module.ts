import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LangChainChatModule } from './langchain-chat/langchain-chat.module';
import { AppController } from './app.controller';

@Module({
  imports: [ConfigModule.forRoot(), LangChainChatModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
