import { Inject, NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { GetCatalogQuery } from "./dtos/get-catalog.query";
import { SellerMapper } from "../@shared/seller.mapper";

@QueryHandler(GetCatalogQuery)
export class GetCatalogHandler
  implements
    IQueryHandler<
      GetCatalogQuery,
      {
        catalog: {
          catalogId: string;
          catalogName: string;
          catalogType: string;
          items: {
            itemId: string;
            itemName: string;
            itemPrice: number;
          }[];
        };
      }
    >
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(query: GetCatalogQuery): Promise<{
    catalog: {
      catalogId: string;
      catalogName: string;
      catalogType: string;
      items: {
        itemId: string;
        itemName: string;
        itemPrice: number;
      }[];
    };
  }> {
    const seller = await this.sellerRepository.findById(
      new Uuid(query.sellerId),
    );

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const sellerEntity = SellerMapper.toDomain(seller);
    const catalog = sellerEntity.getCatalog(new Uuid(query.catalogId));

    if (!catalog) {
      throw new NotFoundException("Catalog not found");
    }

    return {
      catalog: {
        catalogId: catalog.getId().getValue(),
        catalogName: catalog.name,
        catalogType: catalog.type.getValue(),
        items: catalog.catalogItems.map((item) => ({
          itemId: item.id.getValue(),
          itemName: item.name,
          itemPrice: item.priceInCents.getAmount(),
        })),
      },
    };
  }
}
