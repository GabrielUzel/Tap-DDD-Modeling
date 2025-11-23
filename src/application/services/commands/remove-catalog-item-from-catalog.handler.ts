import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { RemoveCatalogItemFromCatalogCommand } from "./dtos/remove-catalog-item-from-catalog.command";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { SellerMapper } from "../@shared/seller.mapper";

@CommandHandler(RemoveCatalogItemFromCatalogCommand)
export class RemoveCatalogItemFromCatalogHandler
  implements
    ICommandHandler<
      RemoveCatalogItemFromCatalogCommand,
      { catalogId: string; itemId: string }
    >
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(
    command: RemoveCatalogItemFromCatalogCommand,
  ): Promise<{ catalogId: string; itemId: string }> {
    const sellerId = new Uuid(command.sellerId);
    const catalogId = new Uuid(command.catalogId);
    const itemId = new Uuid(command.itemId);

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const sellerEntity = SellerMapper.toDomain(seller);
    sellerEntity.removeItemFromCatalog(catalogId, itemId);
    await this.sellerRepository.save(sellerEntity);

    return {
      catalogId: catalogId.getValue(),
      itemId: itemId.getValue(),
    };
  }
}
