import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { RegisterSaleCommand } from "./dtos/register-sale.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { ISaleRepository } from "src/infrastructure/repositories/interfaces/sale-repository.interface";
import { RegisterSaleDomainService } from "src/domain/services/register-sale.service";
import { SaleItem } from "src/domain/@shared/value-objects/sale-item.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";
import { OperationMapper } from "../@shared/operation.mapper";
import { SellerMapper } from "../@shared/seller.mapper";

@CommandHandler(RegisterSaleCommand)
export class RegisterSaleHandler
  implements
    ICommandHandler<
      RegisterSaleCommand,
      {
        saleId: string;
        totalAmount: number;
      }
    >
{
  private readonly registerSaleDomainService: RegisterSaleDomainService;

  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
    @Inject("SaleRepository")
    private readonly saleRepository: ISaleRepository,
  ) {
    this.registerSaleDomainService = new RegisterSaleDomainService();
  }

  async execute(command: RegisterSaleCommand): Promise<{
    saleId: string;
    totalAmountInCents: number;
  }> {
    const operationId = new Uuid(command.operationId);
    const sellerId = new Uuid(command.sellerId);
    const operatorId = new Uuid(command.operatorId);
    const catalogId = new Uuid(command.catalogId);
    const operation = await this.operationRepository.findById(operationId);

    if (!operation) {
      throw new NotFoundException("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);

    if (!seller) {
      throw new NotFoundException("Seller not found");
    }

    const operationEntity = OperationMapper.toDomain(operation);
    const sellerEntity = SellerMapper.toDomain(seller);

    this.registerSaleDomainService.validateCanRegisterSale(
      sellerEntity,
      operatorId,
      catalogId,
    );

    const catalog = sellerEntity.getCatalog(catalogId);

    const saleItems = command.items.map((item) => {
      const catalogItemId = new Uuid(item.itemId);
      const catalogItem = catalog.findItem(catalogItemId);

      return SaleItem.create(
        catalogItemId,
        item.quantity,
        catalogItem.priceInCents,
      );
    });

    const sale = operationEntity.registerSale(
      sellerId,
      operatorId,
      catalogId,
      saleItems,
    );

    await this.saleRepository.save(sale);

    return {
      saleId: sale.getId().getValue(),
      totalAmountInCents: sale.totalAmountInCents,
    };
  }
}
