import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the global object in development to prevent
// exhausting your database connection limit in development.
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: ['warn', 'error'],
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma };