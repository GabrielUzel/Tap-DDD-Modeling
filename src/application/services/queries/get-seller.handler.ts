import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { GetSellerQuery } from "./dtos/get-seller.query";

@QueryHandler(GetSellerQuery)
export class GetSellerHandler implements IQueryHandler<GetSellerQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(
    query: GetSellerQuery,
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
