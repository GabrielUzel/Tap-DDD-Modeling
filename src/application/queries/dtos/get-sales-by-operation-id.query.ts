import { Query } from "@nestjs/cqrs";

export class GetSalesByOperationIdQuery extends Query<
  {
    id: string;
    sellerId: string;
    operatorId: string;
    catalogId: string;
    operationId: string;
    items: {
      id: string;
      catalogItemId: string;
      priceAmountInCents: number;
      quantity: number;
    }[];
    totalAmountInCents: number;
    ticketId: string;
  }[]
> {
  constructor(public readonly operationId: string) {
    super();
  }
}
