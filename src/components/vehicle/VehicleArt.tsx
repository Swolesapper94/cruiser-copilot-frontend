"use client";

import type { VisualFocus } from "@/types";

interface VehicleArtProps {
  focus: VisualFocus;
  className?: string;
}

const HIGHLIGHTS: Record<VisualFocus, { x: number; y: number; r: number }> = {
  "front-three-quarter": { x: 62, y: 108, r: 34 },
  "driver-side": { x: 150, y: 104, r: 44 },
  "rear-three-quarter": { x: 244, y: 108, r: 34 },
  "rear-exhaust": { x: 252, y: 138, r: 22 },
  "engine-bay": { x: 96, y: 82, r: 30 },
  dashboard: { x: 158, y: 78, r: 26 },
  "pump-detail": { x: 108, y: 92, r: 20 },
};

/**
 * Original schematic line art. Deliberately generic: it communicates viewpoint,
 * not factory geometry, and is never used as a technical reference.
 */
export function VehicleArt({ focus, className }: VehicleArtProps) {
  const highlight = HIGHLIGHTS[focus];

  return (
    <svg
      viewBox="0 0 320 190"
      className={className}
      role="img"
      aria-label={`Schematic Land Cruiser illustration, ${focus.replace(/-/g, " ")} view`}
    >
      <defs>
        <linearGradient id="body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2027" />
          <stop offset="100%" stopColor="#0D1014" />
        </linearGradient>
      </defs>

      <ellipse cx="160" cy="168" rx="120" ry="10" fill="#0A0C0F" opacity="0.9" />

      {/* body */}
      <path
        d="M40 132 L40 104 Q40 96 50 94 L86 88 L104 62 Q108 56 118 56 L206 56 Q216 56 220 62 L238 88 L272 94 Q282 96 282 104 L282 132 Z"
        fill="url(#body)"
        stroke="#2C333C"
        strokeWidth="1.5"
      />
      {/* glasshouse */}
      <path
        d="M112 86 L126 64 L200 64 L214 86 Z"
        fill="#0B0F14"
        stroke="#39424D"
        strokeWidth="1.2"
      />
      <line x1="163" y1="64" x2="163" y2="86" stroke="#39424D" strokeWidth="1.2" />

      {/* snorkel */}
      <path
        d="M104 88 L104 52 Q104 46 110 46"
        fill="none"
        stroke="#39424D"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* wheels */}
      <circle cx="86" cy="140" r="22" fill="#0A0D11" stroke="#39424D" strokeWidth="2" />
      <circle cx="86" cy="140" r="9" fill="#151A20" />
      <circle cx="236" cy="140" r="22" fill="#0A0D11" stroke="#39424D" strokeWidth="2" />
      <circle cx="236" cy="140" r="9" fill="#151A20" />

      {/* lamps + exhaust hint */}
      <rect x="41" y="106" width="10" height="8" rx="2" fill="#5AD2E6" opacity="0.55" />
      <rect x="271" y="106" width="10" height="8" rx="2" fill="#FF6B6B" opacity="0.5" />
      <path
        d="M266 136 q10 0 12 -6"
        fill="none"
        stroke="#39424D"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* focus marker */}
      <circle
        cx={highlight.x}
        cy={highlight.y}
        r={highlight.r}
        fill="none"
        stroke="#F2A93B"
        strokeWidth="1.5"
        strokeDasharray="4 5"
        opacity="0.85"
      />
      <circle cx={highlight.x} cy={highlight.y} r="2.5" fill="#F2A93B" />
    </svg>
  );
}
