"use client";

import { useState } from "react";
import { BookMarked, MessageSquare } from "lucide-react";
import type { Citation } from "@/types";

const OEM_SOURCE_TYPES = new Set([
  "service_bulletin",
  "oem_manual",
  "oem_technical",
]);

/**
 * OEM and community material are rendered in separate, labelled groups with
 * distinct icons and wording. Colour alone never carries the distinction.
 */
export function CitationList({ citations }: { citations: Citation[] }) {
  if (citations.length === 0) return null;

  const oem = citations.filter((c) => OEM_SOURCE_TYPES.has(c.sourceType));
  const community = citations.filter((c) => !OEM_SOURCE_TYPES.has(c.sourceType));

  return (
    <section className="panel p-5" aria-label="Sources">
      <h2 className="text-base font-semibold">Where this comes from</h2>

      <div className="grid gap-x-6 lg:grid-cols-2 lg:items-start">
        <CitationGroup
          title="Official (OEM) material"
          description="Manufacturer documentation. Treat as authoritative for this vehicle when applicability matches."
          icon={<BookMarked className="h-4 w-4" aria-hidden />}
          badge="OEM"
          badgeClass="border-oem text-oem"
          citations={oem}
          emptyText="No OEM material matched this vehicle yet."
        />

        <CitationGroup
          title="Community &amp; technician reports"
          description="Owner and technician experience. Useful context. Never a substitute for an OEM instruction or value."
          icon={<MessageSquare className="h-4 w-4" aria-hidden />}
          badge="Community"
          badgeClass="border-community text-community"
          citations={community}
          emptyText="No community reports matched this vehicle yet."
        />
      </div>
    </section>
  );
}

function CitationGroup({
  title,
  description,
  icon,
  badge,
  badgeClass,
  citations,
  emptyText,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  badgeClass: string;
  citations: Citation[];
  emptyText: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const visibleCitations = showAll ? citations : citations.slice(0, 3);
  const hiddenCount = citations.length - visibleCitations.length;

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${badgeClass}`}
        >
          {icon}
          {badge}
        </span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-1 text-xs text-shop-muted">{description}</p>

      {citations.length === 0 ? (
        <p className="mt-2 text-xs italic text-shop-muted">{emptyText}</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {visibleCitations.map((citation) => (
            <li
              key={citation.id}
              className="rounded-lg border border-shop-line bg-shop-deep p-3 text-xs"
            >
              <p className="font-medium text-shop-text">{citation.label}</p>
              <p className="mt-0.5 text-shop-muted">{citation.locator}</p>
              <p className="mt-1 font-mono text-[10px] text-shop-muted">
                authority level {citation.authorityLevel} · {citation.sourceType}
                {citation.isPlaceholder ? " · placeholder record" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}

      {citations.length > 3 ? (
        <button
          type="button"
          className="btn-secondary mt-3 w-full justify-center"
          onClick={() => setShowAll((current) => !current)}
          aria-expanded={showAll}
        >
          {showAll
            ? `Show fewer ${badge.toLowerCase()} sources`
            : `Show ${hiddenCount} more ${badge.toLowerCase()} sources`}
        </button>
      ) : null}
    </div>
  );
}
