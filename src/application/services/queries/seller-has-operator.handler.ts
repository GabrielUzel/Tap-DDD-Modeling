import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { SellerHasOperatorQuery } from "./dtos/seller-has-operator.query";
import { SellerMapper } from "../@shared/seller.mapper";

@QueryHandler(SellerHasOperatorQuery)
export class SellerHasOperatorHandler
  implements IQueryHandler<SellerHasOperatorQuery, { hasOperator: boolean }>
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(
    query: SellerHasOperatorQuery,
  ): Promise<{ hasOperator: boolean }> {
    const sellerId = new Uuid(query.sellerId);
    const operatorId = new Uuid(query.operatorId);
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const sellerEntity = SellerMapper.toDomain(seller);
    const hasOperator = sellerEntity.operatorIsInPool(operatorId);

    return { hasOperator };
  }
}
