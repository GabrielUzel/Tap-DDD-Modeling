import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { CreateTicketCommand } from "./dtos/create-ticket.command";
import type { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import type { ITicketRepository } from "src/infrastructure/repositories/interfaces/ticket-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { SaleItem } from "src/domain/@shared/value-objects/sale-item.value";
import { Ticket } from "src/domain/ticket/ticket.aggregate";

@CommandHandler(CreateTicketCommand)
export class CreateTicketHandler implements ICommandHandler<CreateTicketCommand> {
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
    @Inject("TicketRepository")
    private readonly ticketRepository: ITicketRepository,
  ) {}

  async execute(command: CreateTicketCommand): Promise<{
    ticketId: string;
    totalAmountInCents: number;
  }> {
    const operationId = new Uuid(command.operationId);
    const sellerId = new Uuid(command.sellerId);
    const operatorId = new Uuid(command.operatorId);
    const catalogId = new Uuid(command.catalogId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const catalog = seller.getCatalog(catalogId);

    const items = command.items.map((item) => {
      const catalogItemId = new Uuid(item.itemId);
      const catalogItem = catalog.findItem(catalogItemId);

      return SaleItem.create(
        catalogItemId,
        item.quantity,
        catalogItem.priceInCents,
      );
    });

    const ticket = Ticket.create(
      Uuid.generate(),
      seller.getId(),
      operatorId,
      catalogId,
      operation.getId(),
      items,
    );

    await this.ticketRepository.save(ticket);

    return {
      ticketId: ticket.getId().getValue(),
      totalAmountInCents: ticket.totalAmountInCents,
    };
  }
}
