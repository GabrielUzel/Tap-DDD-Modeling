import { CommandBus, EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { TicketPaidEvent } from "../events/dtos/ticket-paid.event";
import { ITicketRepository } from "src/infrastructure/repositories/interfaces/ticket-repository.interface";
import { RegisterSaleCommand } from "../services/commands/dtos/register-sale.command";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@EventsHandler(TicketPaidEvent)
export class RegisterSaleOnTicketPaidHandler
  implements IEventHandler<TicketPaidEvent>
{
  constructor(
    @Inject("TicketRepository")
    private readonly ticketRepository: ITicketRepository,
    private readonly commandBus: CommandBus,
  ) {}

  async handle(event: TicketPaidEvent): Promise<void> {
    const ticket = await this.ticketRepository.findById(
      new Uuid(event.ticketId),
    );

    if (!ticket) {
      return;
    }

    if (!ticket.status.isPaid()) {
      return;
    }

    await this.commandBus.execute(
      new RegisterSaleCommand(
        ticket.sellerId.getValue(),
        ticket.operationId.getValue(),
        ticket.operatorId.getValue(),
        ticket.catalogId.getValue(),
        ticket.items.map((i) => ({
          itemId: i.getValue().catalogItemId.getValue(),
          quantity: i.getValue().quantity,
        })),
        ticket.getId().getValue(),
      ),
    );
  }
}
