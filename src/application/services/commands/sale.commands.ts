import { Injectable, Inject } from "@nestjs/common";
import type { IOperationRepository } from "src/application/repositories/interfaces/operation-repository.interface";
import type { ISellerRepository } from "src/application/repositories/interfaces/seller-repository.interface";
import type { ISaleRepository } from "src/application/repositories/interfaces/sale-repository.interface";
import type {
  RegisterSaleInput,
  RegisterSaleOutput,
} from "../../dtos/sale-dtos";
import { RegisterSaleDomainService } from "src/domain/services/register-sale.service";
import { SaleItem } from "src/domain/@shared/value-objects/sale-item.value";
import { Uuid } from "src/domain/@shared/interfaces/uuid";

@Injectable()
export class SaleCommands {
  private readonly registerSaleDomainService: RegisterSaleDomainService;

  constructor(
    @Inject("OperationRepository")
    private operationRepository: IOperationRepository,
    @Inject("SellerRepository")
    private sellerRepository: ISellerRepository,
    @Inject("SaleRepository")
    private saleRepository: ISaleRepository,
  ) {
    this.registerSaleDomainService = new RegisterSaleDomainService();
  }

  public async registerSale(
    input: RegisterSaleInput,
  ): Promise<RegisterSaleOutput> {
    const operationId = new Uuid(input.operationId);
    const sellerId = new Uuid(input.sellerId);
    const operatorId = new Uuid(input.operatorId);
    const catalogId = new Uuid(input.catalogId);

    const operation = await this.operationRepository.findById(operationId);
    if (!operation) {
      throw new Error("Operation not found");
    }

    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new Error("Seller not found");
    }

    this.registerSaleDomainService.validateCanRegisterSale(
      seller,
      operatorId,
      catalogId,
    );

    const catalog = seller.getCatalog(catalogId);

    const saleItems = input.items.map((item) => {
      const catalogItemId = new Uuid(item.itemId);
      const catalogItem = catalog.findItem(catalogItemId);

      return SaleItem.create(catalogItemId, item.quantity, catalogItem.price);
    });

    const sale = operation.registerSale(
      sellerId,
      operatorId,
      catalogId,
      saleItems,
    );
    await this.saleRepository.save(sale);

    return {
      saleId: sale.getId().getValue(),
      totalAmount: sale.totalAmount,
    };
  }
}
