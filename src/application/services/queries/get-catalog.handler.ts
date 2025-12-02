import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { GetCatalogQuery } from "./dtos/get-catalog.query";

@QueryHandler(GetCatalogQuery)
export class GetCatalogHandler implements IQueryHandler<GetCatalogQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetCatalogQuery): Promise<{
    id: string;
    name: string;
    type: string;
    items: {
      id: string;
      name: string;
      priceAmountInCents: number;
      priceSuffix: string;
    }[];
  }> {
    const catalog = await this.prisma.catalog.findUnique({
      where: { id: query.catalogId },
      include: { items: true },
    });

    if (!catalog) {
      throw new NotFoundException("Catalog not found");
    }

    return catalog;
  }
}
