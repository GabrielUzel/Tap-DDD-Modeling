import { Command } from "@nestjs/cqrs";

export class MarkTicketAsPaidCommand extends Command<void> {
  constructor(public readonly ticketId: string) {
    super();
  }
}
