import type { RegisterSaleInput, RegisterSaleOutput } from "../dtos/sale/register-sale.dto";
import { Uuid } from "../../shared/uuid";
import { SaleItem } from "../../domain/value-objects/sale-item.value";
import { OperationRepository } from "../repositories/operation.repository";
import { SellerRepository } from "../repositories/seller.repository";
import { SaleRepository } from "../repositories/sale.repository";
import { CatalogRepository } from "../repositories/catalog.repository";
import { CatalogItemRepository } from "../repositories/catalog-item.repository";
import { isLeft, left, right, type Either } from "../../shared/either.protocol";
import type { CatalogItem } from "../../domain/entities/catalog-item.entity";

export class SaleService {
  private operationRepository: OperationRepository;
  private sellerRepository: SellerRepository;
  private saleRepository: SaleRepository;
  private catalogRepository: CatalogRepository;
  private catalogItemRepository: CatalogItemRepository;

  constructor(
    operationRepository: OperationRepository,
    sellerRepository: SellerRepository,
    saleRepository: SaleRepository,
    catalogRepository: CatalogRepository,
    catalogItemRepository: CatalogItemRepository
  ) {
    this.operationRepository = operationRepository;
    this.sellerRepository = sellerRepository;
    this.saleRepository = saleRepository;
    this.catalogRepository = catalogRepository;
    this.catalogItemRepository = catalogItemRepository;
  }

  public async registerSale(
    input: RegisterSaleInput
  ): Promise<Either<Error, RegisterSaleOutput>> {
    try {
      const operationId = new Uuid(input.operationId);
      const sellerId = new Uuid(input.sellerId);
      const operatorId = new Uuid(input.operatorId);
      const catalogId = new Uuid(input.catalogId);
  
      const operationResult = await this.operationRepository.findById(operationId);
      if (isLeft(operationResult)) {
        return left(new Error("Operation not found"));
      }
      const operation = operationResult.right;
  
      const sellerResult = await this.sellerRepository.findById(sellerId);
      if (isLeft(sellerResult)) {
        return left(new Error("Seller not found"));
      }
      const seller = sellerResult.right;
      
      // ! Deveria estar dentro de operation?
      // ! Não gostei dessa implementação, é necessário?
      const items: SaleItem[] = [];
      for (const item of input.items) {
        const catalogResult = await this.catalogRepository.findById(catalogId);

        if (isLeft(catalogResult)) {
          return left(new Error("Catalog not found"));
        }

        const catalog = catalogResult.right;
        const catalogItemResult = await this.catalogItemRepository.findById(new Uuid(item.itemId));
        
        if (isLeft(catalogItemResult)) {
          return left(new Error("Catalog item not found"));
        }

        const catalogItem = catalogItemResult.right;
        const itemExistsInCatalog = catalog.getItems().some((index: CatalogItem) => catalogItem.getId().equals(index.getId())); // ! Pode usar map

        if (!itemExistsInCatalog) {
          return left(new Error("Catalog item does not belong to this catalog"));
        }

        items.push(SaleItem.create(new Uuid(item.itemId), item.quantity, catalogItem.getPrice()));
      }

      const sale = operation.registerSale(operationId, sellerId, operatorId, catalogId, items);

      if (isLeft(sale)) {
        return left(sale.left);
      }

      await this.saleRepository.save(sale.right);

      return right({
        saleId: sale.right.getId().getValue(),
        sellerId: seller.getId().getValue(),
        operationId: operation.getId().getValue(),
        totalAmount: sale.right.getTotalAmount(),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return left(new Error(error.message));
      }

      return left(new Error("An unknown error occurred"));
    }
  }
}