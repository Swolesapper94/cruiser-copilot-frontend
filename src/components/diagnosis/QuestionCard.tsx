"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import type { Question } from "@/types";

interface QuestionCardProps {
  question: Question;
  answeredCount: number;
  busy?: boolean;
  onAnswer: (value: string, freeText?: string) => void;
}

/** One question at a time. Never a form wall. */
export function QuestionCard({
  question,
  answeredCount,
  busy,
  onAnswer,
}: QuestionCardProps) {
  const [freeText, setFreeText] = useState("");
  const [showRationale, setShowRationale] = useState(false);

  return (
    <section className="panel p-5" aria-label="Current question">
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="label-caps">Question {answeredCount + 1}</p>
        <button
          type="button"
          className="btn-ghost !px-2 !py-1 text-xs"
          aria-expanded={showRationale}
          onClick={() => setShowRationale((value) => !value)}
        >
          <HelpCircle className="h-4 w-4" aria-hidden />
          Why this question?
        </button>
      </div>

      <h2 className="text-lg font-semibold">{question.prompt}</h2>
      {question.helpText ? (
        <p className="mt-1.5 text-sm text-shop-muted">{question.helpText}</p>
      ) : null}

      {showRationale ? (
        <p className="mt-3 rounded-lg border border-technical/40 bg-technical/5 p-3 text-sm text-shop-muted">
          {question.rationale}
        </p>
      ) : null}

      {question.kind === "single-select" ? (
        <ul className="mt-4 space-y-2">
          {question.options.map((option) => (
            <li key={option.value}>
              <button
                type="button"
                disabled={busy}
                onClick={() => onAnswer(option.value)}
                className="w-full rounded-xl border border-shop-line bg-shop-raised px-4 py-3 text-left transition-colors hover:border-technical/70 disabled:opacity-40"
              >
                <span className="block text-sm font-medium">{option.label}</span>
                {option.description ? (
                  <span className="mt-0.5 block text-xs text-shop-muted">
                    {option.description}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (!freeText.trim()) return;
            onAnswer(freeText.trim(), freeText.trim());
            setFreeText("");
          }}
        >
          <label className="label-caps block" htmlFor="free-text-answer">
            Your answer
          </label>
          <textarea
            id="free-text-answer"
            className="field min-h-24"
            value={freeText}
            onChange={(event) => setFreeText(event.target.value)}
          />
          <button className="btn-primary" type="submit" disabled={busy}>
            Continue
          </button>
        </form>
      )}
    </section>
  );
}
