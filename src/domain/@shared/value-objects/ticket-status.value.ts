import type { ValueObject } from "../interfaces/value-object.interface";

export type TicketStatusType = "OPEN" | "PAID" | "CANCELLED";

export class TicketStatus implements ValueObject<TicketStatusType> {
  private constructor(private readonly value: TicketStatusType) {}

  static readonly OPEN = new TicketStatus("OPEN");
  static readonly PAID = new TicketStatus("PAID");
  static readonly CANCELLED = new TicketStatus("CANCELLED");

  isOpen(): boolean {
    return this.value === "OPEN";
  }

  isPaid(): boolean {
    return this.value === "PAID";
  }

  isCancelled(): boolean {
    return this.value === "CANCELLED";
  }

  getValue(): TicketStatusType {
    return this.value;
  }

  equals(other: this): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }

  static fromString(status: string): TicketStatus {
    switch ((status ?? "").toUpperCase()) {
      case "OPEN":
        return TicketStatus.OPEN;
      case "PAID":
        return TicketStatus.PAID;
      case "CANCELLED":
        return TicketStatus.CANCELLED;
      default:
        throw new Error("Invalid ticket status");
    }
  }
}
