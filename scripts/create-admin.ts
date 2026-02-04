import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@escola.com';
  const password = 'admin'; // Senha simples para teste
  
  console.log(`Resetando senha para usuário: ${email}`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isActive: true
    },
    create: {
      email,
      name: 'Administrador',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    }
  });

  console.log('Sucesso! Use:');
  console.log(`Email: ${email}`);
  console.log(`Senha: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
