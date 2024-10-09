import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { LangChainModule } from './langchain/langchain.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    LangChainModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
