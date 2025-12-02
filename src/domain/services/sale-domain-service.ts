import { Operation } from "../operation/operation.aggregate";
import { Seller } from "../seller/seller.aggregate";
import { Sale } from "../sale/sale.aggregate";
import { SaleItem } from "../@shared/value-objects/sale-item.value";
import { Uuid } from "../@shared/interfaces/uuid";

export class SaleDomainService {
  registerSale(
    operation: Operation,
    seller: Seller,
    operatorId: Uuid,
    catalogId: Uuid,
    items: SaleItem[],
  ): Sale {
    seller.validateSaleRegistration(operatorId, catalogId);
    return operation.registerSale(seller.getId(), operatorId, catalogId, items);
  }
}
