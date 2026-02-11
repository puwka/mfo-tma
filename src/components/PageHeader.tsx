"use client";

import { ProfileAvatar } from "./ProfileAvatar";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        {subtitle && (
          <p className="text-zinc-600 text-sm mt-1">{subtitle}</p>
        )}
      </div>
      <ProfileAvatar />
    </header>
  );
}
