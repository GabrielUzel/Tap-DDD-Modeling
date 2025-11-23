import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { UpdateCatalogCommand } from "./dtos/update-catalog.command";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { SellerMapper } from "../@shared/seller.mapper";

@CommandHandler(UpdateCatalogCommand)
export class UpdateCatalogHandler
  implements ICommandHandler<UpdateCatalogCommand, { catalogId: string }>
{
  constructor(
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(command: UpdateCatalogCommand): Promise<{ catalogId: string }> {
    const sellerId = new Uuid(command.sellerId);
    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const sellerEntity = SellerMapper.toDomain(seller);

    sellerEntity.updateCatalog(
      new Uuid(command.catalogId),
      command.catalogName,
      command.catalogType,
      undefined,
    );

    await this.sellerRepository.save(sellerEntity);

    return { catalogId: command.catalogId };
  }
}
