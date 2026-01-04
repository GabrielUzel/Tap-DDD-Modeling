import { describe, it, expect } from "bun:test";
import {
  Money,
  type MoneySufix,
} from "../../../domain/@shared/value-objects/money.value";

describe("Money value object tests", () => {
  describe("Factory (create)", () => {
    it("Should create money successfully with BRL", () => {
      const money = Money.create(100, "BRL");

      expect(money).toBeInstanceOf(Money);
      expect(money.getAmount()).toBe(100);
      expect(money.getSufix()).toBe("BRL");
    });

    it("Should create money successfully with USD", () => {
      const money = Money.create(50, "USD");

      expect(money.getSufix()).toBe("USD");
    });

    it("Should throw error when value is less than zero", () => {
      expect(() => Money.create(-10, "BRL")).toThrowError(
        "Value must be greater than zero",
      );
    });

    it("Should throw error when suffix is invalid", () => {
      expect(() => Money.create(100, "EUR" as MoneySufix)).toThrowError(
        "Invalid money suffix",
      );
    });
  });

  describe("Methods", () => {
    it("getValue should return raw properties", () => {
      const money = Money.create(100, "BRL");

      expect(money.getValue()).toEqual({ amount: 100, sufix: "BRL" });
    });

    it("equals should return true for same amount and suffix", () => {
      const m1 = Money.create(100, "BRL");
      const m2 = Money.create(100, "BRL");

      expect(m1.equals(m2)).toBeTrue();
    });

    it("equals should return false for different amounts", () => {
      const m1 = Money.create(100, "BRL");
      const m2 = Money.create(200, "BRL");

      expect(m1.equals(m2)).toBeFalse();
    });

    it("equals should return false for different suffixes", () => {
      const m1 = Money.create(100, "BRL");
      const m2 = Money.create(100, "USD");

      expect(m1.equals(m2)).toBeFalse();
    });
  });
});
