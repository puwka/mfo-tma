"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function isDetailPage(pathname: string) {
  return /^\/info\/[^/]+$/.test(pathname) || pathname === "/profile";
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDetail = isDetailPage(pathname);

  // Профиль и статья: появление справа (открытие), уход вправо (закрытие)
  // Остальные: fade
  const variants = isDetail
    ? {
        initial: { opacity: 0, x: 16 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 16 },
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
