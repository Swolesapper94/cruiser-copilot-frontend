import { VehicleWizard } from "@/components/vehicle/VehicleWizard";

export default function HomePage() {
  return (
    <div className="space-y-7">
      <section className="grid gap-4 border-l border-practical/50 pl-5 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl">
          <p className="label-caps text-practical">Evidence-led diagnostics</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-.03em] text-[#f3eee5] sm:text-4xl">
            Identify the machine. Isolate the system. Prove the repair.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-shop-muted">
            The intake builds a precise vehicle profile, then routes your symptom
            to applicable manuals and scrutinized field experience.
          </p>
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[.16em] text-shop-muted md:block">
          Diagnostic session · new
        </p>
      </section>

      <VehicleWizard />
    </div>
  );
}
