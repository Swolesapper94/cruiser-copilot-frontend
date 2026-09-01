"use client";

import type { VisualFocus } from "@/types";

interface VehicleArtProps {
  focus: VisualFocus;
  className?: string;
}

const TARGET: Record<
  VisualFocus,
  { x: number; y: number; label: string; anchorX: number; anchorY: number }
> = {
  "front-three-quarter": {
    x: 92,
    y: 221,
    label: "Platform",
    anchorX: 48,
    anchorY: 171,
  },
  "driver-side": {
    x: 303,
    y: 145,
    label: "Build plate",
    anchorX: 360,
    anchorY: 76,
  },
  "rear-three-quarter": {
    x: 600,
    y: 205,
    label: "Market equipment",
    anchorX: 570,
    anchorY: 84,
  },
  "rear-exhaust": {
    x: 648,
    y: 250,
    label: "Exhaust",
    anchorX: 608,
    anchorY: 300,
  },
  "engine-bay": {
    x: 185,
    y: 134,
    label: "Engine bay",
    anchorX: 82,
    anchorY: 66,
  },
  dashboard: {
    x: 354,
    y: 117,
    label: "Driver report",
    anchorX: 430,
    anchorY: 60,
  },
  "pump-detail": {
    x: 225,
    y: 160,
    label: "Injection pump",
    anchorX: 112,
    anchorY: 73,
  },
};

/**
 * Original diagnostic illustration. It is a location map, not a service
 * diagram; technical conclusions never come from the drawing.
 */
export function VehicleArt({ focus, className }: VehicleArtProps) {
  const target = TARGET[focus];

  return (
    <svg
      viewBox="0 0 720 360"
      className={className}
      role="img"
      aria-label={`Vehicle location map highlighting ${target.label}`}
    >
      <defs>
        <linearGradient id="vehicle-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8d3c8" />
          <stop offset="48%" stopColor="#a7a59d" />
          <stop offset="100%" stopColor="#666965" />
        </linearGradient>
        <linearGradient id="vehicle-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#253039" />
          <stop offset="100%" stopColor="#11171c" />
        </linearGradient>
        <radialGradient id="target-glow">
          <stop offset="0%" stopColor="#f0a548" stopOpacity=".36" />
          <stop offset="100%" stopColor="#f0a548" stopOpacity="0" />
        </radialGradient>
        <filter id="soft-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g className="vehicle-shadow">
        <ellipse cx="360" cy="292" rx="286" ry="24" fill="#020303" opacity=".55" />
        <ellipse cx="360" cy="284" rx="230" ry="11" fill="#9b6b2f" opacity=".09" />
      </g>

      <g className="vehicle-shell">
        <path
          d="M62 236 74 171q3-19 25-24l87-24 49-73q8-13 29-14h219q25 0 38 19l49 72 82 25q17 6 20 24l8 60-32 32H95Z"
          fill="url(#vehicle-body)"
          stroke="#e9e4d8"
          strokeOpacity=".52"
          strokeWidth="2"
        />
        <path
          d="m252 57-42 68h130V56Zm111-1v69h170l-47-58q-10-11-28-11Z"
          fill="url(#vehicle-glass)"
          stroke="#6f777a"
          strokeWidth="2"
        />
        <path d="M351 57v180M210 126l-11 111M535 126l10 111" fill="none" stroke="#575d5b" />
        <path d="M83 183h115M545 179h96" fill="none" stroke="#e7e2d6" strokeOpacity=".32" />
        <path d="M277 146h37M395 146h37" stroke="#343a39" strokeWidth="5" strokeLinecap="round" />
        <path
          d="M181 126 95 150 86 191h111Zm365 2 80 27 11 38h-93Z"
          fill="#858882"
          opacity=".75"
        />

        <g className="vehicle-wheel">
          <circle cx="179" cy="246" r="58" fill="#111414" stroke="#363b3a" strokeWidth="7" />
          <circle cx="179" cy="246" r="31" fill="#737873" stroke="#222626" strokeWidth="7" />
          <circle cx="179" cy="246" r="8" fill="#151918" />
        </g>
        <g className="vehicle-wheel">
          <circle cx="548" cy="246" r="58" fill="#111414" stroke="#363b3a" strokeWidth="7" />
          <circle cx="548" cy="246" r="31" fill="#737873" stroke="#222626" strokeWidth="7" />
          <circle cx="548" cy="246" r="8" fill="#151918" />
        </g>

        <rect x="72" y="189" width="28" height="27" rx="5" fill="#efe0ad" opacity=".9" />
        <rect x="630" y="190" width="25" height="29" rx="4" fill="#9a352c" />
        <path d="M620 252h48q14 0 17 12" fill="none" stroke="#555d5b" strokeWidth="8" strokeLinecap="round" />
        <path d="M137 123V69q0-14 13-14h12" fill="none" stroke="#353b39" strokeWidth="10" strokeLinecap="round" />

        <g className="technical-regions" fill="none" strokeLinecap="round">
          <path d="M113 157h145l19 65" stroke="#d0d1ca" strokeOpacity=".28" strokeDasharray="4 7" />
          <path d="M188 132c28 9 51 16 75 35" stroke="#f0a548" strokeOpacity={focus === "engine-bay" ? 1 : .16} strokeWidth="3" />
          <path d="m207 151 34 18-21 27-31-18Z" stroke="#f0a548" strokeOpacity={focus === "pump-detail" ? 1 : .16} strokeWidth="3" />
          <path d="M324 105h58v28h-58Z" stroke="#f0a548" strokeOpacity={focus === "dashboard" ? 1 : .14} strokeWidth="3" />
          <path d="M621 247h48" stroke="#f0a548" strokeOpacity={focus === "rear-exhaust" ? 1 : .14} strokeWidth="3" />
        </g>
      </g>

      <g className="vehicle-target" data-focus={focus}>
        <circle cx={target.x} cy={target.y} r="64" fill="url(#target-glow)" />
        <circle
          className="target-ring"
          cx={target.x}
          cy={target.y}
          r="29"
          fill="none"
          stroke="#f0a548"
          strokeWidth="2"
          strokeDasharray="5 7"
          filter="url(#soft-glow)"
        />
        <circle cx={target.x} cy={target.y} r="4" fill="#f0a548" />
        <path
          d={`M${target.x} ${target.y} L${target.anchorX} ${target.anchorY}`}
          fill="none"
          stroke="#f0a548"
          strokeWidth="1.5"
        />
        <rect
          x={target.anchorX - 5}
          y={target.anchorY - 22}
          width={Math.max(92, target.label.length * 7.4)}
          height="28"
          rx="4"
          fill="#171817"
          stroke="#5b4a33"
        />
        <text
          x={target.anchorX + 7}
          y={target.anchorY - 4}
          fill="#f4eee3"
          fontSize="12"
          fontWeight="650"
          letterSpacing=".04em"
        >
          {target.label.toUpperCase()}
        </text>
      </g>
    </svg>
  );
}
