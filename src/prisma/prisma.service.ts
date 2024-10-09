import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    Logger.log('PrismaService onModuleInit', 'PrismaService');
    await this.$connect();
  }
}
