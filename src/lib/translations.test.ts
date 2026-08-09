import { describe, it, expect } from "vitest";
import { getTranslation, type Language } from "./translations";

describe("Translations", () => {
  it("should return the correct translation for an existing key in English", () => {
    const text = getTranslation("admin.common.add", "en");
    expect(text).toBe("Add New");
  });

  it("should return the correct translation for an existing key in Hindi", () => {
    const text = getTranslation("admin.common.add", "hi");
    expect(text).toBe("नया जोड़ें");
  });

  it("should return the key itself if the translation key does not exist", () => {
    const text = getTranslation("non.existent.key", "en");
    expect(text).toBe("non.existent.key");
  });

  it("should handle nested looking keys properly (they are flat in the structure)", () => {
    const text = getTranslation("admin.sidebar.dashboard", "en");
    expect(text).toBe("Dashboard");
  });
});
