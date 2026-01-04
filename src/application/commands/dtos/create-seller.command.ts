import { Command } from "@nestjs/cqrs";

export class CreateSellerCommand extends Command<{
  sellerId: string;
}> {
  constructor(
    public readonly name: string,
    public readonly email: string,
  ) {
    super();
  }
}
