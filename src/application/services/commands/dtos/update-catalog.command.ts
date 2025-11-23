import { Command } from "@nestjs/cqrs";

export class UpdateCatalogCommand extends Command<{ sellerId: string }> {
  constructor(
    public readonly sellerId: string,
    public readonly catalogId: string,
    public readonly catalogName?: string,
    public readonly catalogType?: string,
    public readonly items?: {
      itemId: string;
      itemName: string;
      itemPrice: number;
    }[],
  ) {
    super();
  }
}
