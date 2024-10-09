import { Module } from '@nestjs/common';
import { LangChainQueryController } from './langchain-query.controller';
import { LangChainQueryService } from './langchain-query.service';

@Module({
  imports: [],
  controllers: [LangChainQueryController],
  providers: [LangChainQueryService],
})
export class LangChainQueryModule {}
