import { Query } from "@nestjs/cqrs";

export class GetCatalogByIdQuery extends Query<{
  id: string;
  name: string;
  type: string;
  items: {
    id: string;
    name: string;
    priceAmountInCents: number;
    priceSuffix: string;
  }[];
}> {
  constructor(public readonly catalogId: string) {
    super();
  }
}
