import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetSellersQuery } from "./dtos/get-sellers.query";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@QueryHandler(GetSellersQuery)
export class GetSellersHandler implements IQueryHandler<GetSellersQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetSellersQuery): Promise<
    {
      id: string;
      name: string;
      email: string;
    }[]
  > {
    const operation = await this.prisma.operation.findUnique({
      where: {
        id: query.operationId,
      },
    });

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const sellerIds = operation.sellerIds;

    const sellers = await this.prisma.seller.findMany({
      where: {
        id: {
          in: sellerIds,
        },
      },
    });

    return sellers;
  }
}
