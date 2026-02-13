"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wallet, CreditCard, Landmark } from "lucide-react";

const navItems = [
  { href: "/", label: "Займы", icon: Wallet },
  { href: "/credits", label: "Кредиты", icon: Landmark },
  { href: "/cards", label: "Карты", icon: CreditCard },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      data-onboarding-step="3"
      className="fixed bottom-0 left-0 right-0 z-50
        bg-white/95 backdrop-blur-xl border-t border-zinc-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]
        pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`
                flex flex-col items-center gap-1 px-6 py-2 rounded-xl
                transition-all duration-200
                ${isActive 
                  ? "text-amber-500 bg-amber-50" 
                  : "text-zinc-500 hover:text-zinc-700"
                }
              `}
            >
              <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
