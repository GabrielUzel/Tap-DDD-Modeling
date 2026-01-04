import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetTicketsBySellerIdQuery } from "./dtos/get-tickets-by-seller-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetTicketsBySellerIdQuery)
export class GetTicketsBySellerIdHandler implements IQueryHandler<GetTicketsBySellerIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetTicketsBySellerIdQuery) {
    const tickets = await this.prisma.ticket.findMany({
      where: { sellerId: query.sellerId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return tickets;
  }
}
