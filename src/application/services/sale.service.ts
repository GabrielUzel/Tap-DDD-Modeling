import type { OperationRepository } from "../repositories/operation.repository";
import type { SellerRepository } from "../repositories/seller.repository";
import type { SaleRepository } from "../repositories/sale.repository";
import { RegisterSaleDomainService } from "../../domain/services/register-sale.service";
import { SaleItem } from "../../domain/value-objects/sale-item.value";
import type { RegisterSaleInput, RegisterSaleOutput } from "../dtos/sale-dtos";
import { Uuid } from "../../utils/uuid";

export class SaleService {
  private operationRepository: OperationRepository;
  private sellerRepository: SellerRepository;
  private saleRepository: SaleRepository;
  private registerSaleService: RegisterSaleDomainService;

  constructor(
    operationRepository: OperationRepository,
    sellerRepository: SellerRepository,
    saleRepository: SaleRepository,
    registerSaleService: RegisterSaleDomainService,
  ) {
    this.operationRepository = operationRepository;
    this.sellerRepository = sellerRepository;
    this.saleRepository = saleRepository;
    this.registerSaleService = registerSaleService;
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

    this.registerSaleService.validateCanRegisterSale(
      seller,
      operatorId,
      catalogId,
    );

    const catalog = seller.getCatalog(catalogId);

    const saleItems = input.items.map((item) => {
      const catalogItemId = new Uuid(item.itemId);
      const catalogItem = catalog.findItem(catalogItemId);

      return SaleItem.create(
        catalogItemId,
        item.quantity,
        catalogItem.getPrice(),
      );
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
      totalAmount: sale.getTotalAmount(),
      sellerId: seller.getId().getValue(),
      operationId: operation.getId().getValue(),
    };
  }
}
