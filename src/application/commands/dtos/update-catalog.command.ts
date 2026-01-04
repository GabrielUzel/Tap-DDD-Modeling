import { Command } from "@nestjs/cqrs";

export class UpdateCatalogCommand extends Command<{ catalogId: string }> {
  constructor(
    public readonly sellerId: string,
    public readonly catalogId: string,
    public readonly catalogName?: string,
    public readonly catalogType?: string,
  ) {
    super();
  }
}
