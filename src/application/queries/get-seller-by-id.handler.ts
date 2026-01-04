import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { GetSellerByIdQuery } from "./dtos/get-seller-by-id.query";

@QueryHandler(GetSellerByIdQuery)
export class GetSellerByIdHandler implements IQueryHandler<GetSellerByIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(
    query: GetSellerByIdQuery,
  ): Promise<{ id: string; name: string; email: string }> {
    const seller = await this.prisma.seller.findUnique({
      where: { id: query.sellerId },
    });

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    return seller;
  }
}
