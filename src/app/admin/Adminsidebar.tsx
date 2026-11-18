
'use client'

import { AdminLogo, AdminLogoIcon } from './AdminLogo';

import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from '@/components/ui/sidebar'; // ajuste o caminho
import {
  DashboardSquare01Icon,
  LibraryIcon,
  Calendar01Icon,
  UserIcon,
  Book01Icon,
  ShieldCheckIcon,
  Logout01Icon
} from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/HugeIcon";
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
      label: 'Dashboard',
      href: '/admin/dashboard',
      icon: <HugeIcon icon={DashboardSquare01Icon} size={20} />
    },
    {
      label: 'Livros',
      href: '/admin/livros',
      icon: <HugeIcon icon={LibraryIcon} size={20} />
    },
    {
      label: 'Reservas',
      href: '/admin/reservas',
      icon: <HugeIcon icon={Calendar01Icon} size={20} />
    },
    {
      label: 'Alunos',
      href: '/admin/alunos',
      icon: <HugeIcon icon={UserIcon} size={20} />,
    },
    {
      label: 'Empréstimos',
      href: '/admin/emprestimos',
      icon: <HugeIcon icon={Book01Icon} size={20} />,
    },
    {
        label: 'Usuários',
        href: '/admin/users',
        icon: <HugeIcon icon={ShieldCheckIcon} size={20} />,
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
          {/* LOGO (Desktop only - mobile drawer has its own header) */}
          <div className="hidden md:flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
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
          <div className="mt-2 md:mt-6 flex flex-col gap-2">
            {links.map((link, i) => (
              <SidebarLink 
                key={i} 
                link={link}
                className={pathname === link.href ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : ""}
                onClick={() => setOpen(false)}
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
                    icon: <HugeIcon icon={Logout01Icon} size={20} className="text-red-500" />
                }}
                className="hover:bg-red-500/10 hover:text-red-600 text-red-500 mt-auto"
                onClick={handleLogout}
             />
        </div>

      </SidebarBody>
    </Sidebar>
  );
}