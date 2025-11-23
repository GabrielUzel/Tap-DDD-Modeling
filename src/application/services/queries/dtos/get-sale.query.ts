import { Query } from "@nestjs/cqrs";

export class GetSaleQuery extends Query<{
  saleId: string;
  sellerId: string;
  operationId: string;
  operatorId: string;
  catalogId: string;
  totalAmountInCents: number;
  items: {
    catalogItemId: string;
    quantity: number;
    salePriceInCents: number;
    total: number;
  }[];
}> {
  constructor(public readonly saleId: string) {
    super();
  }
}
