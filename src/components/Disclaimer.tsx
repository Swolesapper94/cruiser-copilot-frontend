export function Disclaimer() {
  return (
    <footer className="mt-10 rounded-xl border border-shop-line/70 bg-shop-deep/70 p-4 text-xs leading-relaxed text-shop-muted">
      <p className="mb-1 font-semibold uppercase tracking-[0.14em] text-shop-text/80">
        Read this first
      </p>
      <p>
        Cruiser Copilot is a diagnostic aid, not a substitute for the factory
        service manual or a qualified technician. It ranks possibilities from the
        evidence you provide; it does not confirm root causes. Nothing here is a
        Toyota instruction unless it is explicitly labelled as coming from an OEM
        source. Never work under an unsupported vehicle, never open a hot
        pressurised cooling system, and stop if a step feels unsafe or beyond
        your equipment.
      </p>
    </footer>
  );
}
