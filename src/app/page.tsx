import { VehicleWizard } from "@/components/vehicle/VehicleWizard";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Start with the vehicle, not the guess.
        </h1>
        <p className="mt-2 text-sm text-shop-muted">
          Cruiser Copilot narrows a diesel Land Cruiser complaint down to the
          evidence that would actually settle it. It tells you what is still
          unknown, shows where every claim came from, and refuses to hand you a
          specification that may not apply to your truck.
        </p>
      </section>

      <VehicleWizard />
    </div>
  );
}
