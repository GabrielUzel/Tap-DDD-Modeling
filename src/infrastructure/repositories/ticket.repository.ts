import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { ITicketRepository } from "./interfaces/ticket-repository.interface";
import { Ticket } from "src/domain/ticket/ticket.aggregate";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class TicketRepository implements ITicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(ticket: Ticket): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.ticket.upsert({
        where: { id: ticket.id.getValue() },
        create: {
          id: ticket.id.getValue(),
          sellerId: ticket.sellerId.getValue(),
          operatorId: ticket.operatorId.getValue(),
          catalogId: ticket.catalogId.getValue(),
          operationId: ticket.operationId.getValue(),
          status: ticket.status.toString(),
          totalAmountInCents: ticket.totalAmountInCents,
          paidAt: ticket.paidAt,
        },
        update: {
          sellerId: ticket.sellerId.getValue(),
          operatorId: ticket.operatorId.getValue(),
          catalogId: ticket.catalogId.getValue(),
          operationId: ticket.operationId.getValue(),
          status: ticket.status.toString(),
          totalAmountInCents: ticket.totalAmountInCents,
          paidAt: ticket.paidAt,
        },
      });

      await tx.ticketItem.deleteMany({
        where: { ticketId: ticket.id.getValue() },
      });

      if (ticket.items.length > 0) {
        await tx.ticketItem.createMany({
          data: ticket.items.map((item) => ({
            catalogItemId: item.getValue().catalogItemId.getValue(),
            quantity: item.getValue().quantity,
            priceAmountInCents: item.getValue().salePrice.getAmount(),
            priceSuffix: item.getValue().salePrice.getSufix(),
            ticketId: ticket.id.getValue(),
          })),
        });
      }
    });
  }

  async findById(id: Uuid): Promise<Ticket | null> {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: id.getValue() },
      include: { items: true },
    });

    if (!ticket) {
      return null;
    }

    return Ticket.fromJSON(ticket);
  }
}
