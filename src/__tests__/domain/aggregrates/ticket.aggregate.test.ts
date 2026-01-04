import { describe, it, expect, beforeEach } from "bun:test";
import { Ticket } from "../../../domain/ticket/ticket.aggregate";
import { Uuid } from "../../../domain/@shared/interfaces/uuid";
import { SaleItem } from "../../../domain/@shared/value-objects/sale-item.value";
import { Money } from "../../../domain/@shared/value-objects/money.value";
import { TicketStatus } from "../../../domain/@shared/value-objects/ticket-status.value";

describe("Ticket aggregate tests", () => {
  let sellerId: Uuid;
  let operatorId: Uuid;
  let catalogId: Uuid;
  let operationId: Uuid;
  let item: SaleItem;

  beforeEach(() => {
    sellerId = Uuid.generate();
    operatorId = Uuid.generate();
    catalogId = Uuid.generate();
    operationId = Uuid.generate();
    item = SaleItem.create(Uuid.generate(), 1, Money.create(100, "BRL"));
  });

  describe("Factory (create)", () => {
    it("Should create ticket with OPEN status", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      expect(ticket).toBeInstanceOf(Ticket);
      expect(ticket.status.isOpen()).toBeTrue();
      expect(ticket.status).toBe(TicketStatus.OPEN);
      expect(ticket.paidAt).toBeNull();
      expect(ticket.totalAmountInCents).toBe(100);
    });

    it("Should throw error if items list is empty", () => {
      expect(() =>
        Ticket.create(
          Uuid.generate(),
          sellerId,
          operatorId,
          catalogId,
          operationId,
          [],
        ),
      ).toThrowError("Ticket must contain at least one item");
    });
  });

  describe("State transitions", () => {
    it("Should mark ticket as paid", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      const paymentDate = new Date();
      ticket.markAsPaid(paymentDate);

      expect(ticket.status.isPaid()).toBeTrue();
      expect(ticket.paidAt).toEqual(paymentDate);
    });

    it("Should cancel ticket", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      ticket.cancel();

      expect(ticket.status.isCancelled()).toBeTrue();
    });
  });

  describe("Business rules validation", () => {
    it("Should throw error when marking a paid ticket as paid again", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      ticket.markAsPaid();

      expect(() => ticket.markAsPaid()).toThrowError(
        "Only open tickets can be marked as paid",
      );
    });

    it("Should throw error when marking a cancelled ticket as paid", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      ticket.cancel();

      expect(() => ticket.markAsPaid()).toThrowError(
        "Only open tickets can be marked as paid",
      );
    });

    it("Should throw error when cancelling a paid ticket", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      ticket.markAsPaid();

      expect(() => ticket.cancel()).toThrowError(
        "Only open tickets can be cancelled",
      );
    });

    it("Should throw error when cancelling an already cancelled ticket", () => {
      const ticket = Ticket.create(
        Uuid.generate(),
        sellerId,
        operatorId,
        catalogId,
        operationId,
        [item],
      );

      ticket.cancel();

      expect(() => ticket.cancel()).toThrowError(
        "Only open tickets can be cancelled",
      );
    });
  });

  describe("Serialization (fromJSON)", () => {
    it("Should restore ticket from JSON", () => {
      const id = Uuid.generate();
      const paidDate = new Date();
      const itemValues = item.getValue();

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
        totalAmountInCents: 100,
        status: "PAID",
        paidAt: paidDate.toISOString(),
      };

      const ticket = Ticket.fromJSON(json);

      expect(ticket).toBeInstanceOf(Ticket);
      expect(ticket.status.isPaid()).toBeTrue();
      expect(ticket.paidAt).toEqual(paidDate);
      expect(ticket.items[0].equals(item)).toBeTrue();
    });
  });
});
