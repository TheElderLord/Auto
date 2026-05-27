import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@kazparts/db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[PrismaService] Database connection failed at startup: ${message}`);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
