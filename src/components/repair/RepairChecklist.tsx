"use client";

import { AlertTriangle, BookMarked, MessageSquare, OctagonX } from "lucide-react";
import type { Citation, Procedure } from "@/types";

interface RepairChecklistProps {
  procedure: Procedure;
  citations: Citation[];
  completedStepIds: string[];
  specificationLocked: boolean;
  busy?: boolean;
  onToggle: (stepId: string, completed: boolean) => void;
}

export function RepairChecklist({
  procedure,
  citations,
  completedStepIds,
  specificationLocked,
  busy,
  onToggle,
}: RepairChecklistProps) {
  const citationById = new Map(citations.map((citation) => [citation.id, citation]));
  const completed = new Set(completedStepIds);

  return (
    <section className="space-y-4" aria-label="Guided procedure">
      <header className="panel p-5">
        <h1 className="text-xl font-semibold">{procedure.title}</h1>
        <p className="mt-2 text-sm text-shop-muted">{procedure.summary}</p>
        <p className="mt-3 text-xs text-shop-muted">
          <span className="capitalize">{procedure.difficulty}</span> ·{" "}
          {procedure.estimatedMinutes} min · {completed.size}/
          {procedure.steps.length} steps done
        </p>

        <div className="mt-4 rounded-lg border border-caution/50 bg-caution/10 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-caution">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Before you start
          </p>
          <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
            {procedure.globalSafetyWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </header>

      <ol className="space-y-4">
        {procedure.steps.map((step) => {
          const isDone = completed.has(step.id);
          const locked = specificationLocked && Boolean(step.specificationSubject);

          return (
            <li key={step.id} className="panel p-5">
              <div className="flex items-start gap-3">
                <input
                  id={`step-${step.id}`}
                  type="checkbox"
                  className="mt-1 h-5 w-5 shrink-0"
                  checked={isDone}
                  disabled={busy}
                  onChange={(event) => onToggle(step.id, event.target.checked)}
                />
                <div className="min-w-0 flex-1">
                  <label
                    htmlFor={`step-${step.id}`}
                    className="block text-sm font-semibold"
                  >
                    <span className="mr-2 font-mono text-xs text-shop-muted">
                      {step.order}
                    </span>
                    {step.instruction}
                  </label>

                  {locked ? (
                    <p
                      role="alert"
                      className="mt-3 flex items-start gap-2 rounded-lg border border-danger/50 bg-danger/10 p-3 text-xs text-shop-muted"
                    >
                      <OctagonX className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                      <span>
                        <span className="font-semibold text-shop-text">
                          Specification locked.
                        </span>{" "}
                        More than one published value could apply to this vehicle,
                        so no figure is shown. Resolve the missing vehicle details
                        first.
                      </span>
                    </p>
                  ) : null}

                  {step.oemNotes.length > 0 ? (
                    <div className="mt-3 rounded-lg border border-oem/50 bg-oem/5 p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-oem">
                        <BookMarked className="h-3.5 w-3.5" aria-hidden />
                        Official (OEM)
                      </p>
                      <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
                        {step.oemNotes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {step.communityTips.length > 0 ? (
                    <div className="mt-3 rounded-lg border border-community/50 bg-community/5 p-3">
                      <p className="mb-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-community">
                        <MessageSquare className="h-3.5 w-3.5" aria-hidden />
                        Community tip — not a Toyota instruction
                      </p>
                      <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
                        {step.communityTips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {step.safetyWarnings.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-0.5 pl-5 text-xs text-caution">
                      {step.safetyWarnings.map((warning) => (
                        <li key={warning}>{warning}</li>
                      ))}
                    </ul>
                  ) : null}

                  {step.stopConditions.length > 0 ? (
                    <div className="mt-3">
                      <p className="label-caps mb-1">Stop if</p>
                      <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
                        {step.stopConditions.map((condition) => (
                          <li key={condition}>{condition}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  {step.photoCheckpoint ? (
                    <p className="mt-3 text-xs text-shop-muted">
                      Photo checkpoint: {step.photoCheckpoint}
                    </p>
                  ) : null}

                  {step.citationIds.length > 0 ? (
                    <ul className="mt-3 space-y-1 text-[11px] text-shop-muted">
                      {step.citationIds.map((citationId) => {
                        const citation = citationById.get(citationId);
                        if (!citation) return null;
                        return (
                          <li key={citationId}>
                            {citation.label} — {citation.locator}
                            {citation.isPlaceholder ? " (placeholder record)" : ""}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="panel p-5">
        <h2 className="text-base font-semibold">Before you call it done</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-shop-muted">
          {procedure.validationSteps.map((validation) => (
            <li key={validation}>{validation}</li>
          ))}
        </ul>
      </section>
    </section>
  );
}
