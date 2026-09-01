"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Gauge,
  ShieldCheck,
} from "lucide-react";
import { VehicleStage } from "@/components/vehicle/VehicleStage";
import { api } from "@/lib/client/api";
import type { VisualFocus } from "@/types";

interface DraftVehicle {
  manufacturer?: string;
  modelName?: string;
  submodel?: string;
  series?: string;
  engineCode?: string;
  modelCode?: string;
  productionYear?: number;
  market?: string;
  pumpModel?: string;
  acsdConfiguration?: "present" | "absent" | "unknown";
}

type StepId =
  | "modelName"
  | "series"
  | "submodel"
  | "engineCode"
  | "modelCode"
  | "productionYear"
  | "market"
  | "pumpModel"
  | "acsdConfiguration"
  | "complaint";

interface StepDefinition {
  id: StepId;
  eyebrow: string;
  title: string;
  help: string;
  focus: VisualFocus;
  targetLabel: string;
  optional: boolean;
  options?: Array<{ value: string; label: string; description?: string }>;
  inputType?: "text" | "number" | "textarea";
  placeholder?: string;
}

const STEPS: StepDefinition[] = [
  {
    id: "modelName",
    eyebrow: "Vehicle family",
    title: "What are we working on?",
    help: "The current evidence catalog is tuned for Toyota Land Cruisers. More platforms can use the same vehicle schema.",
    focus: "front-three-quarter",
    targetLabel: "Whole vehicle",
    optional: false,
    options: [
      {
        value: "Land Cruiser",
        label: "Toyota Land Cruiser",
        description: "70 and 80 Series diesel catalog",
      },
    ],
  },
  {
    id: "series",
    eyebrow: "Platform",
    title: "Which series?",
    help: "This narrows chassis, engine, market equipment, and the manuals that can actually apply.",
    focus: "driver-side",
    targetLabel: "Body & chassis",
    optional: false,
    options: [
      { value: "70", label: "70 Series", description: "HZJ7x · HDJ7x · PZJ7x" },
      { value: "80", label: "80 Series", description: "HZJ80 · HDJ80 · FZJ80" },
    ],
  },
  {
    id: "submodel",
    eyebrow: "Variant",
    title: "Trim or sub-model",
    help: "Use the badge or market name if you know it. This stays separate from the factory model code.",
    focus: "driver-side",
    targetLabel: "Variant details",
    optional: true,
    inputType: "text",
    placeholder: "GX, Sahara, Troop Carrier…",
  },
  {
    id: "engineCode",
    eyebrow: "Powertrain",
    title: "Which diesel engine?",
    help: "The engine family changes both the likely causes and the safe diagnostic path.",
    focus: "engine-bay",
    targetLabel: "Engine",
    optional: false,
    options: [
      { value: "1HZ", label: "1HZ", description: "4.2 L · naturally aspirated" },
      { value: "1HD-T", label: "1HD-T", description: "4.2 L · turbocharged" },
    ],
  },
  {
    id: "modelCode",
    eyebrow: "Factory identity",
    title: "What is the model code?",
    help: "Look on the build plate. This is often more precise than the badge on the body.",
    focus: "driver-side",
    targetLabel: "Build plate",
    optional: true,
    inputType: "text",
    placeholder: "HDJ80 or HZJ75",
  },
  {
    id: "productionYear",
    eyebrow: "Production",
    title: "What year was it built?",
    help: "Specifications and fitted equipment can change in the middle of a generation.",
    focus: "driver-side",
    targetLabel: "Build date",
    optional: true,
    inputType: "number",
    placeholder: "1994",
  },
  {
    id: "market",
    eyebrow: "Configuration",
    title: "Which destination market?",
    help: "Cold-start, emissions, and fuel-system equipment varies by destination.",
    focus: "rear-three-quarter",
    targetLabel: "Market equipment",
    optional: true,
    inputType: "text",
    placeholder: "Australia, JDM, EU, Middle East…",
  },
  {
    id: "pumpModel",
    eyebrow: "Fuel system",
    title: "Do you have the pump tag?",
    help: "Enter the number from the injection-pump body. Do not guess; skipping is safer.",
    focus: "pump-detail",
    targetLabel: "Injection pump",
    optional: true,
    inputType: "text",
    placeholder: "Pump model or tag number",
  },
  {
    id: "acsdConfiguration",
    eyebrow: "Cold-start system",
    title: "Is the advance device fitted?",
    help: "These are commonly removed or bypassed, so the original build specification may not describe the truck today.",
    focus: "engine-bay",
    targetLabel: "Cold-start device",
    optional: true,
    options: [
      { value: "present", label: "Fitted", description: "Present and connected" },
      { value: "absent", label: "Removed", description: "Removed or bypassed" },
      { value: "unknown", label: "Not sure", description: "We will keep it unresolved" },
    ],
  },
  {
    id: "complaint",
    eyebrow: "Driver report",
    title: "What is the vehicle doing?",
    help: "Describe what you see, hear, or smell and when it happens. The next screen will ask targeted diagnostic questions.",
    focus: "dashboard",
    targetLabel: "Reported symptom",
    optional: false,
    inputType: "textarea",
    placeholder: "Example: hard to start cold, white smoke for about a minute, then runs normally…",
  },
];

export function VehicleWizard() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<DraftVehicle>({});
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[index];
  const isLast = index === STEPS.length - 1;
  const progress = ((index + 1) / STEPS.length) * 100;

  const summaryParts = useMemo(
    () =>
      [
        draft.manufacturer,
        draft.modelName,
        draft.series ? `${draft.series} Series` : undefined,
        draft.submodel,
        draft.engineCode,
        draft.productionYear ? String(draft.productionYear) : undefined,
      ].filter((value): value is string => Boolean(value)),
    [draft],
  );

  function commit(value: string | undefined): DraftVehicle {
    if (step.id === "complaint") return draft;
    const nextDraft: DraftVehicle = {
      ...draft,
      [step.id]:
        value === undefined || value === ""
          ? undefined
          : step.id === "productionYear"
            ? Number(value)
            : value,
    };
    if (step.id === "modelName" && value === "Land Cruiser") {
      nextDraft.manufacturer = "Toyota";
    }
    setDraft(nextDraft);
    return nextDraft;
  }

  async function finish(finalComplaint: string) {
    if (!finalComplaint.trim()) {
      setError("Describe the symptom before starting the diagnosis.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const created = await api.createSession(finalComplaint.trim());
      await api.patchVehicle(created.session.id, {
        ...draft,
        modifications: [],
      });
      router.push(`/diagnose/${created.session.id}`);
    } catch {
      setError("Could not start a session. Check the backend and try again.");
      setBusy(false);
    }
  }

  function next(value?: string) {
    setError(null);
    commit(value);
    if (isLast) {
      void finish(value ?? text);
      return;
    }
    setText("");
    setIndex((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setText("");
    setIndex((current) => Math.max(current - 1, 0));
  }

  return (
    <div className="intake-shell">
      <div className="intake-visual">
        <VehicleStage
          focus={step.focus}
          targetLabel={step.targetLabel}
          caption={
            summaryParts.length > 0
              ? summaryParts.join(" · ")
              : "Identity will build here as you answer"
          }
        />
        <div className="evidence-strip">
          <span><ShieldCheck aria-hidden /> Applicability checked</span>
          <span><Gauge aria-hidden /> Unknowns stay visible</span>
          <span><CircleHelp aria-hidden /> No specification guessing</span>
        </div>
      </div>

      <section className="question-panel" aria-label="Vehicle identification">
        <div className="question-progress" aria-label={`Step ${index + 1} of ${STEPS.length}`}>
          <div className="flex items-center justify-between">
            <p className="label-caps">Guided intake</p>
            <p className="font-mono text-[10px] text-shop-muted">
              {String(index + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </p>
          </div>
          <div className="progress-track">
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="question-copy">
          <p className="question-eyebrow">{step.eyebrow}</p>
          <h1>{step.title}</h1>
          <p>{step.help}</p>
        </div>

        {step.options ? (
          <ul className="answer-list">
            {step.options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => next(option.value)}
                  className="answer-card group"
                >
                  <span className="answer-check"><Check className="h-3.5 w-3.5" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold text-shop-text">{option.label}</span>
                    {option.description ? (
                      <span className="mt-1 block text-xs leading-relaxed text-shop-muted">{option.description}</span>
                    ) : null}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-shop-muted transition-transform group-hover:translate-x-1 group-hover:text-practical" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const value = text.trim();
              if (!value && !step.optional) {
                setError("This detail is needed to continue.");
                return;
              }
              next(value || undefined);
            }}
          >
            <label className="sr-only" htmlFor={`field-${step.id}`}>{step.title}</label>
            {step.inputType === "textarea" ? (
              <textarea
                id={`field-${step.id}`}
                className="field min-h-36 resize-none"
                placeholder={step.placeholder}
                value={text}
                onChange={(event) => setText(event.target.value)}
                autoFocus
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
                autoFocus
              />
            )}
            <button className="btn-primary w-full sm:w-auto" type="submit" disabled={busy}>
              {busy ? "Starting…" : isLast ? "Start diagnosis" : "Continue"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </form>
        )}

        {error ? <p role="alert" className="mt-4 text-sm text-danger">{error}</p> : null}

        <div className="question-actions">
          <button className="btn-ghost px-0" type="button" onClick={back} disabled={index === 0 || busy}>
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
          {step.optional ? (
            <button className="skip-link" type="button" disabled={busy} onClick={() => next(undefined)}>
              I don&apos;t know — keep it unresolved
            </button>
          ) : (
            <span className="required-note">Required to narrow evidence</span>
          )}
        </div>
      </section>
    </div>
  );
}
