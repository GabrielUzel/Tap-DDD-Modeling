import { Command } from "@nestjs/cqrs";

export class CreateCatalogCommand extends Command<{
  operationId: string;
  sellerId: string;
  catalogId: string;
}> {
  constructor(
    public readonly operationId: string,
    public readonly sellerId: string,
    public readonly catalogName: string,
    public readonly catalogType: string,
  ) {
    super();
  }
}
