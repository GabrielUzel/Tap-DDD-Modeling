import { Command } from "@nestjs/cqrs";

export class RegisterSaleCommand extends Command<{
  saleId: string;
  totalAmountInCents: number;
}> {
  constructor(
    public readonly sellerId: string,
    public readonly operationId: string,
    public readonly operatorId: string,
    public readonly catalogId: string,
    public readonly items: {
      itemId: string;
      quantity: number;
    }[],
    public readonly ticketId: string,
  ) {
    super();
  }
}
