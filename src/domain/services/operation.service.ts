import { Uuid } from "../../shared/uuid";
import { Seller } from "../aggregrates/seller.aggregate";
import { Operation } from "../aggregrates/operation.aggregate";
import { Sale } from "../entities/sale.entity";
import { Catalog } from "../entities/catalog.entity";
import { Email } from "../value-objects/email.value";
import type { Role } from "../value-objects/role.value";
import type { SaleItem } from "../value-objects/sale-item.value";

export class OperationService {
  constructor() {

  }

  public addItemToCatalog(operationId: Uuid, catalogId: Uuid, itemId: Uuid) {
    const operation = Operation.create(operationId); // Aqui será uma pesquisa pelo id no repository
    const catalog = Catalog.create(catalogId, "Catalog"); // Aqui será uma pesquisa pelo id no repository

    if (!operation || !catalog) { 
      throw new Error("Operation or Catalog not found");
    }

    operation.canAddItemToCatalog(catalogId);
    catalog.addItem(itemId);
  }
  
  public async startOperation(operationId: Uuid, catalogId: Uuid) {
    const operation = Operation.create(operationId); // Aqui será uma pesquisa pelo id no repository
    if(!operation) {
      throw new Error("Operation not found");
    }

    if(!operation.hasCatalog(catalogId)) {
      throw new Error("Catalog does not belong to the operation");
    }

    const catalog = Catalog.create(catalogId, "Catalog"); // Aqui será uma pesquisa pelo id no repository 
    if(!catalog.hasAnyItem()) {
      throw new Error("No items registered");
    }

    operation.startOperation();
  }

  public assignOperator(operationId: Uuid, operatorId: Uuid, catalogId: Uuid, role: Role) {
    const operation = Operation.create(operationId); // Aqui será uma pesquisa pelo id no repository
    if(!operation) {
      throw new Error("Operation not found");
    }

    const seller = Seller.create(Uuid.random(), "Seller", Email.create("seller@gmail.com")); // Aqui será uma pesquisa pelo id no repository
    if(!seller.hasOperator(operatorId)) {
      throw new Error("Operator not in pool");
    } 

    operation.assignOperator(operationId, catalogId, role);
  }

  public registerSale(saleId: Uuid, operationId: Uuid, operatorId: Uuid, catalogId: Uuid, items: SaleItem[]) {
    const operation = Operation.create(operationId); // Aqui será uma pesquisa pelo id no repository

    if(!operation) {
      throw new Error("Operation not found");
    }

    operation.registerSale(operatorId, catalogId, items);
    const sale = Sale.create(saleId, operationId, operatorId, catalogId, items);
    // TODO: Fazer algo com a sale
  }
}
