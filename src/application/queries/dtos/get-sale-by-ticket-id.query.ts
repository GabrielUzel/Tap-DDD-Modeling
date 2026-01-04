import { Query } from "@nestjs/cqrs";

export class GetSaleByTicketIdQuery extends Query<{
  id: string;
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  totalAmountInCents: number;
  items: {
    catalogItemId: string;
    quantity: number;
    priceAmountInCents: number;
  }[];
} | null> {
  constructor(public readonly ticketId: string) {
    super();
  }
}
