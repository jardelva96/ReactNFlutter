// src/lib/date.test.ts
import { describe, it, expect } from "vitest";
import { formatBr, isInRange } from "./date"; // <- ajuste os nomes

describe("lib/date.ts", () => {
  it("formata 2025-09-15 como 15/09/2025", () => {
    expect(formatBr("2025-09-15")).toBe("15/09/2025");
  });

  it("valida intervalo simples", () => {
    expect(isInRange("2025-09-15", "2025-09-10", "2025-09-20")).toBe(true);
    expect(isInRange("2025-09-09", "2025-09-10", "2025-09-20")).toBe(false);
  });
});
