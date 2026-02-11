"use client";

import Link from "next/link";
import Image from "next/image";
import { useTelegramUser } from "@/hooks/useTelegramUser";

export function ProfileAvatar() {
  const { photoUrl, initials, loading } = useTelegramUser();

  if (loading) {
    return (
      <div className="w-9 h-9 rounded-full bg-zinc-200 animate-pulse shrink-0" />
    );
  }

  return (
    <Link
      href="/profile"
      className="w-9 h-9 rounded-full overflow-hidden bg-amber-100 border-2 border-amber-200 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-amber-300 transition-shadow"
      aria-label="Профиль"
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt="Аватар"
          width={36}
          height={36}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-sm font-semibold text-amber-700">
          {initials}
        </span>
      )}
    </Link>
  );
}
