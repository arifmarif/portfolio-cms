"use client";
import { useState } from "react";

type Props = {
  name: string;
  label: string;
  defaultValue?: string[];
};

export default function StepsEditor({ name, label, defaultValue }: Props) {
  const [steps, setSteps] = useState<string[]>(defaultValue || []);

  function update(idx: number, value: string) {
    setSteps(steps.map((s, i) => (i === idx ? value : s)));
  }

  function add() {
    setSteps([...steps, ""]);
  }

  function remove(idx: number) {
    setSteps(steps.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= steps.length) return;
    const next = [...steps];
    [next[idx], next[target]] = [next[target], next[idx]];
    setSteps(next);
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm text-on-surface-variant">{label}</span>
      <div className="space-y-2">
        {steps.map((s, idx) => (
          <div key={idx} className="flex gap-2">
            <input
              type="text"
              value={s}
              onChange={(e) => update(idx, e.target.value)}
              placeholder={`Langkah ${idx + 1}`}
              className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
            />
            <button type="button" onClick={() => move(idx, -1)} className="px-2 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright" aria-label="Pindah langkah ke atas">
              ↑
            </button>
            <button type="button" onClick={() => move(idx, 1)} className="px-2 py-2 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright" aria-label="Pindah langkah ke bawah">
              ↓
            </button>
            <button type="button" onClick={() => remove(idx)} className="px-2 py-2 rounded-lg bg-error-container/30 text-error hover:bg-error-container/50" aria-label="Hapus langkah">
              Hapus
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-sm hover:bg-surface-bright">
        + Tambah Langkah
      </button>
      <input type="hidden" name={name} value={JSON.stringify(steps)} readOnly />
    </div>
  );
}
