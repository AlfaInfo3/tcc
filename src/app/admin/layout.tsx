import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifySignedSessionToken } from '@/lib/security';
import AdminSidebar from './Adminsidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get('x-pathname') ?? '';
  const isAuthPage = pathname.startsWith('/admin/auth');

  if (!isAuthPage) {
    const token = (await cookies()).get('admin_token')?.value;
    const verification = verifySignedSessionToken(token, 'admin');

    if (!verification.valid || !verification.payload) {
      redirect('/admin/auth');
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: verification.payload.sub },
      select: { isActive: true },
    });

    if (!user || !user.isActive) {
      redirect('/admin/auth');
    }
  }

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-gray-100 dark:bg-neutral-800 md:flex-row md:bg-[var(--sidebar)] dark:md:bg-[var(--sidebar)]">
      {/* Sidebar (top header on mobile, left bar on desktop) */}
      <AdminSidebar />

      {/* Conteúdo — único container com rolagem */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="flex w-full flex-1 flex-col gap-4 overflow-y-auto rounded-none border-t border-neutral-200 bg-white p-3.5 shadow-inner sm:p-5 md:rounded-tl-2xl md:border-l md:border-t-0 md:p-6 dark:border-neutral-700 dark:bg-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}
