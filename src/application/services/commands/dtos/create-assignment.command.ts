import { Command } from "@nestjs/cqrs";

export class CreateAssignmentCommand extends Command<{
  operationId: string;
  sellerId: string;
  operatorId: string;
  catalogId: string;
  role: string;
}> {
  constructor(
    public readonly operationId: string,
    public readonly sellerId: string,
    public readonly operatorId: string,
    public readonly catalogId: string,
    public readonly role: string,
  ) {
    super();
  }
}
