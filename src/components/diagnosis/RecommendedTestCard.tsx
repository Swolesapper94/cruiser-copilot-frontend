"use client";

import Link from "next/link";
import { AlertTriangle, Clock, Wrench } from "lucide-react";
import type { RecommendedTest } from "@/types";

interface RecommendedTestCardProps {
  test: RecommendedTest;
  sessionId: string;
  blocked?: boolean;
}

export function RecommendedTestCard({
  test,
  sessionId,
  blocked,
}: RecommendedTestCardProps) {
  return (
    <section
      className="panel border-practical/40 p-5"
      aria-label="Recommended next test"
    >
      <p className="label-caps text-practical">Next best test</p>
      <h2 className="mt-1 text-lg font-semibold">{test.name}</h2>
      <p className="mt-2 text-sm text-shop-muted">{test.reason}</p>

      <dl className="mt-4 flex flex-wrap gap-4 text-xs text-shop-muted">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" aria-hidden />
          <dt className="sr-only">Estimated time</dt>
          <dd>{test.estimatedMinutes} min</dd>
        </div>
        <div className="flex items-center gap-1.5">
          <Wrench className="h-4 w-4" aria-hidden />
          <dt className="sr-only">Difficulty</dt>
          <dd className="capitalize">{test.difficulty}</dd>
        </div>
      </dl>

      {test.requiredTools.length > 0 ? (
        <div className="mt-4">
          <p className="label-caps mb-1.5">Tools</p>
          <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
            {test.requiredTools.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {test.safetyWarnings.length > 0 ? (
        <div className="mt-4 rounded-lg border border-caution/50 bg-caution/10 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-caution">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            Safety
          </p>
          <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
            {test.safetyWarnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {test.possibleInterpretations.length > 0 ? (
        <div className="mt-4">
          <p className="label-caps mb-1.5">What the result would mean</p>
          <ul className="list-disc space-y-0.5 pl-5 text-xs text-shop-muted">
            {test.possibleInterpretations.map((interpretation) => (
              <li key={interpretation}>{interpretation}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {test.procedureId ? (
        <div className="mt-5">
          {blocked ? (
            <p className="rounded-lg border border-danger/50 bg-danger/10 p-3 text-xs text-shop-muted">
              The guided procedure is available, but the exact specification is
              locked. You can open it to read the steps; no value will be shown
              until applicability is resolved.
            </p>
          ) : null}
          <Link
            className="btn-primary mt-3"
            href={`/repair/${test.procedureId}?sessionId=${sessionId}`}
          >
            Open guided procedure
          </Link>
        </div>
      ) : null}
    </section>
  );
}
