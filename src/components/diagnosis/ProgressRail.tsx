"use client";

import type { DiagnosticUpdate } from "@/types";

const STEPS = [
  { key: "vehicleIdentified", label: "Vehicle" },
  { key: "symptomsCaptured", label: "Symptoms" },
  { key: "evidenceCaptured", label: "Evidence" },
  { key: "testingStarted", label: "Testing" },
  { key: "outcomeRecorded", label: "Outcome" },
] as const;

export function ProgressRail({ progress }: { progress: DiagnosticUpdate["progress"] }) {
  return (
    <nav aria-label="Session progress" className="panel px-4 py-3">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {STEPS.map((step, index) => {
          const done = progress[step.key];
          return (
            <li key={step.key} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold ${
                  done
                    ? "border-confirm bg-confirm/15 text-confirm"
                    : "border-shop-line text-shop-muted"
                }`}
                aria-hidden
              >
                {done ? "✓" : index + 1}
              </span>
              <span
                className={`text-xs ${done ? "text-shop-text" : "text-shop-muted"}`}
              >
                {step.label}
                <span className="sr-only">{done ? " complete" : " not complete"}</span>
              </span>
              {index < STEPS.length - 1 ? (
                <span className="mx-1 h-px w-4 bg-shop-line" aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
