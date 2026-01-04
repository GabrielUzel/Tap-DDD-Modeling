import { describe, it, expect } from "bun:test";
import { SaleItem } from "../../../domain/@shared/value-objects/sale-item.value";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { Money } from "../../../domain/@shared/value-objects/money.value";

describe("SaleItem value object tests", () => {
  const validItemId = Uuid.generate();
  const validPrice = Money.create(100, "BRL");

  describe("Factory (create)", () => {
    it("Should create sale item successfully", () => {
      const saleItem = SaleItem.create(validItemId, 2, validPrice);

      expect(saleItem).toBeInstanceOf(SaleItem);
    });

    it("Should throw error, quantity is less than 1", () => {
      expect(() => SaleItem.create(validItemId, 0, validPrice)).toThrowError(
        "Quantity must be greater than one",
      );
    });

    it("Should throw error, quantity is greater than 100", () => {
      expect(() => SaleItem.create(validItemId, 101, validPrice)).toThrowError(
        "Quantity must be lower than one hundred",
      );
    });
  });

  describe("Methods", () => {
    it("getTotal should calculate correctly", () => {
      const saleItem = SaleItem.create(validItemId, 5, validPrice);

      expect(saleItem.getTotal()).toBe(500);
    });

    it("equals should return true for identical items", () => {
      const item1 = SaleItem.create(validItemId, 2, validPrice);
      const item2 = SaleItem.create(validItemId, 2, validPrice);

      expect(item1.equals(item2)).toBeTrue();
    });

    it("getValue should return raw properties", () => {
      const saleItem = SaleItem.create(validItemId, 2, validPrice);
      const value = saleItem.getValue();

      expect(value.catalogItemId.equals(validItemId)).toBeTrue();
      expect(value.quantity).toBe(2);
      expect(value.salePrice.equals(validPrice)).toBeTrue();
    });
  });

  describe("Serialization", () => {
    it("Should create from JSON", () => {
      const json = {
        catalogItemId: validItemId.getValue(),
        quantity: 3,
        salePriceInCents: 150,
        salePriceCurrency: "BRL",
      };

      const saleItem = SaleItem.fromJSON(json);

      expect(saleItem).toBeInstanceOf(SaleItem);
      expect(saleItem.getTotal()).toBe(450);
      expect(saleItem.getValue().salePrice.getAmount()).toBe(150);
      expect(saleItem.getValue().salePrice.getSufix()).toBe("BRL");
    });
  });
});
