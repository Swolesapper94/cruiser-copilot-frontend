"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SafetyGateBanner } from "@/components/diagnosis/SafetyGateBanner";
import { OutcomeRecorder } from "@/components/repair/OutcomeRecorder";
import { RepairChecklist } from "@/components/repair/RepairChecklist";
import { VehicleStage } from "@/components/vehicle/VehicleStage";
import { api, type ProcedurePayload, type SessionPayload } from "@/lib/client/api";

interface RepairWorkspaceProps {
  procedureId: string;
  sessionId?: string;
}

export function RepairWorkspace({ procedureId, sessionId }: RepairWorkspaceProps) {
  const [procedure, setProcedure] = useState<ProcedurePayload | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [optimisticStepIds, setOptimisticStepIds] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .getProcedure(procedureId, sessionId)
      .then((result) => {
        if (!cancelled) setProcedure(result);
      })
      .catch(() => {
        if (!cancelled) setError("That procedure could not be loaded.");
      });
    return () => {
      cancelled = true;
    };
  }, [procedureId, sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    api
      .getSession(sessionId)
      .then((result) => {
        if (!cancelled) setSession(result);
      })
      .catch(() => {
        /* The procedure is still readable without a session. */
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  const run = useCallback(async (action: () => Promise<SessionPayload>) => {
    setBusy(true);
    setError(null);
    try {
      setSession(await action());
    } catch {
      setError("That request did not go through. Nothing was changed.");
    } finally {
      setBusy(false);
    }
  }, []);

  if (error && !procedure) {
    return (
      <p role="alert" className="panel p-5 text-sm text-danger">
        {error}
      </p>
    );
  }

  if (!procedure) {
    return (
      <p className="panel p-5 text-sm text-shop-muted" aria-live="polite">
        Loading procedure…
      </p>
    );
  }

  const specificationLocked =
    session?.update.specificationLocked ?? procedure.specificationLocked;
  const completedStepIds =
    optimisticStepIds ?? session?.session.completedStepIds ?? procedure.completedStepIds;
  const gates = session?.update.safetyGates ?? procedure.safetyGates;

  return (
    <div className="space-y-6">
      {sessionId ? (
        <Link className="btn-ghost !px-0" href={`/diagnose/${sessionId}`}>
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to the diagnosis
        </Link>
      ) : null}

      <SafetyGateBanner gates={gates} />

      <VehicleStage focus={procedure.procedure.visualFocus} />

      <RepairChecklist
        procedure={procedure.procedure}
        citations={procedure.citations}
        completedStepIds={completedStepIds}
        specificationLocked={specificationLocked}
        busy={busy}
        onToggle={(stepId, completed) => {
          if (!sessionId) return;
          const previousStepIds = completedStepIds;
          const nextStepIds = completed
            ? [...new Set([...previousStepIds, stepId])]
            : previousStepIds.filter((id) => id !== stepId);

          setOptimisticStepIds(nextStepIds);
          setBusy(true);
          setError(null);
          void api
            .setStep(sessionId, stepId, completed)
            .then((result) => setSession(result))
            .catch(() => {
              setError("That request did not go through. Nothing was changed.");
            })
            .finally(() => {
              setOptimisticStepIds(null);
              setBusy(false);
            });
        }}
      />

      {sessionId ? (
        <OutcomeRecorder
          outcome={session?.session.outcome}
          performedTestIds={
            session?.update.recommendedTest
              ? [session.update.recommendedTest.id]
              : []
          }
          busy={busy}
          onSubmit={(payload) =>
            void run(() => api.recordOutcome(sessionId, payload))
          }
        />
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
