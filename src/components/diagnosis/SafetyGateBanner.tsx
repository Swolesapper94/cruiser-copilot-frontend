"use client";

import { AlertTriangle, Info, ShieldAlert } from "lucide-react";
import type { SafetyGate } from "@/types";

const STYLES = {
  blocking: {
    wrapper: "border-danger/60 bg-danger/10",
    icon: ShieldAlert,
    tag: "Blocking",
    tagClass: "bg-danger/20 text-danger",
  },
  caution: {
    wrapper: "border-caution/60 bg-caution/10",
    icon: AlertTriangle,
    tag: "Caution",
    tagClass: "bg-caution/20 text-caution",
  },
  info: {
    wrapper: "border-shop-line bg-shop-raised",
    icon: Info,
    tag: "Note",
    tagClass: "bg-shop-line text-shop-muted",
  },
} as const;

export function SafetyGateBanner({ gates }: { gates: SafetyGate[] }) {
  if (gates.length === 0) return null;

  return (
    <div className="space-y-3" role="region" aria-label="Safety and completeness gates">
      {gates.map((gate) => {
        const style = STYLES[gate.severity];
        const Icon = style.icon;
        return (
          <div
            key={gate.id}
            role={gate.severity === "blocking" ? "alert" : undefined}
            className={`flex gap-3 rounded-xl border p-4 ${style.wrapper}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${style.tagClass}`}
                >
                  {style.tag}
                </span>
                <p className="text-sm font-semibold">{gate.title}</p>
              </div>
              <p className="text-sm text-shop-muted">{gate.detail}</p>
              {gate.missingApplicabilityFields.length > 0 ? (
                <p className="mt-2 text-xs text-shop-muted">
                  Missing vehicle details:{" "}
                  <span className="font-mono text-shop-text">
                    {gate.missingApplicabilityFields.join(", ")}
                  </span>
                </p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
