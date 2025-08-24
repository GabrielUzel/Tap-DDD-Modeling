import { describe, it, expect, beforeEach } from "bun:test";
import { SaleItem } from "../../../domain/value-objects/sale-item.value";
import { Uuid } from "../../../shared/uuid";
import { Money } from "../../../domain/value-objects/money.value";

describe("Sale item factory tests", () => {
  it("Should create sale item successfully", () => {
    const saleItem = SaleItem.create(Uuid.generate(), 1, Money.create(10, "BRL"));
    expect(saleItem).toBeInstanceOf(SaleItem);
  });

  it("Should throw error, quantity is less than 1", () => {
    expect(() => SaleItem.create(Uuid.generate(), 0, Money.create(10, "BRL"))).toThrowError("Quantity must be greater than one");
  });

  it("Should throw error, quantity is greater than 100", () => {
    expect(() => SaleItem.create(Uuid.generate(), 101, Money.create(10, "BRL"))).toThrowError("Quantity must be lower than one hundred");
  });
});
