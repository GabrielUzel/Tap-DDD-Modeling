import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { MarkTicketAsPaidCommand } from "./dtos/mark-ticket-as-paid.command";
import type { ITicketRepository } from "src/infrastructure/repositories/interfaces/ticket-repository.interface";
import { TicketPaidEvent } from "src/application/events/dtos/ticket-paid.event";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(MarkTicketAsPaidCommand)
export class MarkTicketAsPaidHandler implements ICommandHandler<MarkTicketAsPaidCommand> {
  constructor(
    @Inject("TicketRepository")
    private readonly ticketRepository: ITicketRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: MarkTicketAsPaidCommand): Promise<void> {
    const ticketId = new Uuid(command.ticketId);
    const ticket = await this.ticketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }

    ticket.markAsPaid();
    await this.ticketRepository.save(ticket);
    this.eventBus.publish(new TicketPaidEvent(ticket.getId().getValue()));
  }
}
