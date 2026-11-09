import { describe, it, expect } from "vitest";
import { seedSettings, seedProjects, seedTemplates } from "./seed";

describe("seed data", () => {
  it("has a brand name", () => {
    expect(seedSettings.brandName).toBeTruthy();
  });
  it("projects have gallery arrays", () => {
    for (const p of seedProjects) {
      expect(Array.isArray(p.gallery)).toBe(true);
      expect(p.gallery.length).toBeGreaterThan(0);
    }
  });
  it("templates non-empty", () => {
    expect(seedTemplates.length).toBeGreaterThan(0);
  });
});
