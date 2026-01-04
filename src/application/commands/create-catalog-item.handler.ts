import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { CreateCatalogItemCommand } from "./dtos/create-catalog-item.command";
import type { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import type { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { CatalogItem } from "src/domain/seller/catalog-item.entity";
import { Money } from "src/domain/@shared/value-objects/money.value";
import { MoneySufix } from "src/domain/@shared/value-objects/money.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(CreateCatalogItemCommand)
export class CreateCatalogItemHandler implements ICommandHandler<CreateCatalogItemCommand> {
  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
  ) {}

  async execute(command: CreateCatalogItemCommand): Promise<{
    operationId: string;
    sellerId: string;
    catalogId: string;
    itemId: string;
  }> {
    const catalogId = new Uuid(command.catalogId);
    const operationId = new Uuid(command.operationId);
    const sellerId = new Uuid(command.sellerId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new Error("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new Error("Seller not found");
    }

    if (!operation.hasSeller(sellerId)) {
      throw new Error("Seller does not belong to this operation");
    }

    const item = CatalogItem.create(
      Uuid.generate(),
      command.itemName,
      Money.create(
        command.itemPriceAmount,
        command.itemPriceSufix as MoneySufix,
      ),
    );

    seller.addItemToCatalog(catalogId, item);
    await this.sellerRepository.save(seller);

    return {
      operationId: operationId.getValue(),
      sellerId: sellerId.getValue(),
      catalogId: catalogId.getValue(),
      itemId: item.getId().getValue(),
    };
  }
}
