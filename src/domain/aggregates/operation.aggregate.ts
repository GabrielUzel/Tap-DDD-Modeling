import { Uuid } from "../../shared/uuid";
import { Status } from "../value-objects/status.value";
import { Role } from "../value-objects/role.value";
import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import { SaleItem } from "../value-objects/sale-item.value";
import { Assignment } from "../value-objects/assignment.value";
import { Catalog } from "../entities/catalog.entity";
import { CatalogItem } from "../entities/catalog-item.entity";
import { Sale } from "./sale.aggregate";
import { Money } from "../value-objects/money.value";

interface SaleItemInput {
  item: CatalogItem;
  quantity: number;
}

export class Operation extends AggregateRoot {
  private status: Status;
  private catalogs: Catalog[] = [];
  private assignments: Assignment[] = [];

  constructor(id: Uuid, status: Status) {
    super(id);
    this.status = status;
  }

  public static create(id: Uuid): Operation {
    const initialStatus: Status = new Status("planned");
    return new Operation(id, initialStatus);
  }

  public hasCatalog(catalogId: Uuid): boolean {
    return this.catalogs.some(catalog => catalog.getId().equals(catalogId));
  }

  public addCatalog(catalog: Catalog): void {
    if(this.hasCatalog(catalog.getId())) {
      throw new Error("Catalog already belongs to this operation");
    }

    this.catalogs.push(catalog);
  }

  public getCatalog(catalogId: Uuid): Catalog {
    const catalog = this.catalogs.find(catalog => catalog.id.equals(catalogId));
    
    if(!catalog) {
      throw new Error("Catalog not found");
    }

    return catalog;
  }

  public addItemToCatalog(catalogId: Uuid, item: CatalogItem): void {
    this.getCatalog(catalogId).addItem(item);
  }

  public startOperation(): void { 
    if(this.catalogs.length === 0) {
      throw new Error("No catalogs registered");
    }

    const hasValidCatalog = this.catalogs.some(catalog => catalog.hasAnyItem());

    if (!hasValidCatalog) {
      throw new Error("At least one catalog must contain items to start the operation");
    }

    this.status = new Status("on_going");
  }

  public isOperatorAlreadyAssigned(operatorId: Uuid, catalogId: Uuid): boolean {
    return this.assignments.some((assignment) => {
      return assignment.getOperatorId().equals(operatorId)
        && assignment.getCatalogId().equals(catalogId);
    });
  }

  public assignOperator(operatorId: Uuid, catalogId: Uuid, role: Role): void {
    if (!this.hasCatalog(catalogId)) {
      throw new Error("Catalog does not belong to this operation");
    }
 
    if (this.isOperatorAlreadyAssigned(operatorId, catalogId)) {
      throw new Error("Operator already assigned to this catalog");
    }

    this.assignments.push(Assignment.create(operatorId, catalogId, role));
  }

  public getAssignment(operatorId: Uuid, catalogId: Uuid): Assignment | null {
    return this.assignments.find((assignment) => {
      return (
        assignment.getOperatorId().equals(operatorId) &&
        assignment.getCatalogId().equals(catalogId)
      );
    }) ?? null;
  }

  public registerSale(operatorId: Uuid, catalogId: Uuid, items: SaleItemInput[]): Sale {
    if(!this.status.isOnGoing()) { 
      throw new Error("Operation must be on_going to register a sale");
    }

    if (!this.hasCatalog(catalogId)) {
     throw new Error("Catalog does not belong to this operation");
    }

    const assignment = this.getAssignment(operatorId, catalogId);
    if (!assignment) {
      throw new Error("Operator is not assigned to this catalog");
    }

    if (!assignment.operatorCanRegisterSale()) {
      throw new Error("Operator does not have permission to register sales");
    }

    const saleId = Uuid.generate();
    const saleItems = items.map(
      ({item, quantity}) => {
        return SaleItem.create(
          item.getId(), 
          quantity, 
          Money.create(item.getPrice().getAmount() * quantity, item.getPrice().getSufix())
        )
      }
    );

    return Sale.create(saleId, operatorId, catalogId, this.id, saleItems);
  }
  
  public getStatus(): string {
    return this.status.getValue();
  }
}