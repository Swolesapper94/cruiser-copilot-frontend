"use client";

import { useCallback, useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { CitationList } from "@/components/diagnosis/CitationList";
import { ConflictWarning } from "@/components/diagnosis/ConflictWarning";
import { HypothesisList } from "@/components/diagnosis/HypothesisList";
import { ProgressRail } from "@/components/diagnosis/ProgressRail";
import { QuestionCard } from "@/components/diagnosis/QuestionCard";
import { RecommendedTestCard } from "@/components/diagnosis/RecommendedTestCard";
import { SafetyGateBanner } from "@/components/diagnosis/SafetyGateBanner";
import { EvidenceUploader } from "@/components/evidence/EvidenceUploader";
import { MissingDetailsForm } from "@/components/vehicle/MissingDetailsForm";
import { VehicleStage } from "@/components/vehicle/VehicleStage";
import { api, type SessionPayload } from "@/lib/client/api";
import type { VisualFocus } from "@/types";

export function DiagnosticWorkspace({ sessionId }: { sessionId: string }) {
  const [payload, setPayload] = useState<SessionPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getSession(sessionId)
      .then((result) => {
        if (!cancelled) setPayload(result);
      })
      .catch(() => {
        if (!cancelled) setError("Session not found. Start a new one from the home page.");
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const run = useCallback(async (action: () => Promise<SessionPayload>) => {
    setBusy(true);
    setError(null);
    try {
      setPayload(await action());
    } catch {
      setError("That request did not go through. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }, []);

  if (error && !payload) {
    return (
      <p role="alert" className="panel p-5 text-sm text-danger">
        {error}
      </p>
    );
  }

  if (!payload) {
    return (
      <p className="panel p-5 text-sm text-shop-muted" aria-live="polite">
        Loading session…
      </p>
    );
  }

  const { session, update } = payload;
  const focus: VisualFocus = update.nextQuestion?.visualFocus ?? "engine-bay";

  return (
    <div className="space-y-6">
      <ProgressRail progress={update.progress} />

      <SafetyGateBanner gates={update.safetyGates} />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-6">
          <VehicleStage focus={focus} caption={session.complaint || undefined} />

          {update.nextQuestion ? (
            <QuestionCard
              question={update.nextQuestion}
              answeredCount={session.answers.length}
              busy={busy}
              onAnswer={(value, freeText) =>
                void run(() =>
                  api.answer(sessionId, update.nextQuestion!.id, value, freeText),
                )
              }
            />
          ) : (
            <section className="panel p-5">
              <h2 className="text-base font-semibold">Interview complete</h2>
              <p className="mt-1 text-sm text-shop-muted">
                Every question that would change the ranking has been answered.
                What is left is measurement.
              </p>
            </section>
          )}

          <section className="panel p-5" aria-label="Summary">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-base font-semibold">Where this stands</h2>
              <span className="label-caps">
                {update.explanationSource === "model"
                  ? "AI-explained"
                  : "Scripted"}
              </span>
            </div>
            <p className="mt-2 text-sm text-shop-muted">{update.summary}</p>
            {update.explanation ? (
              <p className="mt-3 rounded-lg border border-shop-line bg-shop-deep p-3 text-sm text-shop-muted">
                {update.explanation}
              </p>
            ) : null}
            <button
              type="button"
              className="btn-secondary mt-4"
              disabled={busy}
              onClick={() => void run(() => api.analyze(sessionId))}
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Explain in plain language
            </button>
          </section>

          <EvidenceUploader
            evidence={session.evidence}
            busy={busy}
            onSubmit={(item) => void run(() => api.addEvidence(sessionId, item))}
          />
        </div>

        <div className="space-y-6">
          <HypothesisList hypotheses={update.hypotheses} />

          {update.recommendedTest ? (
            <RecommendedTestCard
              test={update.recommendedTest}
              sessionId={sessionId}
              blocked={update.specificationLocked}
            />
          ) : (
            <section className="panel p-5">
              <p className="label-caps">Next best test</p>
              <p className="mt-2 text-sm text-shop-muted">
                Not enough is known yet to recommend a test that would be worth
                your time. Answer a few more questions first.
              </p>
            </section>
          )}

          <MissingDetailsForm
            vehicle={session.vehicle}
            missingFields={update.vehicleStatus.missingFields}
            busy={busy}
            onSubmit={(patch) =>
              void run(() => api.patchVehicle(sessionId, patch))
            }
          />

          <ConflictWarning
            conflicts={update.sourceConflicts}
            citations={update.citations}
          />

          <CitationList citations={update.citations} />
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
