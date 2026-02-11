"use client";

import { useState } from "react";

// Сумма: 70% ползунка = 1K–30K, 30% = 30K–100K (шаг 5K)
const AMOUNT_LOW = 1000;
const AMOUNT_MID = 30000;
const AMOUNT_HIGH = 100000;
const AMOUNT_STEP_HIGH = 5000;

// Срок: 70% ползунка = 1–30 дней, 30% = 30–365 дней (шаг 30)
const TERM_LOW = 1;
const TERM_MID = 30;
const TERM_HIGH = 365;
const TERM_STEP_HIGH = 30;

const AMOUNT_QUICK = [10000, 30000, 50000, 100000];
const TERM_QUICK = [7, 14, 30, 90];

function amountToPosition(value: number): number {
  if (value <= AMOUNT_MID) {
    return ((value - AMOUNT_LOW) / (AMOUNT_MID - AMOUNT_LOW)) * 70;
  }
  return 70 + ((value - AMOUNT_MID) / (AMOUNT_HIGH - AMOUNT_MID)) * 30;
}

function positionToAmount(pos: number): number {
  if (pos <= 70) {
    const v = AMOUNT_LOW + (pos / 70) * (AMOUNT_MID - AMOUNT_LOW);
    return Math.round(v / 1000) * 1000;
  }
  const v = AMOUNT_MID + ((pos - 70) / 30) * (AMOUNT_HIGH - AMOUNT_MID);
  return Math.round(v / AMOUNT_STEP_HIGH) * AMOUNT_STEP_HIGH;
}

function termToPosition(value: number): number {
  if (value <= TERM_MID) {
    return ((value - TERM_LOW) / (TERM_MID - TERM_LOW)) * 70;
  }
  return 70 + ((value - TERM_MID) / (TERM_HIGH - TERM_MID)) * 30;
}

function positionToTerm(pos: number): number {
  if (pos <= 70) {
    return Math.round(TERM_LOW + (pos / 70) * (TERM_MID - TERM_LOW));
  }
  const v = TERM_MID + ((pos - 70) / 30) * (TERM_HIGH - TERM_MID);
  return Math.round(v / TERM_STEP_HIGH) * TERM_STEP_HIGH;
}

function formatAmount(v: number): string {
  if (v >= 1000) return `${v / 1000}K ₽`;
  return `${v} ₽`;
}

interface LoanCalculatorProps {
  amount: number;
  term: number;
  onAmountChange: (v: number) => void;
  onTermChange: (v: number) => void;
}

function SliderSection({
  label,
  value,
  displayValue,
  position,
  onPositionChange,
  quickButtons,
  quickLabels,
  onQuickSelect,
  hint,
}: {
  label: string;
  value: number;
  displayValue: string;
  position: number;
  onPositionChange: (p: number) => void;
  quickButtons: number[];
  quickLabels: string[];
  onQuickSelect: (v: number) => void;
  hint: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-zinc-900">{label}</h3>
      <p className="text-2xl font-bold text-zinc-900">{displayValue}</p>

      <div className="relative h-2 rounded-full bg-zinc-300 cursor-pointer">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-zinc-800 transition-all"
          style={{ width: `${position}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={position}
          onChange={(e) => onPositionChange(Number(e.target.value))}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div
          className="absolute top-0 w-10 h-10 -translate-x-1/2 -translate-y-full pointer-events-none transition-opacity"
          style={{ left: `${position}%`, opacity: showTooltip ? 1 : 0 }}
        >
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-amber-100 border border-amber-200 shadow-sm text-sm font-semibold text-zinc-900 whitespace-nowrap">
            {displayValue}
          </div>
        </div>
        <div
          className="absolute top-1/2 w-5 h-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md border border-zinc-200 pointer-events-none"
          style={{ left: `${position}%` }}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        {quickButtons.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onQuickSelect(v)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              value === v
                ? "bg-zinc-800 text-white"
                : "bg-amber-100 text-zinc-900 hover:bg-amber-200"
            }`}
          >
            {quickLabels[quickButtons.indexOf(v)]}
          </button>
        ))}
      </div>

      <p className="text-xs text-zinc-500">{hint}</p>
    </div>
  );
}

export function LoanCalculator({
  amount,
  term,
  onAmountChange,
  onTermChange,
}: LoanCalculatorProps) {
  const amountPos = amountToPosition(amount);
  const termPos = termToPosition(term);

  const handleAmountPositionChange = (pos: number) => {
    onAmountChange(positionToAmount(pos));
  };

  const handleTermPositionChange = (pos: number) => {
    onTermChange(positionToTerm(pos));
  };

  return (
    <div className="rounded-2xl p-6 bg-amber-400 border-2 border-amber-500/30 shadow-md space-y-8">
      <div className="space-y-8">
        <SliderSection
          label="Сумма займа"
          value={amount}
          displayValue={formatAmount(amount)}
          position={amountPos}
          onPositionChange={handleAmountPositionChange}
          quickButtons={AMOUNT_QUICK}
          quickLabels={["10K", "30K", "50K", "100K"]}
          onQuickSelect={onAmountChange}
          hint="70% ползунка: 1K–30K ₽ | 30%: 30K–100K ₽ (шаг 5K)"
        />

        <SliderSection
          label="Срок займа"
          value={term}
          displayValue={`${term} дней`}
          position={termPos}
          onPositionChange={handleTermPositionChange}
          quickButtons={TERM_QUICK}
          quickLabels={["7 дн.", "14 дн.", "30 дн.", "90 дн."]}
          onQuickSelect={onTermChange}
          hint="70% ползунка: 1–30 дней | 30%: 30–365 дней (шаг 30)"
        />
      </div>
    </div>
  );
}
