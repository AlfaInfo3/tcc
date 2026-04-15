
'use client'

import { AdminLogo, AdminLogoIcon } from './AdminLogo';

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from '@/components/ui/sidebar'; // ajuste o caminho
import {
    SquareLibrary,
    CalendarArrowUp,
    Settings,
    UserRound,
    NotebookText,
    ShieldCheck,
    LayoutDashboard,
    LogOut
  } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// ... existing imports

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  
  if (pathname === '/admin/auth') {
    return null;
  }
  const links = [
    {
        label: 'DashBoard',
        href: '/admin/dashboard',
        icon: <LayoutDashboard />
      },
    {
      label: 'Ver livros',
      href: '/admin/livros',
      icon: <SquareLibrary />
    },
    {
      label: 'Reservas',
      href: '/admin/reservas',
      icon: < CalendarArrowUp />
    },
    {
      label: 'Alunos',
      href: '/admin/alunos',
      icon: <UserRound />,
    },
    {
      label: 'Emprestimos',
      href: '/admin/emprestimos',
      icon: <NotebookText />,
    },
    {
        label: 'Usuario',
        href: '/admin/users',
        icon: <ShieldCheck/>,
    },
  ];

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
        await fetch('/api/admin/auth/logout', { method: 'POST' });
        router.push('/admin/auth');
    } catch (error) {
        console.error('Logout failed', error);
        // Force redirect anyway
        router.push('/admin/auth');
    }
  };

  return (
        
    <Sidebar open={open} setOpen={setOpen} >
      <SidebarBody className="justify-between gap-10 bg-sidebar border-none">
        <div>
          {/* LOGO */}
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="logo-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminLogo />
                </motion.div>
              ) : (
                <motion.div
                  key="logo-icon"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <AdminLogoIcon />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* LINKS */}
          <div className="mt-6 flex flex-col gap-2">
            {links.map((link, i) => (
              <SidebarLink 
                key={i} 
                link={link}
                className={pathname === link.href ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : ""}
              />
            ))}
          </div>
        </div>
        
        {/* LOGOUT BUTTON */}
        <div>
             <SidebarLink 
                link={{
                    label: 'Sair',
                    href: '#',
                    icon: <LogOut className="text-red-500" />
                }}
                className="hover:bg-red-500/10 hover:text-red-600 text-red-500 mt-auto"
                onClick={handleLogout}
             />
        </div>

      </SidebarBody>
    </Sidebar>
  );
}