import { describe, it, expect } from "bun:test";
import { CatalogType } from "../../../domain/@shared/value-objects/catalog-type.value";

describe("CatalogType value object tests", () => {
  describe("Factory (fromString)", () => {
    it("Should create LOUNGE from 'lounge' and 'LOUNGE'", () => {
      expect(CatalogType.fromString("lounge").isLounge()).toBeTrue();
      expect(CatalogType.fromString("LOUNGE").isLounge()).toBeTrue();
    });

    it("Should create GENERAL from 'general' and 'General'", () => {
      expect(CatalogType.fromString("general").isGeneral()).toBeTrue();
      expect(CatalogType.fromString("General").isGeneral()).toBeTrue();
    });

    it("Should throw error for invalid type", () => {
      expect(() => CatalogType.fromString("vip")).toThrowError(
        "Invalid catalog type",
      );
    });
  });
});
