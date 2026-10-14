import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the global object in development to prevent
// exhausting database connection limits across hot-reloads.
declare global {
  var prisma: PrismaClient | undefined;
}

const connectionUrl = process.env.DATABASE_URL || process.env.URL_DO_BANCO_DE_DADOS;

const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: connectionUrl
      ? {
          db: {
            url: connectionUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };