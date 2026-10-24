import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Prisma 7 no longer accepts a bare connection string: the client needs a
 * driver adapter, which is built here from the same POSTGRES_URL that
 * prisma.config.ts hands to the CLI.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error(
        'POSTGRES_URL is not set; cannot connect to the database.',
      );
    }

    super({ adapter: new PrismaPg({ connectionString }) });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
