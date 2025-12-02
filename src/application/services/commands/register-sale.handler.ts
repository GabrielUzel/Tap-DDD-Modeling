import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, NotFoundException } from "@nestjs/common";
import { RegisterSaleCommand } from "./dtos/register-sale.command";
import { IOperationRepository } from "src/infrastructure/repositories/interfaces/operation-repository.interface";
import { ISellerRepository } from "src/infrastructure/repositories/interfaces/seller-repository.interface";
import { ISaleRepository } from "src/infrastructure/repositories/interfaces/sale-repository.interface";
import { SaleDomainService } from "src/domain/services/sale-domain-service";
import { SaleItem } from "src/domain/@shared/value-objects/sale-item.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@CommandHandler(RegisterSaleCommand)
export class RegisterSaleHandler
  implements ICommandHandler<RegisterSaleCommand>
{
  private readonly saleDomainService: SaleDomainService;

  constructor(
    @Inject("OperationRepository")
    private readonly operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private readonly sellerRepository: ISellerRepository,
    @Inject("SaleRepository")
    private readonly saleRepository: ISaleRepository,
  ) {
    this.saleDomainService = new SaleDomainService();
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

    const catalog = seller.getCatalog(catalogId);

    const saleItems = command.items.map((item) => {
      const catalogItemId = new Uuid(item.itemId);
      const catalogItem = catalog.findItem(catalogItemId);

      return SaleItem.create(
        catalogItemId,
        item.quantity,
        catalogItem.priceInCents,
      );
    });

    const sale = this.saleDomainService.registerSale(
      operation,
      seller,
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
