import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Credenciais nunca são fixas no código: devem vir do ambiente.
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente antes de executar este script. ' +
        'Exemplo: ADMIN_EMAIL=admin@escola.local ADMIN_PASSWORD=<senha-forte> npx tsx scripts/create-admin.ts'
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('ADMIN_EMAIL não é um e-mail válido.');
  }

  if (password.length < 12 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('ADMIN_PASSWORD deve ter entre 12 e 72 bytes.');
  }

  console.log(`Configurando credenciais do administrador para: ${email}`);

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email,
      name: process.env.ADMIN_NAME?.trim() || 'Administrador Laurentino',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
    },
  });

  console.log(`Usuário administrador configurado com sucesso! ID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error('Erro ao configurar administrador:', e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
