import { Command } from "@nestjs/cqrs";

export class StartOperationCommand extends Command<{ operationId: string }> {
  constructor(public readonly operationId: string) {
    super();
  }
}
