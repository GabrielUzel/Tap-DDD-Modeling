import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetSaleByTicketIdQuery } from "./dtos/get-sale-by-ticket-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetSaleByTicketIdQuery)
export class GetSaleByTicketIdHandler implements IQueryHandler<GetSaleByTicketIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetSaleByTicketIdQuery) {
    const sale = await this.prisma.sale.findFirst({
      where: { ticketId: query.ticketId },
      include: { items: true },
    });

    return sale || null;
  }
}
