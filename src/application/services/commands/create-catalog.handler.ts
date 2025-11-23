import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { CreateCatalogCommand } from "./dtos/create-catalog.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { Catalog } from "src/domain/seller/catalog.entity";
import { CatalogType } from "src/domain/@shared/value-objects/catalog-type.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { OperationMapper } from "../@shared/operation.mapper";
import { SellerMapper } from "../@shared/seller.mapper";

@CommandHandler(CreateCatalogCommand)
export class CreateCatalogHandler
  implements
    ICommandHandler<
      CreateCatalogCommand,
      { operationId: string; sellerId: string; catalogId: string }
    >
{
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(
    command: CreateCatalogCommand,
  ): Promise<{ operationId: string; sellerId: string; catalogId: string }> {
    const sellerId = new Uuid(command.sellerId);
    const operationId = new Uuid(command.operationId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const operationEntity = OperationMapper.toDomain(operation);

    if (!operationEntity.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const catalog = Catalog.create(
      Uuid.generate(),
      command.catalogName,
      CatalogType.fromString(command.catalogType),
    );

    const sellerEntity = SellerMapper.toDomain(seller);

    sellerEntity.addCatalog(catalog);
    await this.sellerRepository.save(sellerEntity);

    return {
      operationId: operationId.getValue(),
      sellerId: sellerId.getValue(),
      catalogId: catalog.getId().getValue(),
    };
  }
}
