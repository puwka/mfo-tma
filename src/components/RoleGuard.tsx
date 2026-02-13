"use client";

import { type ReactNode } from "react";
import type { UserRole } from "@/types/offers";

export interface RoleGuardProps {
  /** Роли, при которых контент показывается (хотя бы одна). */
  allow: UserRole | UserRole[];
  /** Текущая роль пользователя (из профиля). */
  currentRole: UserRole | null;
  /** Контент, показываемый при совпадении роли. */
  children: ReactNode;
  /** Опционально: что показать при отсутствии доступа. */
  fallback?: ReactNode;
}

/**
 * Скрывает/показывает части интерфейса в зависимости от роли.
 * Используется для блоков Партнёра (дашборд) и Админа (управление пользователями, статистика).
 */
export function RoleGuard({
  allow,
  currentRole,
  children,
  fallback = null,
}: RoleGuardProps) {
  const allowed = Array.isArray(allow) ? allow : [allow];
  const hasAccess = currentRole != null && allowed.includes(currentRole);

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
