import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { GetOperatorsQuery } from "./dtos/get-operators.query";

@QueryHandler(GetOperatorsQuery)
export class GetOperatorsHandler
  implements
    IQueryHandler<
      GetOperatorsQuery,
      {
        operators: {
          operatorId: string;
          operatorName: string;
          operatorEmail: string;
        }[];
      }
    >
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(query: GetOperatorsQuery): Promise<{
    operators: {
      operatorId: string;
      operatorName: string;
      operatorEmail: string;
    }[];
  }> {
    const seller = await this.sellerRepository.findById(
      new Uuid(query.sellerId),
    );

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const operators = seller.operators;

    return {
      operators: operators.map((operator) => ({
        operatorId: operator.id,
        operatorName: operator.name,
        operatorEmail: operator.email,
      })),
    };
  }
}
