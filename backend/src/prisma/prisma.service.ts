import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Prisma 7 needs a driver adapter at runtime. We keep the pool small so a
// serverless deploy doesn't run the database out of connections.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        'DATABASE_URL is not set. Copy .env.example to .env and fill it in.',
      );
    }
    super({ adapter: new PrismaPg({ connectionString: url, max: 5 }) });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
