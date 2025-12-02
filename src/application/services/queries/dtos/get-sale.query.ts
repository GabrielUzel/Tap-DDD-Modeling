import { Query } from "@nestjs/cqrs";

export class GetSaleQuery extends Query<{
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
}> {
  constructor(public readonly saleId: string) {
    super();
  }
}
