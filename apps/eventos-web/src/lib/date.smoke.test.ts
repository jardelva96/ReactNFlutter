/* src/lib/date.smoke.test.ts */
// @vitest-environment jsdom
import { it, expect } from "vitest";

it("smoke: src/lib/date.ts carrega sem crash", async () => {
  const mod = await import("./date");
  expect(mod).toBeTruthy();
});
