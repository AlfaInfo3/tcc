import AdminSidebar from "./Adminsidebar";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="flex flex-col md:flex-row h-screen w-full bg-gray-100 dark:bg-neutral-800 md:bg-[var(--sidebar)] dark:md:bg-[var(--sidebar)] overflow-hidden"
    >
      {/* Sidebar (Top header on mobile, left bar on desktop) */}
      <AdminSidebar />

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col h-full min-w-0 overflow-hidden">
        <main className="flex flex-1 flex-col gap-4 rounded-none md:rounded-tl-2xl border-t md:border-t-0 md:border-l border-neutral-200 bg-white p-3.5 sm:p-5 md:p-6 dark:border-neutral-700 dark:bg-neutral-900 overflow-y-auto w-full h-full shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
}