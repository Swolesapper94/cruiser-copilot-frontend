"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { VehicleStage } from "@/components/vehicle/VehicleStage";
import { api } from "@/lib/client/api";
import type { VisualFocus } from "@/types";

interface DraftVehicle {
  series?: "70" | "80";
  engineCode?: "1HZ" | "1HD-T";
  modelCode?: string;
  productionYear?: number;
  market?: string;
  pumpModel?: string;
  acsdConfiguration?: "present" | "absent" | "unknown";
}

type StepId =
  | "series"
  | "engineCode"
  | "modelCode"
  | "productionYear"
  | "market"
  | "pumpModel"
  | "acsdConfiguration"
  | "complaint";

interface StepDefinition {
  id: StepId;
  title: string;
  help: string;
  focus: VisualFocus;
  optional: boolean;
  options?: Array<{ value: string; label: string; description?: string }>;
  inputType?: "text" | "number" | "textarea";
  placeholder?: string;
}

const STEPS: StepDefinition[] = [
  {
    id: "series",
    title: "Which series is it?",
    help: "70 Series and 80 Series differ enough that the same value rarely applies to both.",
    focus: "front-three-quarter",
    optional: false,
    options: [
      { value: "70", label: "70 Series", description: "HZJ7x, HDJ7x, PZJ7x" },
      { value: "80", label: "80 Series", description: "HZJ80, HDJ80, FZJ80" },
    ],
  },
  {
    id: "engineCode",
    title: "Which diesel engine?",
    help: "1HZ is naturally aspirated. 1HD-T is turbocharged. The diagnostic path is different.",
    focus: "engine-bay",
    optional: false,
    options: [
      { value: "1HZ", label: "1HZ", description: "4.2 naturally aspirated" },
      { value: "1HD-T", label: "1HD-T", description: "4.2 turbo" },
    ],
  },
  {
    id: "modelCode",
    title: "Model code, if you know it",
    help: "Usually on the build plate, for example HDJ80 or HZJ75.",
    focus: "driver-side",
    optional: true,
    inputType: "text",
    placeholder: "HDJ80",
  },
  {
    id: "productionYear",
    title: "Production year",
    help: "Specifications frequently change mid-generation, so the year matters.",
    focus: "driver-side",
    optional: true,
    inputType: "number",
    placeholder: "1994",
  },
  {
    id: "market",
    title: "Destination market",
    help: "Emissions and cold-start equipment vary by destination.",
    focus: "rear-three-quarter",
    optional: true,
    inputType: "text",
    placeholder: "EU, JDM, AU, ME…",
  },
  {
    id: "pumpModel",
    title: "Injection pump model",
    help: "On the pump body tag. Leave blank if you have not looked yet.",
    focus: "pump-detail",
    optional: true,
    inputType: "text",
    placeholder: "Pump tag number",
  },
  {
    id: "acsdConfiguration",
    title: "Is the cold-start advance device fitted?",
    help: "Some vehicles have had it removed or bypassed.",
    focus: "engine-bay",
    optional: true,
    options: [
      { value: "present", label: "Fitted" },
      { value: "absent", label: "Removed or bypassed" },
      { value: "unknown", label: "Not sure" },
    ],
  },
  {
    id: "complaint",
    title: "What is it doing?",
    help: "In your own words. You will be asked precise questions next.",
    focus: "dashboard",
    optional: true,
    inputType: "textarea",
    placeholder: "Hard to start when cold, white smoke for the first minute…",
  },
];

export function VehicleWizard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<DraftVehicle>({});
  const [complaint, setComplaint] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;

  const summary = useMemo(() => {
    const parts = [
      draft.series ? `${draft.series} Series` : null,
      draft.engineCode ?? null,
      draft.modelCode ?? null,
      draft.productionYear ? String(draft.productionYear) : null,
      draft.market ?? null,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(" · ") : "Nothing identified yet";
  }, [draft]);

  function commit(value: string | undefined) {
    if (step.id === "complaint") {
      setComplaint(value ?? "");
      return;
    }
    if (value === undefined || value === "") {
      setDraft((current) => ({ ...current, [step.id]: undefined }));
      return;
    }
    setDraft((current) => ({
      ...current,
      [step.id]:
        step.id === "productionYear" ? Number(value) : (value as string),
    }));
  }

  async function finish(finalComplaint: string) {
    setBusy(true);
    setError(null);
    try {
      const created = await api.createSession(finalComplaint);
      await api.patchVehicle(created.session.id, {
        ...draft,
        modifications: [],
      });
      router.push(`/diagnose/${created.session.id}`);
    } catch {
      setError("Could not start a session. Check the dev server and try again.");
      setBusy(false);
    }
  }

  function next(value?: string) {
    commit(value);
    setText("");
    if (isLast) {
      void finish(step.id === "complaint" ? (value ?? "") : complaint);
      return;
    }
    setIndex((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function back() {
    setText("");
    setIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <VehicleStage focus={step.focus} caption={summary} />

      <section className="panel p-5" aria-label="Vehicle identification">
        <div className="flex items-center justify-between">
          <p className="label-caps">
            Step {index + 1} of {STEPS.length}
          </p>
          {step.optional ? (
            <span className="text-[11px] text-shop-muted">Optional</span>
          ) : (
            <span className="text-[11px] text-practical">Required</span>
          )}
        </div>

        <h1 className="mt-2 text-xl font-semibold">{step.title}</h1>
        <p className="mt-1.5 text-sm text-shop-muted">{step.help}</p>

        {step.options ? (
          <ul className="mt-5 space-y-2">
            {step.options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => next(option.value)}
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
            className="mt-5 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              next(text.trim() || undefined);
            }}
          >
            <label className="sr-only" htmlFor={`field-${step.id}`}>
              {step.title}
            </label>
            {step.inputType === "textarea" ? (
              <textarea
                id={`field-${step.id}`}
                className="field min-h-24"
                placeholder={step.placeholder}
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            ) : (
              <input
                id={`field-${step.id}`}
                type={step.inputType === "number" ? "number" : "text"}
                inputMode={step.inputType === "number" ? "numeric" : undefined}
                className="field"
                placeholder={step.placeholder}
                value={text}
                onChange={(event) => setText(event.target.value)}
              />
            )}
            <div className="flex flex-wrap gap-2">
              <button className="btn-primary" type="submit" disabled={busy}>
                {isLast ? "Start diagnosis" : "Continue"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              {step.optional ? (
                <button
                  className="btn-secondary"
                  type="button"
                  disabled={busy}
                  onClick={() => next(undefined)}
                >
                  I don&apos;t know
                </button>
              ) : null}
            </div>
          </form>
        )}

        {step.optional && step.options ? (
          <button
            className="btn-ghost mt-3"
            type="button"
            disabled={busy}
            onClick={() => next(undefined)}
          >
            Skip this
          </button>
        ) : null}

        {index > 0 ? (
          <button className="btn-ghost mt-4" type="button" onClick={back}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        ) : null}

        <p className="mt-6 text-xs text-shop-muted">
          Anything you skip stays visible as a missing detail. Exact
          specifications stay locked until enough is known to choose the right
          one for your vehicle.
        </p>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-danger">
            {error}
          </p>
        ) : null}
      </section>
    </div>
  );
}
