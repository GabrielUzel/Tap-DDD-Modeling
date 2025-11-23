import { Command } from "@nestjs/cqrs";

export class AddOperatorToSellerPoolCommand extends Command<{
  sellerId: string;
  operatorId: string;
}> {
  constructor(
    public readonly sellerId: string,
    public readonly operatorName: string,
    public readonly operatorEmail: string,
  ) {
    super();
  }
}
