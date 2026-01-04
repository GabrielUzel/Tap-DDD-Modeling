import { Command } from "@nestjs/cqrs";

export class RemoveCatalogItemFromCatalogCommand extends Command<{
  catalogId: string;
  itemId: string;
}> {
  constructor(
    public readonly sellerId: string,
    public readonly catalogId: string,
    public readonly itemId: string,
  ) {
    super();
  }
}
