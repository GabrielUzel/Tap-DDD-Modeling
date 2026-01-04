import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";
import { GetCatalogByIdQuery } from "./dtos/get-catalog-by-id.query";

@QueryHandler(GetCatalogByIdQuery)
export class GetCatalogByIdHandler implements IQueryHandler<GetCatalogByIdQuery> {
  constructor(@Inject() private readonly prisma: PrismaService) {}

  async execute(query: GetCatalogByIdQuery): Promise<{
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
