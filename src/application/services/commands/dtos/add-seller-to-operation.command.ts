import { Command } from "@nestjs/cqrs";

export class AddSellerToOperationCommand extends Command<{
  operationId: string;
  sellerId: string;
}> {
  constructor(
    public readonly id: string,
    public readonly sellerId: string,
  ) {
    super();
  }
}
