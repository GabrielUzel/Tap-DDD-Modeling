import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { SellerHasOperatorQuery } from "./dtos/seller-has-operator.query";

@QueryHandler(SellerHasOperatorQuery)
export class SellerHasOperatorHandler
  implements IQueryHandler<SellerHasOperatorQuery, { hasOperator: boolean }>
{
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(
    query: SellerHasOperatorQuery,
  ): Promise<{ hasOperator: boolean }> {
    const seller = await this.prisma.seller.findFirst({
      where: {
        id: query.sellerId,
        operators: {
          some: {
            id: query.operatorId,
          },
        },
      },
      select: { id: true },
    });

    return {
      hasOperator: !!seller,
    };
  }
}
