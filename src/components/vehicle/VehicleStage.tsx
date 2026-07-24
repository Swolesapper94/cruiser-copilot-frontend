"use client";

import anime from "animejs";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { VisualFocus } from "@/types";
import { VehicleArt } from "./VehicleArt";

interface VehicleStageProps {
  focus: VisualFocus;
  caption?: string;
}

const FOCUS_LABEL: Record<VisualFocus, string> = {
  "front-three-quarter": "Front three-quarter",
  "driver-side": "Driver side",
  "rear-three-quarter": "Rear three-quarter",
  "rear-exhaust": "Rear / exhaust",
  "engine-bay": "Engine bay",
  dashboard: "Dashboard",
  "pump-detail": "Injection pump area",
};

const CAMERA: Record<
  VisualFocus,
  { rotate: number; scale: number; x: number; y: number }
> = {
  "front-three-quarter": { rotate: -6, scale: 1, x: 18, y: 0 },
  "driver-side": { rotate: 0, scale: 1.02, x: 0, y: 0 },
  "rear-three-quarter": { rotate: 6, scale: 1, x: -18, y: 0 },
  "rear-exhaust": { rotate: 4, scale: 1.35, x: -70, y: -18 },
  "engine-bay": { rotate: -3, scale: 1.5, x: 55, y: 10 },
  dashboard: { rotate: 0, scale: 1.45, x: 0, y: 6 },
  "pump-detail": { rotate: -2, scale: 1.9, x: 60, y: 14 },
};

/**
 * Cinematic camera move between viewpoints.
 *
 * Motion is decoration only. The viewpoint is always stated in text as well, so
 * the stage is equally usable with reduced motion or with animation disabled.
 */
export function VehicleStage({ focus, caption }: VehicleStageProps) {
  const artRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const node = artRef.current;
    if (!node) return;

    const camera = CAMERA[focus];

    if (reducedMotion) {
      node.style.transform = `translate(${camera.x}px, ${camera.y}px) rotate(${camera.rotate}deg) scale(${camera.scale})`;
      node.style.opacity = "1";
      return;
    }

    const animation = anime({
      targets: node,
      translateX: camera.x,
      translateY: camera.y,
      rotate: camera.rotate,
      scale: camera.scale,
      opacity: [0.72, 1],
      easing: "cubicBezier(0.22, 1, 0.36, 1)",
      duration: 900,
    });

    return () => {
      animation.pause();
    };
  }, [focus, reducedMotion]);

  return (
    <section
      className="panel relative overflow-hidden"
      aria-label="Vehicle viewpoint"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40 [background:repeating-linear-gradient(180deg,rgba(90,210,230,0.05)_0px,rgba(90,210,230,0.05)_1px,transparent_1px,transparent_4px)]" />

      <div className="relative flex h-[260px] items-center justify-center sm:h-[320px]">
        <div ref={artRef} className="w-[min(560px,92%)] will-change-transform">
          <VehicleArt focus={focus} className="h-auto w-full" />
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-shop-line px-4 py-3">
        <p className="label-caps">View: {FOCUS_LABEL[focus]}</p>
        {caption ? (
          <p className="text-xs text-shop-muted">{caption}</p>
        ) : null}
        {reducedMotion ? (
          <p className="text-[11px] text-shop-muted">Reduced motion active</p>
        ) : null}
      </div>
    </section>
  );
}
