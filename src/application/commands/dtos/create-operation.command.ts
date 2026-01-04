import { Command } from "@nestjs/cqrs";

export class CreateOperationCommand extends Command<{ operationId: string }> {
  constructor(public readonly name: string) {
    super();
  }
}
