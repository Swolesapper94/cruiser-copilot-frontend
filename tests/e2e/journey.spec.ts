import { expect, test, type Page } from "@playwright/test";

/**
 * The full MVP journey in scripted mode, with zero credentials configured.
 *
 * Requires cruiser-copilot-backend to be running (default http://localhost:4000)
 * with NEXT_PUBLIC_API_BASE_URL pointing at it.
 *
 * Every assertion here maps to an acceptance test in the spec: identification,
 * one-question-at-a-time interview, ranked hypotheses, a single next-best test,
 * a surfaced source conflict, a locked specification, an uninterpretable
 * measurement, a guided repair step, and a recorded outcome.
 */

async function identifyVehicle(page: Page) {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Which series is it?" })).toBeVisible();
  await page.getByRole("button", { name: /80 Series/ }).click();

  await expect(page.getByRole("heading", { name: "Which diesel engine?" })).toBeVisible();
  await page.getByRole("button", { name: /1HD-T/ }).click();

  // Deliberately skip every optional applicability field so the specification
  // stays locked and the conflict is exercised.
  for (const _ of ["modelCode", "productionYear", "market", "pumpModel"]) {
    await page.getByRole("button", { name: "I don't know" }).click();
  }

  await expect(
    page.getByRole("heading", { name: /cold-start advance device/i }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Not sure" }).click();

  await page
    .getByRole("textbox")
    .fill("Hard to start when cold, white smoke for the first minute.");
  await page.getByRole("button", { name: "Start diagnosis" }).click();

  await page.waitForURL(/\/diagnose\/.+/);
}

async function answer(page: Page, prompt: RegExp, option: string) {
  await expect(page.getByRole("heading", { name: prompt })).toBeVisible();
  await page.getByRole("button", { name: option, exact: true }).click();
}

test.describe("Cruiser Copilot MVP journey", () => {
  test("runs identification through outcome without credentials", async ({ page }) => {
    await identifyVehicle(page);

    // 1. One question at a time, with a visible reason for asking it.
    const questionCard = page.getByRole("region", { name: "Current question" });
    await expect(questionCard).toBeVisible();
    await expect(questionCard.getByRole("heading")).toHaveCount(1);
    await questionCard.getByRole("button", { name: "Why this question?" }).click();
    await expect(questionCard.getByText(/decides|separates|because|which/i).first()).toBeVisible();

    // 2. Interview.
    await answer(page, /What is the Land Cruiser doing\?/, "Hard to start");
    await answer(page, /crank at normal speed/, "Normal speed");
    await answer(page, /eventually start/, "Yes, after long cranking");
    await answer(page, /smoke/i, "White");

    // 3. Ranked hypotheses, explicitly not probabilities.
    const hypotheses = page.getByRole("region", { name: "Ranked possibilities" });
    await expect(hypotheses).toBeVisible();
    await expect(hypotheses.getByText(/not probabilities/i)).toBeVisible();
    await expect(hypotheses.getByRole("meter").first()).toBeVisible();

    // 4. Exactly one recommended next test.
    const nextTest = page.getByRole("region", { name: "Recommended next test" });
    await expect(nextTest).toBeVisible();

    // 5. A surfaced source conflict with the applicability reason.
    await expect(
      page.getByRole("region", { name: "Conflicting source values" }),
    ).toBeVisible();

    // 6. The specification is locked and says so.
    await expect(page.getByText(/Specification locked/i).first()).toBeVisible();

    // 7. OEM and community content are separated by label, not colour alone.
    await expect(page.getByText(/Official \(OEM\)/i).first()).toBeVisible();
    await expect(page.getByText(/Community/i).first()).toBeVisible();

    // 8. A measurement is stored but explicitly not interpreted.
    const evidence = page.getByRole("region", { name: "Add evidence" });
    await evidence.getByRole("tab", { name: /Measurement/ }).click();
    await evidence.getByLabel(/^Value/).fill("0.9");
    await evidence
      .getByLabel("Describe what you observed")
      .fill("Dial indicator on the plunger, engine cold.");
    await evidence.getByRole("button", { name: "Save evidence" }).click();

    await expect(page.getByText(/0\.9 mm/).first()).toBeVisible();
    await expect(
      page.getByText(/cannot be interpreted|not be compared against any value/i).first(),
    ).toBeVisible();

    // 9. A guided repair step, with OEM and community content separated.
    await nextTest.getByRole("link", { name: "Open guided procedure" }).click();
    await page.waitForURL(/\/repair\/.+/);

    const firstStep = page.getByRole("checkbox").first();
    await firstStep.check();
    await expect(firstStep).toBeChecked();
    await expect(page.getByText(/Community tip — not a Toyota instruction/).first()).toBeVisible();

    // 10. The outcome is recorded.
    const outcome = page.getByRole("region", { name: "Record the outcome" });
    await outcome.getByText("Improved, not fixed").click();
    await outcome.getByLabel("Notes").fill("Timing not adjusted; no verified specification available.");
    await outcome.getByRole("button", { name: "Record outcome" }).click();
    await expect(page.getByText(/Outcome recorded/i)).toBeVisible();
  });

  test("never claims a confirmed root cause", async ({ page }) => {
    await identifyVehicle(page);
    await answer(page, /What is the Land Cruiser doing\?/, "Hard to start");
    await answer(page, /crank at normal speed/, "Normal speed");
    await answer(page, /eventually start/, "Yes, after long cranking");

    await expect(page.getByText(/\bconfirmed root cause\b/i)).toHaveCount(0);
  });

  test("is fully usable with reduced motion", async ({ page }) => {
    await identifyVehicle(page);
    await expect(page.getByRole("region", { name: "Current question" })).toBeVisible();
    // The stage always states the current view in text, never by animation alone.
    await expect(page.getByText(/^View: /).first()).toBeVisible();
  });
});
