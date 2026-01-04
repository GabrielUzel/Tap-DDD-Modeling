import { Command } from "@nestjs/cqrs";

export class CreateCatalogItemCommand extends Command<{
  operationId: string;
  sellerId: string;
  catalogId: string;
  itemId: string;
}> {
  constructor(
    public readonly operationId: string,
    public readonly sellerId: string,
    public readonly catalogId: string,
    public readonly itemName: string,
    public readonly itemPriceAmount: number,
    public readonly itemPriceSufix: string,
  ) {
    super();
  }
}
