import { Module } from '@nestjs/common';
import { LangChainController } from './langchain.controller';
import { LangChainService } from './langchain.service';

@Module({
  imports: [],
  controllers: [LangChainController],
  providers: [LangChainService],
})
export class LangChainModule {}
