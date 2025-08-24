import { describe, it, expect, beforeEach } from "bun:test";
import { Money } from "../../../domain/value-objects/money.value";

describe("Money factory tests", () => {
  it("Should create money successfully", () => {
    const money = Money.create(10, "BRL");
    expect(money).toBeInstanceOf(Money);
  });

  it("Should throw error when value is less than zero", () => {
    expect(() => Money.create(-10, "BRL")).toThrowError("Value must be greater than zero");
  });
});