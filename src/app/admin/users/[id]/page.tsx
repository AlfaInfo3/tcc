import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { verifySignedSessionToken } from '@/lib/security';
import { formatDateBR } from '@/lib/format';
import { EditUserForm } from './EditUserForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminUserDetailsPage({ params }: Props) {
  const { id } = await params;

  const [user, token] = await Promise.all([
    prisma.adminUser.findUnique({ where: { id } }),
    cookies().then((store) => store.get('admin_token')?.value),
  ]);

  if (!user) notFound();

  const verification = verifySignedSessionToken(token, 'admin');
  const currentUserId = verification.valid && verification.payload ? verification.payload.sub : null;

  const currentUser = currentUserId
    ? await prisma.adminUser.findUnique({
        where: { id: currentUserId },
        select: { role: true },
      })
    : null;

  const canManage = currentUser?.role === 'super_admin';
  const isSelf = currentUserId === user.id;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar para usuários
      </Link>

      <div className="mt-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.name}</h1>
        <p className="text-muted-foreground mt-1">
          {user.email} · cadastrado em {formatDateBR(user.createdAt)}
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm p-6">
        <EditUserForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          }}
          canManage={canManage}
          isSelf={isSelf}
        />
      </div>
    </div>
  );
}
