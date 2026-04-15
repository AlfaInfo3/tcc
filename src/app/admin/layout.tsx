import AdminSidebar from "./Adminsidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
        className="flex h-screen w-full bg-gray-100 dark:bg-neutral-800 md:bg-[var(--sidebar)] dark:md:bg-[var(--sidebar)]"
    >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
          <main className="flex flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto w-full h-full shadow-inner">
            {children}
          </main>
      </div>
    </div>
  );
}