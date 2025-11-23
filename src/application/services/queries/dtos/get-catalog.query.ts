import { Query } from "@nestjs/cqrs";

export class GetCatalogQuery extends Query<{
  catalog: {
    catalogId: string;
    catalogName: string;
    catalogType: string;
    items: { itemId: string; itemName: string; itemPrice: number }[];
  };
}> {
  constructor(
    public readonly sellerId: string,
    public readonly catalogId: string,
  ) {
    super();
  }
}
