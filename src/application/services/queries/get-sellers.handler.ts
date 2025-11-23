import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { GetSellersQuery } from "./dtos/get-sellers.query";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@QueryHandler(GetSellersQuery)
export class GetSellersHandler
  implements
    IQueryHandler<
      GetSellersQuery,
      {
        operationId: string;
        sellers: {
          sellerId: string;
          name: string;
          email: string;
        }[];
      }
    >
{
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(query: GetSellersQuery): Promise<{
    operationId: string;
    sellers: {
      sellerId: string;
      name: string;
      email: string;
    }[];
  }> {
    const operationId = new Uuid(query.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const sellers = await this.sellerRepository.findMany(operation.sellerIds);

    return {
      operationId: operation.id,
      sellers: sellers.map((seller) => ({
        sellerId: seller.id,
        name: seller.name,
        email: seller.email,
      })),
    };
  }
}
