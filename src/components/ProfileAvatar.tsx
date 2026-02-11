"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTelegramUser } from "@/hooks/useTelegramUser";

export function ProfileAvatar() {
  const { photoUrl, initials, loading } = useTelegramUser();
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [photoUrl]);

  if (loading) {
    return (
      <div
        className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center bg-amber-100 border-2 border-amber-200"
        aria-hidden
      >
        <div className="w-5 h-5 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <Link
      href="/profile"
      className="relative w-9 h-9 rounded-full overflow-hidden bg-amber-100 border-2 border-amber-200 flex items-center justify-center shrink-0 hover:ring-2 hover:ring-amber-300 transition-shadow"
      aria-label="Профиль"
    >
      {photoUrl ? (
        <>
          <Image
            src={photoUrl}
            alt="Аватар"
            width={36}
            height={36}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImageLoaded(true)}
          />
          <AnimatePresence mode="wait">
            {!imageLoaded && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center bg-amber-100"
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-amber-300 border-t-amber-600 animate-spin"
                  aria-hidden
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <span className="text-sm font-semibold text-amber-700">
          {initials}
        </span>
      )}
    </Link>
  );
}
