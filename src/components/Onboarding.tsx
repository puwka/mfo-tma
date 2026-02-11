"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ONBOARDING_KEY = "tma_onboarding_seen";

const STEPS = [
  {
    target: "[data-onboarding-step='1']",
    title: "Калькулятор займа",
    desc: "Выберите сумму и срок займа — список предложений подстроится под ваши условия.",
  },
  {
    target: "[data-onboarding-step='2']",
    title: "Подходящие предложения",
    desc: "Здесь отображаются МФО, соответствующие выбранным параметрам.",
  },
  {
    target: "[data-onboarding-step='3']",
    title: "Навигация",
    desc: "Переключайтесь между разделами и открывайте профиль для статуса заёмщика.",
  },
];

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const updateRect = useCallback(() => {
    const el = document.querySelector(STEPS[step].target);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (!visible) return;
    updateRect();
    const timer = setTimeout(updateRect, 100);
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [visible, step, updateRect]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem(ONBOARDING_KEY, "1");
      setVisible(false);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100]"
      >
        {/* Затемнение: box-shadow создаёт тёмную область, центр (подсветка) прозрачен */}
        {rect ? (
          <div
            className="absolute rounded-2xl ring-2 ring-amber-400 ring-offset-2 ring-offset-transparent pointer-events-none transition-all duration-300"
            style={{
              left: rect.left - 8,
              top: rect.top - 8,
              width: rect.width + 16,
              height: rect.height + 16,
              boxShadow: "0 0 0 9999px rgba(0,0,0,0.75)",
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-black/75 pointer-events-none" />
        )}
        {/* Кликабельная область для перехода к следующему шагу */}
        <div
          className="absolute inset-0"
          onClick={handleNext}
          aria-hidden
        />

        {/* Описание шага */}
        <div className="absolute left-4 right-4 bottom-24 max-w-md mx-auto">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-2xl p-5 shadow-xl border border-zinc-200"
          >
            <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">
              Шаг {step + 1} из {STEPS.length}
            </p>
            <h3 className="text-lg font-bold text-zinc-900">{current.title}</h3>
            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
              {current.desc}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSkip}
                className="flex-1 py-2.5 text-sm font-medium text-zinc-500 hover:text-zinc-700 transition-colors"
              >
                Пропустить
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 text-zinc-900 font-semibold text-sm hover:bg-amber-500 transition-colors"
              >
                {step < STEPS.length - 1 ? "Далее" : "Готово"}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Индикаторы шагов */}
        <div className="absolute top-12 left-0 right-0 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 bg-amber-400"
                  : i < step
                    ? "w-1.5 bg-amber-400/60"
                    : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
