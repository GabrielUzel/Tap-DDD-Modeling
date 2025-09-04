import { Uuid } from "../../shared/uuid";
import { Catalog } from "./catalog.entity";
import { Operator } from "./operator.entity";
import { Assignment } from "../value-objects/assignment.value";
import { CatalogItem } from "./catalog-item.entity";
import { Role } from "../value-objects/role.value";
import { left, right, type Either } from "../../shared/either.protocol";

export class OperationSeller {
  private sellerId: Uuid;
  private catalogs: Catalog[] = [];
  private operatorIds: Uuid[] = [];
  private assignments: Assignment[] = [];
  
  constructor(sellerId: Uuid) {
    this.sellerId = sellerId;
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
    
    if (!catalog) {
      throw new Error("Catalog not found");
    }

    return catalog;
  }

  public addItemToCatalog(catalogId: Uuid, item: CatalogItem): void {
    this.getCatalog(catalogId).addItem(item);
  }

  public operatorIsInPool(operatorId: Uuid): boolean {
    return this.operatorIds.some(id => id.equals(operatorId));
  }

  public addOperatorToPool(operatorId: Uuid): void {
    if (this.operatorIsInPool(operatorId)) {
      throw new Error("Operator already in pool");
    }

    this.operatorIds.push(operatorId);
  }

  public isOperatorAlreadyAssigned(operatorId: Uuid, catalogId: Uuid): boolean {
    return this.assignments.some((assignment) => {
      return assignment.getOperatorId().equals(operatorId)
        && assignment.getCatalogId().equals(catalogId);
    });
  }

  public assignOperator(operatorId: Uuid, catalogId: Uuid, role: Role): void {
    if(!this.operatorIsInPool(operatorId)) {
      throw new Error("Operator is not in the pool");
    }

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

  public canRegisterSale(operatorId: Uuid, catalogId: Uuid): Either<Error, true> {
    if (!this.hasCatalog(catalogId)) {
      return left(new Error("Catalog does not belong to this seller"));
    }

    if (!this.operatorIsInPool(operatorId)) {
      return left(new Error("Operator is not assigned to this operation"));
    }

    const assignment = this.getAssignment(operatorId, catalogId);
    if (!assignment) {
      return left(new Error("Operator is not assigned to this catalog"));
    }

    if (!assignment.operatorCanRegisterSale()) {
      return left(new Error("Operator does not have permission to register sales"));
    }

    return right(true);
  }

  public hasAnyCatalog(): boolean {
    return this.catalogs.length > 0;
  }

  public getSellerId(): Uuid {
    return this.sellerId;
  }

  public getCatalogs(): Catalog[] {
    return this.catalogs;
  }
}