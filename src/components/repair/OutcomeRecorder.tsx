"use client";

import { useState } from "react";
import type { Outcome } from "@/types";

interface OutcomeRecorderProps {
  outcome?: Outcome;
  performedTestIds: string[];
  busy?: boolean;
  onSubmit: (payload: Record<string, unknown>) => void;
}

const OPTIONS = [
  { value: "yes", label: "Fixed it" },
  { value: "partially", label: "Improved, not fixed" },
  { value: "no", label: "No change" },
  { value: "unknown", label: "Too early to tell" },
] as const;

export function OutcomeRecorder({
  outcome,
  performedTestIds,
  busy,
  onSubmit,
}: OutcomeRecorderProps) {
  const [resolved, setResolved] = useState<string>(outcome?.resolved ?? "unknown");
  const [notes, setNotes] = useState(outcome?.notes ?? "");

  return (
    <section className="panel p-5" aria-label="Record the outcome">
      <h2 className="text-base font-semibold">What actually happened?</h2>
      <p className="mt-1 text-xs text-shop-muted">
        Recording the result is what makes the next session better. A negative
        result is just as useful as a fix.
      </p>

      <form
        className="mt-4 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({
            resolved,
            performedTestIds,
            notes: notes.trim() || undefined,
          });
        }}
      >
        <fieldset>
          <legend className="label-caps mb-2">Result</legend>
          <div className="flex flex-wrap gap-2">
            {OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`cursor-pointer rounded-lg border px-3 py-2 text-sm ${
                  resolved === option.value
                    ? "border-technical bg-technical/10 text-shop-text"
                    : "border-shop-line bg-shop-raised text-shop-muted"
                }`}
              >
                <input
                  type="radio"
                  name="resolved"
                  className="sr-only"
                  value={option.value}
                  checked={resolved === option.value}
                  onChange={() => setResolved(option.value)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="label-caps block" htmlFor="outcome-notes">
            Notes
          </label>
          <textarea
            id="outcome-notes"
            className="field mt-1.5 min-h-24"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="What you found, what you changed, and how it behaves now."
          />
        </div>

        <button className="btn-primary" type="submit" disabled={busy}>
          Record outcome
        </button>
      </form>

      {outcome ? (
        <p className="mt-4 rounded-lg border border-confirm/40 bg-confirm/10 p-3 text-xs text-shop-muted">
          Outcome recorded ({outcome.resolved}) at{" "}
          {new Date(outcome.recordedAt).toLocaleString()}.
        </p>
      ) : null}
    </section>
  );
}