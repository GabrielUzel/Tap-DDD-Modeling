export class TicketStatus {
  private constructor(private readonly value: "OPEN" | "PAID" | "CANCELLED") {}

  static OPEN = new TicketStatus("OPEN");
  static PAID = new TicketStatus("PAID");
  static CANCELLED = new TicketStatus("CANCELLED");

  isOpen(): boolean {
    return this.value === "OPEN";
  }

  isPaid(): boolean {
    return this.value === "PAID";
  }

  isCancelled(): boolean {
    return this.value === "CANCELLED";
  }

  toString(): string {
    return this.value;
  }

  static fromString(status: string): TicketStatus {
    switch (status) {
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
