import { Inject } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { GetOperatorsQuery } from "./dtos/get-operators.query";

@QueryHandler(GetOperatorsQuery)
export class GetOperatorsHandler implements IQueryHandler<GetOperatorsQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetOperatorsQuery): Promise<
    {
      id: string;
      name: string;
      email: string;
    }[]
  > {
    const operators = await this.prisma.operator.findMany({
      where: {
        sellerId: query.sellerId,
      },
    });

    return operators;
  }
}
