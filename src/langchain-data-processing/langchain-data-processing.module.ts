import { Module } from '@nestjs/common';
import { LangChainDataProcessingController } from './langchain-data-processing.controller';
import { LangChainDataProcessingService } from './langchain-data-processing.service';

@Module({
  imports: [],
  controllers: [LangChainDataProcessingController],
  providers: [LangChainDataProcessingService],
})
export class LangChainDataProcessingModule {}
