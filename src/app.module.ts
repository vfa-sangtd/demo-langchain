import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { LangChainQueryModule } from './langchain-query/langchain-query.module';
import { LangChainDataProcessingModule } from './langchain-data-processing/langchain-data-processing.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    LangChainQueryModule,
    LangChainDataProcessingModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
