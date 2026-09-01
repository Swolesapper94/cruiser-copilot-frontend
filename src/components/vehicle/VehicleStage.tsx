"use client";

import { animate, createScope, spring } from "animejs";
import { Crosshair, ScanSearch } from "lucide-react";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { VisualFocus } from "@/types";
import { VehicleArt } from "./VehicleArt";

interface VehicleStageProps {
  focus: VisualFocus;
  caption?: string;
  targetLabel?: string;
}

const FOCUS_LABEL: Record<VisualFocus, string> = {
  "front-three-quarter": "Vehicle family",
  "driver-side": "Identification plate",
  "rear-three-quarter": "Market configuration",
  "rear-exhaust": "Exhaust system",
  "engine-bay": "Engine bay",
  dashboard: "Observed behavior",
  "pump-detail": "Fuel injection pump",
};

const CAMERA: Record<
  VisualFocus,
  { x: number; y: number; scale: number; rotate: number }
> = {
  "front-three-quarter": { x: 0, y: 4, scale: 0.96, rotate: -0.5 },
  "driver-side": { x: 0, y: 0, scale: 1.04, rotate: 0 },
  "rear-three-quarter": { x: -16, y: 2, scale: 1.02, rotate: 0.6 },
  "rear-exhaust": { x: -96, y: -2, scale: 1.27, rotate: 0 },
  "engine-bay": { x: 82, y: 28, scale: 1.3, rotate: -0.5 },
  dashboard: { x: 6, y: 34, scale: 1.28, rotate: 0 },
  "pump-detail": { x: 112, y: 20, scale: 1.48, rotate: -0.5 },
};

export function VehicleStage({ focus, caption, targetLabel }: VehicleStageProps) {
  const rootRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const camera = CAMERA[focus];

    if (reducedMotion) {
      const art = root.querySelector<HTMLElement>(".vehicle-camera");
      if (art) {
        art.style.transform = `translate(${camera.x}px, ${camera.y}px) rotate(${camera.rotate}deg) scale(${camera.scale})`;
      }
      return;
    }

    const scope = createScope({ root }).add(() => {
      animate(".vehicle-camera", {
        x: camera.x,
        y: camera.y,
        scale: camera.scale,
        rotate: camera.rotate,
        duration: 900,
        ease: "out(4)",
      });
      animate(".vehicle-target", {
        opacity: [0, 1],
        scale: [0.82, 1],
        duration: 650,
        delay: 180,
        ease: spring({ bounce: 0.35 }),
      });
      animate(".target-ring", {
        rotate: [0, 180],
        duration: 4400,
        loop: true,
        ease: "linear",
      });
      animate(".vehicle-wheel", {
        y: [0, -1.5, 0],
        duration: 1100,
        delay: (_, index) => (index ?? 0) * 80,
        ease: "inOut(2)",
      });
    });

    return () => scope.revert();
  }, [focus, reducedMotion]);

  return (
    <section ref={rootRef} className="vehicle-stage" aria-label="Vehicle system locator">
      <div className="stage-topline">
        <div>
          <p className="label-caps">Live vehicle map</p>
          <p className="mt-1 text-sm font-medium text-shop-text">{FOCUS_LABEL[focus]}</p>
        </div>
        <span className="target-badge">
          <Crosshair className="h-3.5 w-3.5" aria-hidden />
          {targetLabel ?? FOCUS_LABEL[focus]}
        </span>
      </div>

      <div className="stage-grid" aria-hidden />
      <div className="stage-scan" aria-hidden />

      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden sm:min-h-[410px] lg:min-h-[520px]">
        <div className="vehicle-camera w-[min(760px,116%)] origin-center will-change-transform">
          <VehicleArt focus={focus} className="h-auto w-full" />
        </div>
      </div>

      <div className="stage-footer">
        <div className="flex min-w-0 items-center gap-2">
          <ScanSearch className="h-4 w-4 shrink-0 text-practical" aria-hidden />
          <p className="truncate text-xs text-shop-muted">{caption ?? "Waiting for vehicle details"}</p>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[.14em] text-shop-muted">
          {reducedMotion ? "Motion off" : "Focus tracking"}
        </span>
      </div>
    </section>
  );
}
