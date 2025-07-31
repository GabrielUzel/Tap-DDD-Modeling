import { Uuid } from "../../shared/uuid";
import { Status } from "../value-objects/status.value";
import { Role } from "../value-objects/role.value";
import { AggregateRoot } from "../../shared/aggregate-root.abstract";
import { SaleItem } from "../value-objects/sale-item.value";
import { Assignment } from "../value-objects/assignment.value";

export class Operation extends AggregateRoot {
  private status: Status;
  private catalogs_ids: Uuid[] = []
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
    return this.catalogs_ids.includes(catalogId);
  }

  public isOperatorAlreadyAssigned(operatorId: Uuid, catalogId: Uuid): boolean {
    return this.assignments.some((assignment) => {
      assignment.getOperatorId().equals(operatorId);
      assignment.getCatalogId().equals(catalogId);
    });
  }

  public getAssignment(operationId: Uuid, catalogId: Uuid): Assignment | null {
    return this.assignments.find((assignment) => {
      assignment.getOperatorId().equals(operationId) &&
      assignment.getCatalogId().equals(catalogId)
    }) ?? null;
  }

  public addCatalog(catalogId: Uuid): void {
    if(this.hasCatalog(catalogId)) {
      throw new Error("Catalog does not belong to this operation");
    }

    this.catalogs_ids.push(catalogId);
  }

  canAddItemToCatalog(catalogId: Uuid): boolean {
    return this.hasCatalog(catalogId);
  }

  public startOperation() { 
    if(this.catalogs_ids.length === 0) {
      throw new Error("No catalogs registered");
    } 

    this.status = new Status("on_going");
  }

  public assignOperator(operatorId: Uuid, catalogId: Uuid, role: Role) {
    if (!this.hasCatalog(catalogId)) {
     throw new Error("Catalog does not belong to this operation");
    }

    if (this.isOperatorAlreadyAssigned(operatorId, catalogId)) {
      throw new Error("Operator already assigned to this catalog");
    }

    this.assignments.push(Assignment.create(operatorId, catalogId, role));
  }

  public registerSale(operatorId: Uuid, catalogId: Uuid, items: SaleItem[]) {
    if (this.status.getStatus() !== "on_going") {
      throw new Error("Operation must be on_going to register a sale");
    }

    const assignment = this.getAssignment(operatorId, catalogId);
    if (!assignment) {
      throw new Error("Operator is not assigned to this catalog");
    }

    if (!assignment.operatorCanRegisterSale()) {
      throw new Error("Operator does not have permission to register sales");
    }

    if (items.length === 0) {
      throw new Error("No items provided for sale");
    }
  }

  public getStatus() {
    return this.status.getStatus();
  }

  public getCatalogsIds(): Uuid[] {
    return this.catalogs_ids;
  } 
}