import { describe, it, expect } from "bun:test";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";

describe("Uuid value object tests", () => {
  describe("Factory", () => {
    it("Should create random uuid successfully", () => {
      const id = Uuid.generate();

      expect(id).toBeInstanceOf(Uuid);
      expect(id.getValue()).toBeDefined();
      expect(typeof id.getValue()).toBe("string");
    });

    it("Should create uuid from valid string", () => {
      const validString = "123e4567-e89b-12d3-a456-426614174000";
      const id = new Uuid(validString);

      expect(id.getValue()).toBe(validString);
    });

    it("Should throw error when creating with invalid string", () => {
      expect(() => new Uuid("invalid-uuid-string")).toThrowError(
        "Invalid uuid format",
      );
    });
  });

  describe("Methods", () => {
    it("Equals should return true for same uuid value", () => {
      const idString = "123e4567-e89b-12d3-a456-426614174000";
      const uuid1 = new Uuid(idString);
      const uuid2 = new Uuid(idString);

      expect(uuid1.equals(uuid2)).toBeTrue();
    });

    it("Equals should return false for different uuid values", () => {
      const uuid1 = Uuid.generate();
      const uuid2 = Uuid.generate();

      expect(uuid1.equals(uuid2)).toBeFalse();
    });
  });
});
