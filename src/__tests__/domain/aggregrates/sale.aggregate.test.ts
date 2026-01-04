import { describe, it, expect, beforeEach } from "bun:test";
import { Sale } from "../../../domain/sale/sale.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { SaleItem } from "../../../domain/@shared/value-objects/sale-item.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";

describe("Sale aggregate tests", () => {
  let sellerId: Uuid;
  let operatorId: Uuid;
  let catalogId: Uuid;
  let operationId: Uuid;
  let ticketId: Uuid;
  let item1: SaleItem;
  let item2: SaleItem;

  beforeEach(() => {
    sellerId = Uuid.generate();
    operatorId = Uuid.generate();
    catalogId = Uuid.generate();
    operationId = Uuid.generate();
    ticketId = Uuid.generate();

    item1 = SaleItem.create(Uuid.generate(), 2, Money.create(100, "BRL"));
    item2 = SaleItem.create(Uuid.generate(), 1, Money.create(500, "BRL"));
  });

  describe("Factory (create)", () => {
    it("Should create sale successfully with correct total", () => {
      const items = [item1, item2];
      const sale = Sale.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        items,
        ticketId,
      );

      expect(sale).toBeInstanceOf(Sale);
      expect(sale.items.length).toBe(2);
      expect(sale.totalAmountInCents).toBe(700);
      expect(sale.ticketId.equals(ticketId)).toBeTrue();
    });

    it("Should throw error when creating sale with empty items", () => {
      expect(() =>
        Sale.create(
          Uuid.generate(),
          sellerId,
          operatorId,
          catalogId,
          operationId,
          [],
          ticketId,
        ),
      ).toThrowError("Sale must contain at least one item");
    });
  });

  describe("Serialization (fromJSON)", () => {
    it("Should restore sale from JSON", () => {
      const id = Uuid.generate();
      const itemValues = item1.getValue();

      const json = {
        id: id.getValue(),
        sellerId: sellerId.getValue(),
        operatorId: operatorId.getValue(),
        catalogId: catalogId.getValue(),
        operationId: operationId.getValue(),
        items: [
          {
            catalogItemId: itemValues.catalogItemId.getValue(),
            quantity: itemValues.quantity,
            salePriceInCents: itemValues.salePrice.getAmount(),
            salePriceCurrency: itemValues.salePrice.getSufix(),
          },
        ],
        totalAmountInCents: 200,
        ticketId: ticketId.getValue(),
      };

      const sale = Sale.fromJSON(json);

      expect(sale).toBeInstanceOf(Sale);
      expect(sale.getId().equals(id)).toBeTrue();
      expect(sale.totalAmountInCents).toBe(200);
      expect(sale.items.length).toBe(1);
      expect(sale.items[0].equals(item1)).toBeTrue();
    });
  });
});
