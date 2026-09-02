"use client";

import { useState } from "react";
import { Check, ChevronDown, Circle, HelpCircle, Minus, X } from "lucide-react";
import type { Hypothesis } from "@/types";

const STATUS_META = {
  untested: { label: "Untested", Icon: Circle, className: "text-shop-muted" },
  "partially-tested": {
    label: "Partially tested",
    Icon: Minus,
    className: "text-caution",
  },
  supported: { label: "Supported", Icon: Check, className: "text-practical" },
  contradicted: { label: "Contradicted", Icon: X, className: "text-shop-muted" },
  confirmed: { label: "Confirmed", Icon: Check, className: "text-confirm" },
} as const;

const DIRECTION_META = {
  supports: { label: "Supports", className: "text-practical" },
  contradicts: { label: "Contradicts", className: "text-danger" },
  context: { label: "Context", className: "text-shop-muted" },
} as const;

export function HypothesisList({ hypotheses }: { hypotheses: Hypothesis[] }) {
  const [showAll, setShowAll] = useState(false);

  if (hypotheses.length === 0) return null;

  const visibleHypotheses = showAll ? hypotheses : hypotheses.slice(0, 3);
  const hiddenCount = Math.max(hypotheses.length - visibleHypotheses.length, 0);

  return (
    <section className="panel p-5" aria-label="Ranked possibilities">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">What this could be</h2>
        <p className="text-[11px] text-shop-muted">Relative ranking</p>
      </div>
      <p className="mb-4 text-xs text-shop-muted">
        These are ranked possibilities based on your answers, not probabilities,
        and nothing here is confirmed until it is measured.
      </p>

      <ol className="space-y-3">
        {visibleHypotheses.map((hypothesis, index) => {
          const meta = STATUS_META[hypothesis.status];
          const StatusIcon = meta.Icon;
          const percent = Math.round(hypothesis.relativeScore * 100);

          return (
            <li key={hypothesis.id} className="panel-raised p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    <span className="mr-2 font-mono text-xs text-shop-muted">
                      #{index + 1}
                    </span>
                    {hypothesis.name}
                  </p>
                  <p className="mt-1 text-xs text-shop-muted">
                    {hypothesis.summary}
                  </p>
                </div>
                <span
                  className={`flex shrink-0 items-center gap-1.5 text-xs font-medium ${meta.className}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" aria-hidden />
                  {meta.label}
                </span>
              </div>

              <div className="mt-3">
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-shop-line"
                  role="meter"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${hypothesis.name} relative ranking`}
                >
                  <div
                    className="h-full rounded-full bg-practical"
                    style={{ width: `${Math.max(percent, 2)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-shop-muted">
                  Relative weight {percent}% of the current ranking
                </p>
              </div>

              {hypothesis.rationale.length > 0 ||
              hypothesis.missingEvidence.length > 0 ? (
                <details className="group mt-3 border-t border-shop-line pt-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-medium text-shop-text marker:hidden">
                    Why it is ranked here
                    <ChevronDown
                      className="h-4 w-4 text-shop-muted transition-transform group-open:rotate-180"
                      aria-hidden
                    />
                  </summary>

                  {hypothesis.rationale.length > 0 ? (
                    <ul className="mt-3 space-y-1.5">
                      {hypothesis.rationale.map((link) => {
                        const direction = DIRECTION_META[link.direction];
                        return (
                          <li key={`${hypothesis.id}-${link.ref}`} className="text-xs">
                            <span
                              className={`mr-2 font-semibold uppercase tracking-[0.1em] ${direction.className}`}
                            >
                              {direction.label}
                            </span>
                            <span className="text-shop-muted">{link.note}</span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}

                  {hypothesis.missingEvidence.length > 0 ? (
                    <div className="mt-3 flex gap-2 rounded-lg border border-shop-line bg-shop-deep p-3">
                      <HelpCircle
                        className="mt-0.5 h-4 w-4 shrink-0 text-shop-muted"
                        aria-hidden
                      />
                      <div className="text-xs">
                        <p className="mb-0.5 font-medium text-shop-text">
                          Still missing
                        </p>
                        <ul className="list-disc space-y-0.5 pl-4 text-shop-muted">
                          {hypothesis.missingEvidence.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : null}
                </details>
              ) : null}
            </li>
          );
        })}
      </ol>

      {hypotheses.length > 3 ? (
        <button
          type="button"
          className="btn-secondary mt-4 w-full justify-center"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
        >
          {showAll
            ? "Show fewer possibilities"
            : `Show ${hiddenCount} more ${hiddenCount === 1 ? "possibility" : "possibilities"}`}
        </button>
      ) : null}
    </section>
  );
}
