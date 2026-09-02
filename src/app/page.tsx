import Image from "next/image";
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
            Build the vehicle profile, describe the symptom, and work through one
            useful test at a time. Missing details and unverified sources stay
            visible.
          </p>
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[.16em] text-shop-muted md:block">
          Diagnostic session · new
        </p>
      </section>

      <VehicleWizard />

      <section
        className="panel overflow-hidden"
        aria-labelledby="diagnostic-loop-heading"
      >
        <div className="grid lg:grid-cols-[1.08fr_.92fr]">
          <figure className="relative min-h-72 overflow-hidden border-b border-shop-line lg:min-h-[30rem] lg:border-b-0 lg:border-r">
            <Image
              src="/images/workshop-diagnostic.jpg"
              alt="A mechanic methodically checking a classic four-wheel drive with a multimeter in a working garage"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              loading="eager"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-shop-deep/80 via-transparent to-transparent"
              aria-hidden
            />
            <figcaption className="absolute bottom-0 left-0 max-w-md p-5 text-xs leading-5 text-[#e2dbd0]">
              A careful diagnostic starts with an observation and a measurement—not
              a parts order. Editorial image; not diagnostic evidence.
            </figcaption>
          </figure>

          <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <p className="label-caps text-practical">The diagnostic loop</p>
            <h2
              id="diagnostic-loop-heading"
              className="mt-2 text-2xl font-semibold tracking-[-.025em] text-[#f3eee5]"
            >
              One useful test at a time.
            </h2>
            <p className="mt-3 text-sm leading-6 text-shop-muted">
              Cruiser Copilot starts with the exact vehicle, keeps unknowns visible,
              and recommends the next test most likely to change the ranking.
            </p>

            <ol className="mt-7 space-y-5">
              {[
                [
                  "01",
                  "Identify what actually applies",
                  "Series, engine, market, and equipment stay attached to every claim.",
                ],
                [
                  "02",
                  "Separate observations from claims",
                  "Your measurements, factory instructions, and community experience keep distinct labels.",
                ],
                [
                  "03",
                  "Record the test and outcome",
                  "Each result changes what comes next and leaves a useful service history.",
                ],
              ].map(([number, title, detail]) => (
                <li key={number} className="grid grid-cols-[2.25rem_1fr] gap-3">
                  <span className="font-mono text-xs text-practical">{number}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-shop-text">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-shop-muted">
                      {detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-8 border-l border-caution/60 pl-4 text-xs leading-5 text-shop-muted">
              Community experience can add context. It never becomes a factory
              specification.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
