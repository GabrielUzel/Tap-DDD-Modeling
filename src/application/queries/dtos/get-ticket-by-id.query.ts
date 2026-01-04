import { Query } from "@nestjs/cqrs";

export class GetTicketByIdQuery extends Query<{
  id: string;
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  totalAmountInCents: number;
  status: string;
  paidAt: Date | null;
  items: {
    catalogItemId: string;
    quantity: number;
    priceAmountInCents: number;
    priceSuffix: string;
  }[];
}> {
  constructor(public readonly ticketId: string) {
    super();
  }
}
