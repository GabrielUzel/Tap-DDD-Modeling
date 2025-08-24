import { describe, it, expect } from "bun:test";
import { Uuid } from "../../../shared/uuid";

describe("Uuid factory tests", () => {
  it("Should create uuid", () => {
    const uuid = Uuid.generate();
    expect(uuid).toBeInstanceOf(Uuid);
  });

  it("Should throw error, id is invalid", () => {
    expect(() => new Uuid("Invalid id")).toThrowError("Invalid uuid format");
  });
});