import { OperationRepository } from "../repositories/operation.repository"
import { OperatorRepository } from "../repositories/operator.repository"
import { SaleRepository } from "../repositories/sale.repository"
import { SellerRepository } from "../repositories/seller.repository"
import { CatalogItemRepository } from "../repositories/catalog-item.repository"
import { CatalogRepository } from "../repositories/catalog.repository"
import { OperationService } from "./operation.service"
import { SaleService } from "./sale.service"
import { SellerService } from "./seller.service"
import { OperatorService } from "./operator.service"
import { CatalogService } from "./catalog.service"

export default class ServicesFactory {
  static create() {
    const operationRepository = new OperationRepository();
    const operatorRepository = new OperatorRepository();
    const saleRepository = new SaleRepository();
    const sellerRepository = new SellerRepository();
    const catalogItemRepository = new CatalogItemRepository();
    const catalogRepository = new CatalogRepository();

    const services = {
      operationService: new OperationService(operationRepository, operatorRepository, catalogRepository, catalogItemRepository),
      saleService: new SaleService(operationRepository, sellerRepository, saleRepository, catalogRepository, catalogItemRepository),
      sellerService: new SellerService(sellerRepository, operatorRepository),
      operatorService: new OperatorService(operatorRepository),
      catalogService: new CatalogService(catalogRepository),
    };

    return services;
  }
}