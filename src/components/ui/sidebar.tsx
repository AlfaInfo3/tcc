"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 100);
  };

  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-sidebar w-[300px] shrink-0 border-r border-sidebar-border",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "80px") : "300px",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-16 px-4 flex flex-row md:hidden sticky top-0 left-0 z-40 items-center justify-between bg-sidebar w-full border-b border-sidebar-border shrink-0 shadow-xs"
        )}
        {...props}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            <img
              src="/logo/laurentao-logo-b.svg"
              alt="Logo Laurentino"
              className="h-8 w-8 shrink-0 object-contain"
            />
          </div>
          <span className="font-bold text-xl text-white tracking-tight">Biblioteca</span>
        </div>

        <div className="flex items-center justify-end z-20">
          <button
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-white transition-all cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            {open ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed inset-0 h-full w-full bg-sidebar/98 backdrop-blur-xl p-6 sm:p-8 z-[100] flex flex-col justify-between overflow-y-auto",
                className
              )}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <div className="flex items-center gap-2.5">
                  <img
                    src="/logo/laurentao-logo-b.svg"
                    alt="Logo Laurentino"
                    className="h-8 w-8 shrink-0 object-contain"
                  />
                  <span className="font-bold text-xl text-white tracking-tight">Biblioteca</span>
                </div>
                <button
                  type="button"
                  aria-label="Fechar menu"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  <IconX className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 py-4 overflow-y-auto">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

import Link from "next/link";

// ... existing imports

// ... existing code

export const SidebarLink = ({
  link,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & {
  link: Links;
  className?: string;
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center justify-start gap-2 group/sidebar py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground rounded-md transition-colors px-2",
        className
      )}
      {...props}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center">
        {link.icon}
      </div>

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block p-0! m-0!"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
