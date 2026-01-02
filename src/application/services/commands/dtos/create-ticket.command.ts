import { Command } from "@nestjs/cqrs";

export class CreateTicketCommand extends Command<{
  ticketId: string;
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
  ) {
    super();
  }
}
