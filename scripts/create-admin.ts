import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  
  console.log(`Configurando credenciais do administrador para: ${email}`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isActive: true
    },
    create: {
      email,
      name: 'Administrador Laurentino',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true
    }
  });

  console.log(`Usuário administrador configurado com sucesso! ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error('Erro ao configurar administrador:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
