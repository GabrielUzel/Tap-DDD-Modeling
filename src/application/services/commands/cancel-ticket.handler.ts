import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { CancelTicketCommand } from "./dtos/cancel-ticket.command";
import { ITicketRepository } from "src/infrastructure/repositories/interfaces/ticket-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(CancelTicketCommand)
export class CancelTicketHandler
  implements ICommandHandler<CancelTicketCommand>
{
  constructor(
    @Inject("TicketRepository")
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(command: CancelTicketCommand): Promise<void> {
    const ticketId = new Uuid(command.ticketId);
    const ticket = await this.ticketRepository.findById(ticketId);

    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }

    ticket.cancel();
    await this.ticketRepository.save(ticket);
  }
}
