import { Query } from "@nestjs/cqrs";

export class GetTicketsByOperationIdQuery extends Query<
  {
    id: string;
    sellerId: string;
    operatorId: string;
    catalogId: string;
    operationId: string;
    items: {
      catalogItemId: string;
      quantity: number;
      priceAmountInCents: number;
      priceSuffix: string;
    }[];
    totalAmountInCents: number;
    status: string;
    paidAt: Date | null;
    createdAt: Date;
  }[]
> {
  constructor(public readonly operationId: string) {
    super();
  }
}
