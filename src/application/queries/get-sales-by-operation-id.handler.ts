import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { GetSalesByOperationIdQuery } from "./dtos/get-sales-by-operation-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetSalesByOperationIdQuery)
export class GetSalesByOperationIdHandler implements IQueryHandler<GetSalesByOperationIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetSalesByOperationIdQuery) {
    const sales = await this.prisma.sale.findMany({
      where: { operationId: query.operationId },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    return sales;
  }
}
