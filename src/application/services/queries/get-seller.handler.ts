import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { GetSellerQuery } from "./dtos/get-seller.query";

@QueryHandler(GetSellerQuery)
export class GetSellerHandler
  implements
    IQueryHandler<
      GetSellerQuery,
      { sellerId: string; name: string; email: string }
    >
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(
    query: GetSellerQuery,
  ): Promise<{ sellerId: string; name: string; email: string }> {
    const sellerId = new Uuid(query.sellerId);
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    return {
      sellerId: seller.id,
      name: seller.name,
      email: seller.email,
    };
  }
}
