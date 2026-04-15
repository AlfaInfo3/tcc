import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugSearch() {
  const query = 'a'; // Common letter to match something

  console.log('--- Debugging Users Search ---');
  const users = await prisma.adminUser.findMany({
    where: {
        OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
        ]
    }
  });
  console.log(`Found ${users.length} users`);

  console.log('--- Debugging Books Search ---');
  try {
      const books = await prisma.book.findMany({
        where: {
            OR: [
                { title: { contains: query, mode: 'insensitive' } },
                // Author is nullable, let's verify if this breaks anything
                { author: { contains: query, mode: 'insensitive' } }
            ]
        }
      });
      console.log(`Found ${books.length} books`);
  } catch(e) {
      console.error('Books search failed:', e);
  }

  console.log('--- Debugging Students Search ---');
  try {
      const students = await prisma.student.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { class: { contains: query, mode: 'insensitive' } }
            ]
        }
      });
      console.log(`Found ${students.length} students`);
  } catch(e) {
      console.error('Students search failed:', e);
  }
}

debugSearch()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
