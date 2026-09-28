"use client";

import { Minus, Plus } from "lucide-react";

export function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (v: number) => void; label: string; min?: number }) {
  return (
    <div className="inline-flex h-11 items-center rounded-md border border-line-strong bg-white">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`הפחתת כמות – ${label}`} className="grid h-full w-10 place-items-center disabled:opacity-35">
        <Minus className="size-4" aria-hidden />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        value={value}
        onChange={(e) => {
          const n = Math.floor(Number(e.target.value));
          if (Number.isFinite(n) && n >= min) onChange(Math.min(n, 9999));
        }}
        aria-label={`כמות – ${label}`}
        className="num h-full w-12 border-x border-line bg-transparent text-center font-semibold [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" onClick={() => onChange(Math.min(9999, value + 1))} aria-label={`הוספת כמות – ${label}`} className="grid h-full w-10 place-items-center">
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
