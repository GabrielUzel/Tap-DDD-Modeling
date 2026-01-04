import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetTicketByIdQuery } from "./dtos/get-ticket-by-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetTicketByIdQuery)
export class GetTicketByIdHandler implements IQueryHandler<GetTicketByIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetTicketByIdQuery) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: query.ticketId },
      include: { items: true },
    });

    if (!ticket) {
      throw new NotFoundException("Ticket not found");
    }

    return ticket;
  }
}
