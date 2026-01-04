import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetSaleByIdQuery } from "./dtos/get-sale-by-id.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetSaleByIdQuery)
export class GetSaleByIdHandler implements IQueryHandler<GetSaleByIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetSaleByIdQuery): Promise<{
    id: string;
    sellerId: string;
    operationId: string;
    operatorId: string;
    catalogId: string;
    totalAmountInCents: number;
    items: {
      catalogItemId: string;
      quantity: number;
      priceAmountInCents: number;
    }[];
  }> {
    const sale = await this.prisma.sale.findUnique({
      where: { id: query.saleId },
      include: { items: true },
    });

    if (!sale) {
      throw new NotFoundException("Sale not found");
    }

    return sale;
  }
}
