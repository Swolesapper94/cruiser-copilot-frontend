"use client";

import { GitCompareArrows, Lock } from "lucide-react";
import type { Citation, SourceConflict } from "@/types";

interface ConflictWarningProps {
  conflicts: SourceConflict[];
  citations: Citation[];
}

export function ConflictWarning({ conflicts, citations }: ConflictWarningProps) {
  if (conflicts.length === 0) return null;

  const citationById = new Map(citations.map((citation) => [citation.id, citation]));

  return (
    <section
      className="panel border-caution/50 p-5"
      aria-label="Conflicting source values"
    >
      <p className="label-caps flex items-center gap-1.5 text-caution">
        <GitCompareArrows className="h-4 w-4" aria-hidden />
        Sources disagree
      </p>

      <div className="mt-3 space-y-4">
        {conflicts.map((conflict) => (
          <article key={conflict.id} className="panel-raised p-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold">{conflict.subject}</h3>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  conflict.resolutionStatus === "unresolved"
                    ? "bg-danger/20 text-danger"
                    : "bg-confirm/20 text-confirm"
                }`}
              >
                {conflict.resolutionStatus}
              </span>
            </div>

            <p className="mt-2 text-xs text-shop-muted">{conflict.explanation}</p>

            <ul className="mt-3 space-y-2">
              {conflict.alternatives.map((alternative) => {
                const citation = citationById.get(alternative.citationId);
                return (
                  <li
                    key={`${conflict.id}-${alternative.citationId}`}
                    className="rounded-lg border border-shop-line bg-shop-deep p-3"
                  >
                    <p className="font-mono text-xs text-shop-text">
                      {alternative.value}
                    </p>
                    <p className="mt-1 text-[11px] text-shop-muted">
                      Applies to: {alternative.applicabilitySummary}
                    </p>
                    {citation ? (
                      <p className="mt-1 text-[11px] text-shop-muted">
                        Source: {citation.label} — {citation.locator}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>

            {conflict.missingApplicabilityFields.length > 0 ? (
              <p className="mt-3 flex items-start gap-2 text-xs text-shop-muted">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>
                  Provide{" "}
                  <span className="font-mono text-shop-text">
                    {conflict.missingApplicabilityFields.join(", ")}
                  </span>{" "}
                  to narrow this down.
                </span>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
