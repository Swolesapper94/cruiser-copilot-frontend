"use client";

import { useState } from "react";
import { Camera, Gauge } from "lucide-react";
import type { EvidenceItem } from "@/types";

interface EvidenceUploaderProps {
  evidence: EvidenceItem[];
  busy?: boolean;
  onSubmit: (payload: Record<string, unknown>) => void;
}

const MEASUREMENT_KEYS = [
  { value: "plunger-stroke", label: "Injection pump plunger stroke", unit: "mm" },
  { value: "glow-plug-resistance", label: "Glow plug resistance", unit: "ohm" },
  { value: "compression", label: "Cylinder compression", unit: "kPa" },
];

export function EvidenceUploader({
  evidence,
  busy,
  onSubmit,
}: EvidenceUploaderProps) {
  const [mode, setMode] = useState<"media" | "measurement">("media");
  const [description, setDescription] = useState("");
  const [engineTemperature, setEngineTemperature] = useState("unknown");
  const [relationToRepair, setRelationToRepair] = useState("unknown");
  const [file, setFile] = useState<File | null>(null);
  const [measurementKey, setMeasurementKey] = useState(MEASUREMENT_KEYS[0].value);
  const [measurementValue, setMeasurementValue] = useState("");

  const selectedMeasurement =
    MEASUREMENT_KEYS.find((entry) => entry.value === measurementKey) ??
    MEASUREMENT_KEYS[0];

  function submit(event: React.FormEvent) {
    event.preventDefault();

    if (mode === "measurement") {
      const numeric = Number(measurementValue);
      if (!Number.isFinite(numeric)) return;
      onSubmit({
        type: "measurement",
        userDescription: description || undefined,
        captureConditions: { engineTemperature, relationToRepair },
        measurement: {
          key: selectedMeasurement.value,
          value: numeric,
          unit: selectedMeasurement.unit,
        },
      });
      setMeasurementValue("");
      setDescription("");
      return;
    }

    onSubmit({
      type: file?.type.startsWith("video")
        ? "video"
        : file?.type.startsWith("audio")
          ? "audio"
          : file
            ? "photo"
            : "observation",
      userDescription: description || undefined,
      captureConditions: { engineTemperature, relationToRepair },
      fileName: file?.name,
      mimeType: file?.type,
      sizeBytes: file?.size,
      allowModelAnalysis: false,
    });
    setFile(null);
    setDescription("");
  }

  return (
    <section className="panel p-5" aria-label="Add evidence">
      <h2 className="text-base font-semibold">Add evidence</h2>
      <p className="mt-1 text-xs text-shop-muted">
        Files stay on this device. Cruiser Copilot records only the filename,
        type, size, and your written observation; it does not upload or analyze
        the selected file.
      </p>

      <div className="mt-4 flex gap-2" role="tablist" aria-label="Evidence type">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "media"}
          className={mode === "media" ? "btn-primary" : "btn-secondary"}
          onClick={() => setMode("media")}
        >
          <Camera className="h-4 w-4" aria-hidden />
          Photo / video / note
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "measurement"}
          className={mode === "measurement" ? "btn-primary" : "btn-secondary"}
          onClick={() => setMode("measurement")}
        >
          <Gauge className="h-4 w-4" aria-hidden />
          Measurement
        </button>
      </div>

      <form className="mt-4 space-y-4" onSubmit={submit}>
        {mode === "media" ? (
          <div>
            <label className="label-caps block" htmlFor="evidence-file">
              File (optional)
            </label>
            <input
              id="evidence-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,audio/mpeg,audio/mp4"
              className="field mt-1.5 file:mr-3 file:rounded file:border-0 file:bg-shop-line file:px-2 file:py-1 file:text-xs file:text-shop-text"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label-caps block" htmlFor="measurement-key">
                What did you measure?
              </label>
              <select
                id="measurement-key"
                className="field mt-1.5"
                value={measurementKey}
                onChange={(event) => setMeasurementKey(event.target.value)}
              >
                {MEASUREMENT_KEYS.map((entry) => (
                  <option key={entry.value} value={entry.value}>
                    {entry.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-caps block" htmlFor="measurement-value">
                Value ({selectedMeasurement.unit})
              </label>
              <input
                id="measurement-value"
                type="number"
                step="any"
                inputMode="decimal"
                className="field mt-1.5"
                value={measurementValue}
                onChange={(event) => setMeasurementValue(event.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div>
          <label className="label-caps block" htmlFor="evidence-description">
            Describe what you observed
          </label>
          <textarea
            id="evidence-description"
            className="field mt-1.5 min-h-20"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label-caps block" htmlFor="engine-temperature">
              Engine temperature
            </label>
            <select
              id="engine-temperature"
              className="field mt-1.5"
              value={engineTemperature}
              onChange={(event) => setEngineTemperature(event.target.value)}
            >
              <option value="unknown">Not sure</option>
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
            </select>
          </div>
          <div>
            <label className="label-caps block" htmlFor="relation-to-repair">
              Before or after work?
            </label>
            <select
              id="relation-to-repair"
              className="field mt-1.5"
              value={relationToRepair}
              onChange={(event) => setRelationToRepair(event.target.value)}
            >
              <option value="unknown">Not sure</option>
              <option value="before">Before</option>
              <option value="after">After</option>
            </select>
          </div>
        </div>

        <button className="btn-primary" type="submit" disabled={busy}>
          Save evidence note
        </button>
      </form>

      {evidence.length > 0 ? (
        <ul className="mt-5 space-y-2">
          {evidence.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-shop-line bg-shop-deep p-3 text-xs"
            >
              <p className="font-medium capitalize text-shop-text">
                {item.type}
                {item.measurement
                  ? ` — ${item.measurement.value} ${item.measurement.unit}`
                  : ""}
              </p>
              {item.userDescription ? (
                <p className="mt-0.5 text-shop-muted">
                  <span className="font-semibold">You observed:</span>{" "}
                  {item.userDescription}
                </p>
              ) : null}
              {item.machineObservation ? (
                <p className="mt-0.5 text-shop-muted">
                  <span className="font-semibold">Model observed:</span>{" "}
                  {item.machineObservation}
                </p>
              ) : null}
              {item.observationLimit ? (
                <p className="mt-0.5 italic text-shop-muted">
                  {item.observationLimit}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
