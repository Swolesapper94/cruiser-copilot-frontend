"use client";

import { useState } from "react";
import type { Vehicle } from "@/types";

interface MissingDetailsFormProps {
  vehicle: Vehicle;
  missingFields: string[];
  busy?: boolean;
  onSubmit: (patch: Record<string, unknown>) => void;
}

const FIELD_LABELS: Record<string, string> = {
  series: "Series",
  modelCode: "Model code",
  productionYear: "Production year",
  market: "Destination market",
  engineCode: "Engine code",
  pumpModel: "Injection pump model",
  acsdConfiguration: "Cold-start advance device",
};

export function MissingDetailsForm({
  vehicle,
  missingFields,
  busy,
  onSubmit,
}: MissingDetailsFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});

  if (missingFields.length === 0) return null;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const patch: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(values)) {
      if (!value) continue;
      patch[key] = key === "productionYear" ? Number(value) : value;
    }
    if (Object.keys(patch).length === 0) return;
    onSubmit(patch);
    setValues({});
  }

  return (
    <section className="panel p-5" aria-label="Missing vehicle details">
      <h2 className="text-base font-semibold">Unlock the exact specification</h2>
      <p className="mt-1 text-xs text-shop-muted">
        These details decide which published value actually applies to your
        vehicle. Until they are known, no value is selected.
      </p>

      <form className="mt-4 space-y-3" onSubmit={submit}>
        {missingFields.map((field) => (
          <div key={field}>
            <label className="label-caps block" htmlFor={`missing-${field}`}>
              {FIELD_LABELS[field] ?? field}
            </label>
            {field === "acsdConfiguration" ? (
              <select
                id={`missing-${field}`}
                className="field mt-1.5"
                value={values[field] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
              >
                <option value="">Select…</option>
                <option value="present">Fitted</option>
                <option value="absent">Removed or bypassed</option>
                <option value="unknown">Not sure</option>
              </select>
            ) : field === "series" ? (
              <select
                id={`missing-${field}`}
                className="field mt-1.5"
                value={values[field] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
              >
                <option value="">Select…</option>
                <option value="70">70 Series</option>
                <option value="80">80 Series</option>
              </select>
            ) : field === "engineCode" ? (
              <select
                id={`missing-${field}`}
                className="field mt-1.5"
                value={values[field] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
              >
                <option value="">Select…</option>
                <option value="1HZ">1HZ</option>
                <option value="1HD-T">1HD-T</option>
              </select>
            ) : (
              <input
                id={`missing-${field}`}
                type={field === "productionYear" ? "number" : "text"}
                className="field mt-1.5"
                value={values[field] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field]: event.target.value,
                  }))
                }
              />
            )}
          </div>
        ))}

        <button className="btn-secondary" type="submit" disabled={busy}>
          Update vehicle
        </button>
      </form>

      <p className="mt-3 text-[11px] text-shop-muted">
        Currently identified as:{" "}
        <span className="font-mono text-shop-text">
          {vehicle.series === "unknown" ? "series ?" : `${vehicle.series} Series`} ·{" "}
          {vehicle.engineCode}
        </span>
      </p>
    </section>
  );
}
