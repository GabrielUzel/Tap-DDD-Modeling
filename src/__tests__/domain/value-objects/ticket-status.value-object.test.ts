import { describe, it, expect } from "bun:test";
import { TicketStatus } from "../../../domain/@shared/value-objects/ticket-status.value";

describe("TicketStatus value object tests", () => {
  describe("Factory (fromString)", () => {
    it("Should create OPEN status from 'OPEN' and 'open'", () => {
      expect(TicketStatus.fromString("OPEN").isOpen()).toBeTrue();
      expect(TicketStatus.fromString("open").isOpen()).toBeTrue();
    });

    it("Should create PAID status from 'PAID' and 'paid'", () => {
      expect(TicketStatus.fromString("PAID").isPaid()).toBeTrue();
      expect(TicketStatus.fromString("paid").isPaid()).toBeTrue();
    });

    it("Should create CANCELLED status from 'CANCELLED' and 'Cancelled'", () => {
      expect(TicketStatus.fromString("CANCELLED").isCancelled()).toBeTrue();
      expect(TicketStatus.fromString("Cancelled").isCancelled()).toBeTrue();
    });

    it("Should throw error for invalid status", () => {
      expect(() => TicketStatus.fromString("invalid")).toThrowError(
        "Invalid ticket status",
      );
    });
  });

  describe("Methods", () => {
    it("equals should return true for same status", () => {
      expect(TicketStatus.OPEN.equals(TicketStatus.OPEN)).toBeTrue();
    });

    it("getValue should return string representation", () => {
      expect(TicketStatus.OPEN.getValue()).toBe("OPEN");
    });
  });
});
