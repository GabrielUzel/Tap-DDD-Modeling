import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetTicketsByOperationIdQuery } from "./dtos/get-tickets-by-operation-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetTicketsByOperationIdQuery)
export class GetTicketsByOperationIdHandler implements IQueryHandler<GetTicketsByOperationIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetTicketsByOperationIdQuery) {
    const tickets = await this.prisma.ticket.findMany({
      where: { operationId: query.operationId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return tickets;
  }
}
